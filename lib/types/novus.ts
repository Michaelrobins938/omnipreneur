// NOVUS Protocol TypeScript interfaces

export type NovusStrategy = 'clarity' | 'specificity' | 'context' | 'structure' | 'all';
export type NovusUseCase = 'general' | 'creative' | 'technical' | 'business';

export interface NovusOptimizationRequest {
  prompt: string;
  strategy: NovusStrategy;
  outputCount: number;
  targetUseCase: NovusUseCase;
  userId: string;
}

export interface NovusPromptScore {
  clarity: number;
  specificity: number;
  effectiveness: number;
  overall: number;
}

export interface NovusOptimizedPrompt {
  version: string;
  prompt: string;
  strategy: string;
  improvements: string[];
  score: NovusPromptScore;
}

export interface NovusAnalysisResult {
  originalScore: NovusPromptScore;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface NovusOptimizationResult {
  originalPrompt: string;
  optimizedPrompts: NovusOptimizedPrompt[];
  analysis: NovusAnalysisResult;
  processingTime: number;
}

export interface NovusHistoryItem {
  id: string;
  createdAt: string;
  originalPrompt: string;
  optimizedPrompt: string;
  style?: string | null;
  format?: string | null;
  context?: string | null;
  improvements?: unknown;
}

