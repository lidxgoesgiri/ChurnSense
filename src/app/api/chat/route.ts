import { NextResponse } from 'next/server';
import { env, hasAiProvider } from '@/lib/env';
import { getSession, unauthorizedResponse, parseJsonBody } from '@/lib/auth';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { validateModelId } from '@/lib/models';

const MAX_MESSAGE_LENGTH = 2000;

// Only these fields from client-supplied context are forwarded to the model,
// and only as primitives — blocks prompt-injection via crafted context objects.
const ALLOWED_CONTEXT_KEYS = [
  'projectName',
  'totalUsers',
  'activeUsers',
  'churnedUsers',
  'monthlyRevenue',
  'churnRate',
  'retentionRate',
  'arpu',
  'riskStatus',
];

function sanitizeContext(ctx: unknown): string {
  if (!ctx || typeof ctx !== 'object') return 'No project data yet.';
  const src = ctx as Record<string, unknown>;
  const safe: Record<string, string | number | boolean> = {};
  for (const key of ALLOWED_CONTEXT_KEYS) {
    const val = src[key];
    if (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    ) {
      safe[key] = val;
    }
  }
  return Object.keys(safe).length > 0
    ? JSON.stringify(safe, null, 2)
    : 'No project data yet.';
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  if (!rateLimit(`chat:${session}`, 20).allowed) return rateLimitResponse();

  const parsedBody = await parseJsonBody(request);
  if ('error' in parsedBody) return parsedBody.error;
  const { message, context, model, stream } = (parsedBody.data ?? {}) as Record<string, unknown>;

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  if (!hasAiProvider) {
    return NextResponse.json({
      reply:
        'AI provider is not configured. Set AI_BASE_URL, AI_API_KEY, and AI_MODEL to enable chat.',
    });
  }

  const systemPrompt = `You are a SaaS retention analyst assistant embedded in the ChurnSense dashboard. You have access to the following current project context:\n\n${sanitizeContext(
    context
  )}\n\nAnswer the user's question concisely in Indonesian or English (match their language). Be direct and actionable.`;

  const providerUrl = `${env.AI_BASE_URL!.replace(/\/+$/, '')}/chat/completions`;
  const providerBody = (streamed: boolean) =>
    JSON.stringify({
      model: validateModelId(model),
      temperature: 0.4,
      max_tokens: 600,
      stream: streamed,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });
  const providerHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.AI_API_KEY}`,
  };

  // Streaming path (#27): forward the model's tokens as a plain-text stream.
  if (stream === true) {
    try {
      const res = await fetch(providerUrl, {
        method: 'POST',
        headers: providerHeaders,
        body: providerBody(true),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok || !res.body) throw new Error(`AI provider returned ${res.status}`);

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const outStream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = res.body!.getReader();
          let buffer = '';
          try {
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() ?? '';
              for (const line of lines) {
                const t = line.trim();
                if (!t.startsWith('data:')) continue;
                const payload = t.slice(5).trim();
                if (payload === '[DONE]') {
                  controller.close();
                  return;
                }
                try {
                  const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
                  if (delta) controller.enqueue(encoder.encode(delta));
                } catch {
                  /* skip keep-alives / partial frames */
                }
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(outStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Accel-Buffering': 'no',
        },
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Chat failed';
      return NextResponse.json(
        { error: msg, reply: `Maaf, terjadi kesalahan: ${msg}. Silakan coba lagi.` },
        { status: 502 }
      );
    }
  }

  // Non-streaming path.
  try {
    const res = await fetch(providerUrl, {
      method: 'POST',
      headers: providerHeaders,
      body: providerBody(false),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) throw new Error(`AI provider returned ${res.status}`);
    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? 'No response.';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat failed';
    return NextResponse.json(
      { error: message, reply: `Maaf, terjadi kesalahan: ${message}. Silakan coba lagi.` },
      { status: 502 }
    );
  }
}
