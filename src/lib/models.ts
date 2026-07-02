export interface ModelOption {
  id: string;
  label: string;
  provider: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    label: 'Nemotron 3 Ultra 550B',
    provider: 'NVIDIA (OpenRouter)',
  },
  {
    id: 'nvidia/nemotron-3.5-content-safety:free',
    label: 'Nemotron 3.5 Content Safety',
    provider: 'NVIDIA (OpenRouter)',
  },
  {
    id: 'poolside/laguna-m.1:free',
    label: 'Laguna M.1',
    provider: 'Poolside (OpenRouter)',
  },
];

export const DEFAULT_MODEL = AVAILABLE_MODELS[0].id;

/** Allowed model IDs, for server-side validation of client-supplied models. */
export const ALLOWED_MODEL_IDS = new Set(AVAILABLE_MODELS.map((m) => m.id));

/**
 * Return the requested model only if it is on the allow-list; otherwise fall
 * back to the default. Prevents clients from invoking arbitrary (expensive)
 * models by sending an unknown model ID.
 */
export function validateModelId(id?: unknown): string {
  return typeof id === 'string' && ALLOWED_MODEL_IDS.has(id) ? id : DEFAULT_MODEL;
}

const STORAGE_KEY = 'churnsense-ai-model';

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MODEL;
}

export function storeModel(model: string): void {
  localStorage.setItem(STORAGE_KEY, model);
}
