import { NextResponse } from 'next/server';
import { env, hasAiProvider } from '@/lib/env';
import {
  getSession,
  unauthorizedResponse,
  csrfCheckOrigin,
  forbiddenResponse,
  parseJsonBody,
} from '@/lib/auth';
import { rateLimit, rateLimitResponse, rateLimitHeaders, clientIp } from '@/lib/rate-limit';
import { isAllowedModel, DEFAULT_MODEL } from '@/lib/models';
import { completeWithFallback, type ChatMsg } from '@/lib/ai-provider';

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

function safeContext(ctx: unknown): Record<string, string | number | boolean> {
  if (!ctx || typeof ctx !== 'object') return {};
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
  return safe;
}

function sanitizeContext(ctx: unknown): string {
  const safe = safeContext(ctx);
  return Object.keys(safe).length > 0 ? JSON.stringify(safe, null, 2) : 'No project data yet.';
}

// Deterministic, no-network chat fallback (#3.3 resilience). When every AI model
// returns empty/errors, the user still gets a useful, data-grounded answer
// instead of an error — mirroring how insights degrade to a rule-based engine.
function ruleBasedChatReply(message: string, ctx: unknown): string {
  const c = safeContext(ctx);
  if (Object.keys(c).length === 0) {
    return 'Analyze a project first (enter user counts and calculate metrics), then I can answer questions about its churn, retention, ARPU, and risk.';
  }
  const name = String(c.projectName ?? 'this project');
  const churn = typeof c.churnRate === 'number' ? (c.churnRate * 100).toFixed(1) : null;
  const ret = typeof c.retentionRate === 'number' ? (c.retentionRate * 100).toFixed(1) : null;
  const arpu = typeof c.arpu === 'number' ? c.arpu : null;
  const risk = typeof c.riskStatus === 'string' ? c.riskStatus : null;
  const q = message.toLowerCase();

  const parts: string[] = [];
  if (q.includes('churn') && churn) parts.push(`${name}'s churn rate is ${churn}%.`);
  if (q.includes('retention') && ret) parts.push(`Retention is ${ret}%.`);
  if ((q.includes('arpu') || q.includes('revenue')) && arpu !== null) parts.push(`ARPU is $${arpu}.`);
  if ((q.includes('risk') || q.includes('health')) && risk) parts.push(`Risk status is ${risk}.`);

  if (parts.length === 0) {
    const bits = [
      churn && `churn ${churn}%`,
      ret && `retention ${ret}%`,
      arpu !== null && `ARPU $${arpu}`,
      risk && `${risk} risk`,
    ].filter(Boolean);
    parts.push(`Here's a snapshot of ${name}: ${bits.join(', ')}.`);
  }
  if (risk === 'High') parts.push('Churn is elevated — prioritize churn-reason interviews and the highest-impact retention fix.');
  else if (risk === 'Medium') parts.push('Retention is workable but sensitive — watch first-30-day activation and re-engage at-risk accounts.');
  else if (risk === 'Low') parts.push('Fundamentals look healthy — consider an expansion-revenue upsell on your retained base.');

  parts.push('(AI service is briefly unavailable, so this is a rule-based summary.)');
  return parts.join(' ');
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorizedResponse();
  // Paid AI endpoint — origin-based CSRF: blocks cross-origin browser abuse but
  // allows legitimate non-browser API clients (#3.2).
  if (!csrfCheckOrigin(request)) return forbiddenResponse();

  const rl = rateLimit(`chat:${session}:${clientIp(request)}`, 20);
  if (!rl.allowed) return rateLimitResponse(rl);
  const rlHeaders = rateLimitHeaders(rl);

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

  // Whitelist gateway: reject an unauthorized model (Step6).
  if (model != null && model !== '' && !isAllowedModel(model)) {
    return NextResponse.json(
      { error: 'Invalid or unauthorized AI model requested' },
      { status: 400 }
    );
  }
  const resolvedModel = isAllowedModel(model) ? model : DEFAULT_MODEL;

  if (!hasAiProvider) {
    return NextResponse.json({
      reply:
        'AI provider is not configured. Set AI_BASE_URL, AI_API_KEY, and AI_MODEL to enable chat.',
    });
  }

  const systemPrompt = `You are a SaaS retention analyst assistant embedded in the ChurnSense dashboard. You have access to the following current project context:\n\n${sanitizeContext(
    context
  )}\n\nAnswer the user's question concisely in Indonesian or English (match their language). Be direct and actionable.`;

  const messages: ChatMsg[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message },
  ];

  // Streaming path (#27): forward the model's tokens as a plain-text stream.
  if (stream === true) {
    try {
      const res = await fetch(`${env.AI_BASE_URL!.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: resolvedModel,
          temperature: 0.4,
          max_tokens: 600,
          stream: true,
          messages,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok || !res.body) throw new Error(`AI provider returned ${res.status}`);

      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const outStream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = res.body!.getReader();
          let buffer = '';
          let enqueuedAny = false;
          try {
            let finished = false;
            while (!finished) {
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
                  finished = true;
                  break;
                }
                try {
                  const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
                  if (delta) {
                    controller.enqueue(encoder.encode(delta));
                    enqueuedAny = true;
                  }
                } catch {
                  /* skip keep-alives / partial frames */
                }
              }
            }
            // #2 fallback: if the primary model streamed nothing, fill the
            // response from the next model(s) so the user always gets an answer.
            if (!enqueuedAny) {
              const fb = await completeWithFallback(messages, resolvedModel, { maxTokens: 600, timeoutMs: 20_000 });
              // Last-resort: if every model is empty too, stream the deterministic
              // rule-based reply so the user never sees a blank answer (#3.3).
              controller.enqueue(encoder.encode(fb || ruleBasedChatReply(message, context)));
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
          ...rlHeaders,
        },
      });
    } catch (error: unknown) {
      // Log the real cause server-side; degrade to the deterministic rule-based
      // reply so the user still gets a data-grounded answer, not raw detail (#3.3, #4.5).
      console.error('[chat.POST] stream error:', error instanceof Error ? error.message : error);
      return NextResponse.json(
        { reply: ruleBasedChatReply(message, context), fallback: true },
        { headers: rlHeaders }
      );
    }
  }

  // Non-streaming path — cycles through models on empty responses (#2), then
  // degrades to the deterministic rule-based reply if every model fails (#3.3).
  try {
    const reply = await completeWithFallback(messages, resolvedModel, { maxTokens: 600, timeoutMs: 20_000 });
    if (reply) return NextResponse.json({ reply }, { headers: rlHeaders });
    return NextResponse.json(
      { reply: ruleBasedChatReply(message, context), fallback: true },
      { headers: rlHeaders }
    );
  } catch (error: unknown) {
    console.error('[chat.POST] error:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { reply: ruleBasedChatReply(message, context), fallback: true },
      { headers: rlHeaders }
    );
  }
}
