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

const STORAGE_KEY = 'churnsense-ai-model';

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MODEL;
}

export function storeModel(model: string): void {
  localStorage.setItem(STORAGE_KEY, model);
}
