export interface GeneratedImage {
  id: string;
  template: string; // "Template 1 - Environmental Pollution" or "Template 2 - Hygiene Types"
  category: string; // e.g., "Soil", "Personal"
  prompt: string;
  base64: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface CategoryConfig {
  name: string;
  subcategories: {
    name: string;
    count: number;
    keywords: string[];
  }[];
}

export type GenerationStatus = 'idle' | 'running' | 'paused' | 'finished';
