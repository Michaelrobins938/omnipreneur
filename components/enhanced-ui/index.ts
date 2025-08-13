// Enhanced UI Components for AI Services
// Week 2: Frontend & UX Implementation

// Results Display Components
export { default as ContentGenerationResults } from './ContentGenerationResults';
export { default as AutoRewriteResults } from './AutoRewriteResults';
export { default as BundleBuilderResults } from './BundleBuilderResults';
export { default as NicheDiscoveryResults } from './NicheDiscoveryResults';

// Loading State Components
export { 
  default as LoadingStates,
  ContentGenerationLoading,
  AutoRewriteLoading,
  BundleBuilderLoading,
  NicheDiscoveryLoading
} from './LoadingStates';

// Error Handling Components
export {
  default as ErrorStates,
  SubscriptionRequiredError,
  UsageLimitError,
  NetworkError,
  ServerError,
  TimeoutError,
  GenericError
} from './ErrorStates';

// Export Functionality
export { default as ExportResults } from './ExportResults';

// Type definitions for enhanced UI components
export interface ContentPiece {
  text: string;
  hashtags: string[];
  engagementScore: number;
  viralScore: number;
  hook?: string;
  callToAction?: string;
  seoKeywords?: string[];
  platformOptimizations?: {
    characterCount: string;
    bestTimeToPost: string;
    algorithmTips: string;
  };
}

export interface ContentResults {
  content: ContentPiece[];
  metrics: {
    totalGenerated: number;
    avgViralScore: number;
    avgEngagementScore: number;
    platformOptimization: number;
  };
  suggestions: string[];
  hashtags: string[];
}

export interface RewriteAnalysis {
  originalStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  rewrittenStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  improvements: {
    clarity: number;
    engagement: number;
    conciseness: number;
    tone: number;
    overall: number;
  };
}

export interface BundleAnalysis {
  complementarity: number;
  priceSpread: number;
  targetAlignmentScore: number;
  competitiveAdvantage: number;
  synergyScore: number;
}

export interface NicheIdea {
  keyword: string;
  demandScore: number;
  competitionScore: number;
  opportunityScore: number;
  searchVolume: number;
  difficulty: number;
  trends: {
    growth: 'rising' | 'stable' | 'declining';
    seasonality: string;
    forecast: number;
  };
  monetization: {
    avgPrice: number;
    revenueScore: number;
    conversionRate: number;
  };
}