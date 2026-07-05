export type ModelTier = 'premium' | 'strong' | 'fast';

export interface ModelOption {
  id: string;
  label: string;
  provider: string;
  /** Capability tier — drives the selector's colour glow. */
  tier: ModelTier;
  /** false = not a general chat model, so it is never used as an auto-fallback. */
  chat?: boolean;
}

// OpenRouter roster (Step4). The premium 550B ultra is the analytical default.
export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', label: 'Nemotron 3 Ultra 550B', provider: 'NVIDIA', tier: 'premium' },
  { id: 'openai/gpt-oss-120b:free', label: 'GPT-OSS 120B', provider: 'OpenAI', tier: 'strong' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', label: 'Nemotron 3 Super 120B', provider: 'NVIDIA', tier: 'strong' },
  { id: 'google/gemma-4-31b-it:free', label: 'Gemma 4 31B', provider: 'Google', tier: 'strong' },
  { id: 'qwen/qwen3-coder:free', label: 'Qwen3 Coder', provider: 'Qwen', tier: 'fast' },
  { id: 'poolside/laguna-m.1:free', label: 'Laguna M.1', provider: 'Poolside', tier: 'fast' },
  { id: 'poolside/laguna-xs-2.1:free', label: 'Laguna XS 2.1', provider: 'Poolside', tier: 'fast' },
  { id: 'cohere/north-mini-code:free', label: 'North Mini Code', provider: 'Cohere', tier: 'fast' },
  { id: 'liquid/lfm-2.5-1.2b-thinking:free', label: 'LFM 2.5 1.2B Thinking', provider: 'Liquid', tier: 'fast' },
  // Safety classifier — selectable but never auto-fallback target.
  { id: 'nvidia/nemotron-3.5-content-safety:free', label: 'Nemotron 3.5 Safety', provider: 'NVIDIA', tier: 'fast', chat: false },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

/** Allowed model IDs — the whitelist gateway against model injection. */
export const ALLOWED_MODEL_IDS = new Set(AVAILABLE_MODELS.map((m) => m.id));

/** True only for a whitelisted model id. */
export function isAllowedModel(id?: unknown): id is string {
  return typeof id === 'string' && ALLOWED_MODEL_IDS.has(id);
}

/** Resolve to a whitelisted model, falling back to the default (internal use). */
export function validateModelId(id?: unknown): string {
  return isAllowedModel(id) ? id : DEFAULT_MODEL;
}

/** Colour glow per tier for the selector (cinematic). */
export const TIER_GLOW: Record<ModelTier, string> = {
  premium: '#a855f7', // purple
  strong: '#3b82f6', // blue
  fast: '#22c55e', // green
};

const STORAGE_KEY = 'churnsense-ai-model';

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  const stored = localStorage.getItem(STORAGE_KEY);
  return isAllowedModel(stored) ? stored : DEFAULT_MODEL;
}

export function storeModel(model: string): void {
  localStorage.setItem(STORAGE_KEY, model);
}
