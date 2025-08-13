// CAL™ (Cognitive Architecture Layering) Engine
// Advanced AI orchestration system for multi-model optimization

import { BaseAIService, AIServiceConfig, AIResponse } from './base-ai-service';
import { logAIRequest } from '@/lib/db';

export interface CALConfig {
  primaryModel: AIServiceConfig;
  secondaryModel?: AIServiceConfig;
  qualityThreshold: number;
  enableFallback: boolean;
  enableQualityScoring: boolean;
  enableModelOrchestration: boolean;
  performance: {
    maxLatency: number;
    parallelProcessing: boolean;
    cacheEnabled: boolean;
  };
}

export interface CALLayer {
  name: string;
  purpose: string;
  model: AIServiceConfig;
  weight: number;
  enabled: boolean;
}

export interface CALResult extends AIResponse {
  qualityScore: number;
  layersUsed: string[];
  processingTime: number;
  modelPerformance: {
    primary: { latency: number; quality: number };
    secondary?: { latency: number; quality: number };
  };
  optimization: {
    tokenEfficiency: number;
    costEfficiency: number;
    accuracyScore: number;
  };
}

export class CALEngine extends BaseAIService {
  private config: CALConfig;
  private layers: CALLayer[] = [];

  constructor(calConfig: CALConfig) {
    super(calConfig.primaryModel);
    this.config = calConfig;
    this.initializeLayers();
  }

  private initializeLayers() {
    // Layer 1: Fast Processing (GPT-4o-mini)
    this.layers.push({
      name: 'Speed Layer',
      purpose: 'Fast initial processing and filtering',
      model: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.3 },
      weight: 0.2,
      enabled: true
    });

    // Layer 2: Quality Enhancement (GPT-4o)
    this.layers.push({
      name: 'Quality Layer', 
      purpose: 'High-quality content generation',
      model: { provider: 'openai', model: 'gpt-4o', temperature: 0.7 },
      weight: 0.5,
      enabled: true
    });

    // Layer 3: Reasoning Layer (Claude-3.5-Sonnet)
    this.layers.push({
      name: 'Reasoning Layer',
      purpose: 'Complex reasoning and analysis',
      model: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', temperature: 0.6 },
      weight: 0.3,
      enabled: !!process.env['ANTHROPIC_API_KEY']
    });
  }

  async process(input: any): Promise<CALResult> {
    const startTime = Date.now();
    
    try {
      const { prompt, systemPrompt, productId, userId } = input;
      
      // Step 1: Initial quality assessment
      const qualityAssessment = await this.assessComplexity(prompt);
      
      // Step 2: Select optimal processing strategy
      const strategy = this.selectProcessingStrategy(qualityAssessment);
      
      // Step 3: Execute multi-layer processing
      const result = await this.executeStrategy(strategy, prompt, systemPrompt);
      
      // Step 4: Quality scoring and optimization
      const qualityScore = await this.calculateQualityScore(result.content || '', prompt);
      
      // Step 5: Cost and performance optimization
      const optimization = this.calculateOptimization(result, startTime);
      
      const processingTime = Date.now() - startTime;
      
      // Log the request for analytics
      if (userId && productId) {
        await this.logCALRequest(userId, productId, result, processingTime, qualityScore);
      }
      
      return {
        ...result,
        qualityScore,
        layersUsed: strategy.layers,
        processingTime,
        modelPerformance: strategy.performance,
        optimization
      };
      
    } catch (error) {
      console.error('CAL Engine error:', error);
      // Fallback to basic generation
      const fallbackResult = await this.generateWithAI(input.prompt, input.systemPrompt);
      return {
        ...fallbackResult,
        qualityScore: 0.5,
        layersUsed: ['fallback'],
        processingTime: Date.now() - startTime,
        modelPerformance: { primary: { latency: 0, quality: 0.5 } },
        optimization: { tokenEfficiency: 0.5, costEfficiency: 0.5, accuracyScore: 0.5 }
      };
    }
  }

  private async assessComplexity(prompt: string): Promise<{
    complexity: 'simple' | 'moderate' | 'complex';
    requiresReasoning: boolean;
    estimatedTokens: number;
    contentType: string;
  }> {
    const wordCount = prompt.split(' ').length;
    const hasComplexKeywords = /analyze|compare|evaluate|strategy|complex|detailed|comprehensive/.test(prompt.toLowerCase());
    const hasCreativeKeywords = /create|generate|write|design|craft|compose/.test(prompt.toLowerCase());
    
    return {
      complexity: wordCount > 200 || hasComplexKeywords ? 'complex' : 
                  wordCount > 50 || hasCreativeKeywords ? 'moderate' : 'simple',
      requiresReasoning: hasComplexKeywords,
      estimatedTokens: Math.ceil(wordCount * 1.3), // Rough estimation
      contentType: hasCreativeKeywords ? 'creative' : hasComplexKeywords ? 'analytical' : 'simple'
    };
  }

  private selectProcessingStrategy(assessment: any): {
    layers: string[];
    models: AIServiceConfig[];
    performance: any;
    parallel: boolean;
  } {
    const enabledLayers = this.layers.filter(layer => layer.enabled);
    
    // Simple content: Use speed layer only
    if (assessment.complexity === 'simple') {
      return {
        layers: ['Speed Layer'],
        models: [enabledLayers.find(l => l.name === 'Speed Layer')!.model],
        performance: { primary: { latency: 500, quality: 0.7 } },
        parallel: false
      };
    }
    
    // Complex reasoning: Use reasoning layer primarily
    if (assessment.requiresReasoning && enabledLayers.some(l => l.name === 'Reasoning Layer')) {
      return {
        layers: ['Reasoning Layer', 'Quality Layer'],
        models: [
          enabledLayers.find(l => l.name === 'Reasoning Layer')!.model,
          enabledLayers.find(l => l.name === 'Quality Layer')!.model
        ],
        performance: { 
          primary: { latency: 2000, quality: 0.95 },
          secondary: { latency: 1500, quality: 0.85 }
        },
        parallel: this.config.performance.parallelProcessing
      };
    }
    
    // Default: Quality layer with speed layer backup
    return {
      layers: ['Quality Layer', 'Speed Layer'],
      models: [
        enabledLayers.find(l => l.name === 'Quality Layer')!.model,
        enabledLayers.find(l => l.name === 'Speed Layer')!.model
      ],
      performance: { 
        primary: { latency: 1200, quality: 0.85 },
        secondary: { latency: 600, quality: 0.75 }
      },
      parallel: false
    };
  }

  private async executeStrategy(
    strategy: any, 
    prompt: string, 
    systemPrompt?: string
  ): Promise<AIResponse> {
    const [primaryModel, secondaryModel] = strategy.models;
    
    try {
      // Execute primary model
      const primaryService = new BaseAIService(primaryModel);
      const primaryResult = await primaryService['generateWithAI'](prompt, systemPrompt);
      
      if (primaryResult.success && this.config.qualityThreshold <= 0.8) {
        return primaryResult;
      }
      
      // If primary fails or quality threshold not met, try secondary
      if (secondaryModel && this.config.enableFallback) {
        const secondaryService = new BaseAIService(secondaryModel);
        const secondaryResult = await secondaryService['generateWithAI'](prompt, systemPrompt);
        
        if (secondaryResult.success) {
          return secondaryResult;
        }
      }
      
      return primaryResult;
      
    } catch (error) {
      console.error('Strategy execution error:', error);
      throw error;
    }
  }

  private async calculateQualityScore(content: string, originalPrompt: string): Promise<number> {
    if (!this.config.enableQualityScoring || !content) {
      return 0.75; // Default score
    }
    
    try {
      // Use fast model for quality assessment
      const assessmentPrompt = `Rate the quality of this AI-generated content on a scale of 0.0 to 1.0.
      
Original prompt: "${originalPrompt}"

Generated content: "${content.substring(0, 1000)}..."

Consider: relevance, accuracy, clarity, completeness, creativity.
Respond with only a number between 0.0 and 1.0.`;

      const response = await this.callOpenAI(
        assessmentPrompt, 
        'You are a content quality assessor. Respond only with a decimal number.'
      );
      
      if (response.success && response.content) {
        const score = parseFloat(response.content.trim());
        return isNaN(score) ? 0.75 : Math.max(0, Math.min(1, score));
      }
      
      return 0.75;
      
    } catch (error) {
      console.error('Quality scoring error:', error);
      return 0.75;
    }
  }

  private calculateOptimization(result: AIResponse, startTime: number): {
    tokenEfficiency: number;
    costEfficiency: number;
    accuracyScore: number;
  } {
    const processingTime = Date.now() - startTime;
    const tokens = result.usage?.totalTokens || 0;
    
    // Token efficiency: lower token usage for same quality = higher efficiency
    const tokenEfficiency = tokens > 0 ? Math.max(0, 1 - (tokens / 4000)) : 0.5;
    
    // Cost efficiency: factor in processing time and token usage
    const costEfficiency = Math.max(0, 1 - (processingTime / this.config.performance.maxLatency));
    
    // Accuracy score: based on successful completion
    const accuracyScore = result.success ? 0.9 : 0.3;
    
    return {
      tokenEfficiency: Math.round(tokenEfficiency * 100) / 100,
      costEfficiency: Math.round(costEfficiency * 100) / 100,
      accuracyScore: Math.round(accuracyScore * 100) / 100
    };
  }

  private async logCALRequest(
    userId: string,
    productId: string, 
    result: AIResponse,
    processingTime: number,
    qualityScore: number
  ) {
    try {
      await logAIRequest({
        userId,
        productId: `${productId}_cal`,
        modelUsed: `CAL_${this.config.primaryModel.model}`,
        inputTokens: result.usage?.promptTokens,
        outputTokens: result.usage?.completionTokens,
        processingTimeMs: processingTime,
        success: result.success,
        inputData: { calEnabled: true, primaryModel: this.config.primaryModel.model },
        outputData: { qualityScore, contentLength: result.content?.length },
        qualityScore
      });
    } catch (error) {
      console.error('Failed to log CAL request:', error);
    }
  }

  // Public method to get optimal configuration for a specific use case
  static getOptimalConfig(useCase: 'speed' | 'quality' | 'reasoning' | 'balanced'): CALConfig {
    const baseConfig = {
      qualityThreshold: 0.8,
      enableFallback: true,
      enableQualityScoring: true,
      enableModelOrchestration: true,
      performance: {
        maxLatency: 10000,
        parallelProcessing: false,
        cacheEnabled: true
      }
    };

    switch (useCase) {
      case 'speed':
        return {
          ...baseConfig,
          primaryModel: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.3 },
          qualityThreshold: 0.6,
          performance: { ...baseConfig.performance, maxLatency: 3000 }
        };
      
      case 'quality':
        return {
          ...baseConfig,
          primaryModel: { provider: 'openai', model: 'gpt-4o', temperature: 0.7 },
          secondaryModel: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', temperature: 0.6 },
          qualityThreshold: 0.9,
          performance: { ...baseConfig.performance, maxLatency: 15000 }
        };
      
      case 'reasoning':
        return {
          ...baseConfig,
          primaryModel: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', temperature: 0.6 },
          secondaryModel: { provider: 'openai', model: 'gpt-4o', temperature: 0.7 },
          qualityThreshold: 0.85,
          performance: { ...baseConfig.performance, maxLatency: 20000 }
        };
      
      case 'balanced':
      default:
        return {
          ...baseConfig,
          primaryModel: { provider: 'openai', model: 'gpt-4o', temperature: 0.7 },
          secondaryModel: { provider: 'openai', model: 'gpt-4o-mini', temperature: 0.5 },
          qualityThreshold: 0.8,
          performance: { ...baseConfig.performance, maxLatency: 8000 }
        };
    }
  }
}

export default CALEngine;