import { NextResponse } from 'next/server';
import { env, hasAiProvider } from '@/lib/env';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!hasAiProvider) {
      return NextResponse.json({
        reply: 'AI provider is not configured. Set AI_BASE_URL, AI_API_KEY, and AI_MODEL to enable chat.',
      });
    }

    const systemPrompt = `You are a SaaS retention analyst assistant embedded in the ChurnSense dashboard. You have access to the following current project context:\n\n${context ? JSON.stringify(context, null, 2) : 'No project data yet.'}\n\nAnswer the user's question concisely in Indonesian or English (match their language). Be direct and actionable.`;

    const res = await fetch(`${env.AI_BASE_URL!.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) throw new Error(`AI provider returned ${res.status}`);
    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? 'No response.';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat failed';
    return NextResponse.json(
      { reply: `Error: ${message}. The mock engine can answer basic questions once a project is analyzed.` },
      { status: 200 }
    );
  }
}
