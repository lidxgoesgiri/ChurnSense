import { ProjectInput, AnalyticsResult, AIInsightResult } from '@/types';
import { hasAiProvider } from '@/lib/env';
import { callModel, modelFallbackOrder } from '@/lib/ai-provider';
import type { TrendResult } from '@/lib/trend';

/**
 * Provider-agnostic AI insight generator.
 *
 * Works with ANY OpenAI-compatible chat-completions endpoint — set:
 *   AI_BASE_URL   e.g. https://api.groq.com/openai/v1
 *   AI_API_KEY    the provider key
 *   AI_MODEL      e.g. llama-3.3-70b-versatile
 *
 * Free options that expose this contract: Groq, OpenRouter (free models),
 * Google Gemini (OpenAI-compatible mode), Mistral, Together, DeepInfra.
 *
 * When no key is configured (or the provider errors), it falls back to a
 * deterministic rule-based insight so the endpoint always returns 200 and the
 * app builds/deploys/tests green without any paid dependency.
 */

export type InsightSource = 'ai' | 'mock';
export type Insight = AIInsightResult & { source: InsightSource };

interface InsightArgs {
  project: ProjectInput;
  metrics: AnalyticsResult;
  trend?: TrendResult;
  model?: string;
}

function trendSentence(trend?: TrendResult): string | null {
  if (!trend || trend.anomaly === 'insufficient-data' || trend.movingAverage === null) {
    return null;
  }
  const cur = (trend.deviation ?? 0) >= 0 ? 'above' : 'below';
  const ma = (trend.movingAverage * 100).toFixed(1);
  if (trend.anomaly === 'spike') {
    return `Churn spiked to ${cur} its ${ma}% trailing average (last ${trend.points} periods) — an anomalous jump.`;
  }
  if (trend.anomaly === 'drop') {
    return `Churn dropped ${cur} its ${ma}% trailing average (last ${trend.points} periods) — an anomalous improvement.`;
  }
  return `Churn is in line with its ${ma}% trailing average (last ${trend.points} periods).`;
}

function buildPrompt(project: ProjectInput, metrics: AnalyticsResult, trend?: TrendResult): string {
  const lines = [
    'Analyze this SaaS product\'s retention health.',
    '',
    `Project: ${project.projectName}`,
    `Total users: ${project.totalUsers}`,
    `Active users: ${project.activeUsers}`,
    `Churned users: ${project.churnedUsers}`,
    `Monthly revenue: $${project.monthlyRevenue}`,
    '',
    'Computed metrics:',
    `- Churn rate: ${(metrics.churnRate * 100).toFixed(2)}%`,
    `- Retention rate: ${(metrics.retentionRate * 100).toFixed(2)}%`,
    `- ARPU: $${metrics.arpu}`,
    `- Risk status: ${metrics.riskStatus}`,
  ];
  const ts = trendSentence(trend);
  if (ts) {
    lines.push('', `Historical trend: ${ts}`);
  }
  lines.push(
    '',
    'Respond ONLY with a compact JSON object of this exact shape:',
    '{"summary": string (max 3 sentences), "recommendation": string (one actionable step), "riskLevel": "Low" | "Medium" | "High"}'
  );
  return lines.join('\n');
}

/** Best-effort extraction of the insight JSON from a model response. */
function parseInsight(content: string): AIInsightResult | null {
  const tryParse = (s: string): AIInsightResult | null => {
    try {
      const o = JSON.parse(s);
      if (typeof o.summary === 'string' && typeof o.recommendation === 'string') {
        const level = ['Low', 'Medium', 'High'].includes(o.riskLevel) ? o.riskLevel : undefined;
        return {
          summary: o.summary,
          recommendation: o.recommendation,
          riskLevel: level ?? 'Medium',
        };
      }
    } catch {
      /* fallthrough */
    }
    return null;
  };

  const direct = tryParse(content.trim());
  if (direct) return direct;

  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start !== -1 && end > start) {
    return tryParse(content.slice(start, end + 1));
  }
  return null;
}

/** Deterministic fallback — no network, always available. */
export function mockInsight(
  project: ProjectInput,
  metrics: AnalyticsResult,
  trend?: TrendResult
): AIInsightResult {
  const churnPct = (metrics.churnRate * 100).toFixed(1);
  const retPct = (metrics.retentionRate * 100).toFixed(1);

  const byRisk: Record<AnalyticsResult['riskStatus'], { summary: string; recommendation: string }> = {
    Low: {
      summary: `${project.projectName} is healthy: ${retPct}% retention with churn at just ${churnPct}% and ARPU of $${metrics.arpu}. Growth fundamentals look solid.`,
      recommendation: 'Double down on the acquisition channels driving these retained users and introduce an expansion-revenue upsell.',
    },
    Medium: {
      summary: `${project.projectName} shows moderate risk: churn is ${churnPct}% against ${retPct}% retention, with ARPU of $${metrics.arpu}. Retention is workable but trending sensitive.`,
      recommendation: 'Instrument an early-warning cohort on first-30-day activation and trigger a re-engagement campaign for at-risk accounts.',
    },
    High: {
      summary: `${project.projectName} is at high churn risk: ${churnPct}% of users churned versus ${retPct}% retained, with ARPU of $${metrics.arpu}. Revenue is exposed.`,
      recommendation: 'Run churn-reason interviews this week and ship the single highest-impact retention fix before scaling spend.',
    },
  };

  const pick = byRisk[metrics.riskStatus];
  const ts = trendSentence(trend);
  const summary = ts ? `${pick.summary} ${ts}` : pick.summary;
  return { summary, recommendation: pick.recommendation, riskLevel: metrics.riskStatus };
}

export async function generateInsight({ project, metrics, trend, model }: InsightArgs): Promise<Insight> {
  if (!hasAiProvider) {
    return { ...mockInsight(project, metrics, trend), source: 'mock' };
  }

  const messages = [
    {
      role: 'system' as const,
      content:
        'You are a SaaS retention analyst. Reply with a single compact JSON object only — no prose, no markdown fences.',
    },
    { role: 'user' as const, content: buildPrompt(project, metrics, trend) },
  ];

  // Try the preferred model, then fall back through the other allow-listed
  // models on empty/unparseable/failed responses before the rule-based mock.
  for (const candidate of modelFallbackOrder(model)) {
    try {
      const content = await callModel(candidate, messages, { maxTokens: 400, timeoutMs: 15_000 });
      const parsed = parseInsight(content);
      if (parsed) return { ...parsed, source: 'ai' };
    } catch {
      /* try the next model */
    }
  }

  // Graceful degradation — the product stays usable even if every model fails.
  return { ...mockInsight(project, metrics, trend), source: 'mock' };
}
