// Enhanced AI Service with CAL™ Integration
// Provides advanced AI capabilities with multi-model orchestration

import { BaseAIService, AIServiceConfig, AIResponse } from './base-ai-service';
import { CALEngine, CALConfig, CALResult } from './cal-engine';
import { ContentLibraryService } from '@/lib/content-library';
import { AIConversationMemory } from '@/lib/ai-conversation-memory';

export interface EnhancedAIRequest {
  prompt: string;
  systemPrompt?: string;
  userId?: string;
  productId?: string;
  sessionId?: string;
  useCase?: 'speed' | 'quality' | 'reasoning' | 'balanced';
  enableCAL?: boolean;
  autoSave?: boolean;
  contentMetadata?: {
    title?: string;
    contentType?: string;
    tags?: string[];
    targetAudience?: string;
    niche?: string;
  };
}

export interface EnhancedAIResponse extends CALResult {
  conversationId?: string;
  contentSaved?: boolean;
  recommendations?: string[];
  insights?: {
    promptOptimization?: string;
    contentImprovement?: string;
    performanceMetrics?: any;
  };
}

export class EnhancedAIService extends BaseAIService {
  private calEngine?: CALEngine;
  private defaultUseCase: 'speed' | 'quality' | 'reasoning' | 'balanced' = 'balanced';

  constructor(config?: AIServiceConfig, enableCAL: boolean = true) {
    super(config || { provider: 'openai', model: 'gpt-4o' });
    
    if (enableCAL) {
      this.initializeCAL();
    }
  }

  private initializeCAL() {
    try {
      const calConfig = CALEngine.getOptimalConfig(this.defaultUseCase);
      this.calEngine = new CALEngine(calConfig);
    } catch (error) {
      console.error('Failed to initialize CAL engine:', error);
      this.calEngine = undefined;
    }
  }

  async process(request: EnhancedAIRequest): Promise<EnhancedAIResponse> {
    const startTime = Date.now();
    
    try {
      // Step 1: Optimize prompt if needed
      const optimizedPrompt = await this.optimizePrompt(request.prompt, request.productId);
      
      // Step 2: Generate content using CAL or fallback
      let result: CALResult | AIResponse;
      
      if (request.enableCAL !== false && this.calEngine) {
        result = await this.calEngine.process({
          prompt: optimizedPrompt,
          systemPrompt: request.systemPrompt,
          userId: request.userId,
          productId: request.productId
        });
      } else {
        // Fallback to context-aware generation if CAL disabled
        if (request.userId && request.productId) {
          const contextResult = await this.generateWithContext(
            request.userId,
            request.productId,
            optimizedPrompt,
            request.sessionId,
            request.systemPrompt
          );
          result = {
            ...contextResult,
            qualityScore: 0.75,
            layersUsed: ['standard'],
            processingTime: Date.now() - startTime,
            modelPerformance: { primary: { latency: 1000, quality: 0.75 } },
            optimization: { tokenEfficiency: 0.7, costEfficiency: 0.7, accuracyScore: 0.8 }
          };
        } else {
          const basicResult = await this.generateWithAI(optimizedPrompt, request.systemPrompt);
          result = {
            ...basicResult,
            qualityScore: 0.7,
            layersUsed: ['basic'],
            processingTime: Date.now() - startTime,
            modelPerformance: { primary: { latency: 800, quality: 0.7 } },
            optimization: { tokenEfficiency: 0.6, costEfficiency: 0.6, accuracyScore: 0.75 }
          };
        }
      }

      // Step 3: Auto-save to content library if enabled
      let contentSaved = false;
      if (request.autoSave && request.userId && result.success && result.content) {
        contentSaved = await this.autoSaveContent(request, result.content);
      }

      // Step 4: Generate insights and recommendations
      const insights = await this.generateInsights(request, result);
      const recommendations = await this.generateRecommendations(request, result);

      return {
        ...result,
        contentSaved,
        recommendations,
        insights
      } as EnhancedAIResponse;

    } catch (error) {
      console.error('Enhanced AI Service error:', error);
      
      // Fallback response
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        qualityScore: 0,
        layersUsed: ['error'],
        processingTime: Date.now() - startTime,
        modelPerformance: { primary: { latency: 0, quality: 0 } },
        optimization: { tokenEfficiency: 0, costEfficiency: 0, accuracyScore: 0 },
        contentSaved: false,
        recommendations: ['Try simplifying your request', 'Check your API keys and try again']
      };
    }
  }

  private async optimizePrompt(prompt: string, productId?: string): Promise<string> {
    // Basic prompt optimization - could be enhanced with AI
    let optimized = prompt.trim();
    
    // Add context based on product
    if (productId) {
      const contextualIntros = {
        'content-spawner': 'As an expert content creator, ',
        'bundle-builder': 'As a digital product strategist, ',
        'affiliate-portal': 'As an affiliate marketing expert, ',
        'email-marketing': 'As an email marketing specialist, ',
        'auto-niche': 'As a niche research analyst, ',
        'seo-analyzer': 'As an SEO expert, '
      };
      
      const intro = contextualIntros[productId as keyof typeof contextualIntros];
      if (intro && !optimized.toLowerCase().includes('expert')) {
        optimized = intro + optimized;
      }
    }
    
    // Ensure clear instructions
    if (!optimized.includes('Please') && !optimized.includes('Create') && !optimized.includes('Generate')) {
      optimized = 'Please ' + optimized.charAt(0).toLowerCase() + optimized.slice(1);
    }
    
    return optimized;
  }

  private async autoSaveContent(request: EnhancedAIRequest, content: string): Promise<boolean> {
    try {
      if (!request.userId || !content) return false;
      
      const metadata = request.contentMetadata || {};
      
      await this.autoSaveToLibrary(
        request.userId,
        metadata.title || `Generated Content - ${new Date().toLocaleDateString()}`,
        content,
        metadata.contentType || 'GENERATED',
        request.productId || 'enhanced-ai',
        {
          originalPrompt: request.prompt,
          tags: metadata.tags,
          targetAudience: metadata.targetAudience,
          niche: metadata.niche,
          qualityScore: 0.8 // Will be updated with actual score
        }
      );
      
      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }

  private async generateInsights(
    request: EnhancedAIRequest, 
    result: any
  ): Promise<any> {
    try {
      // Generate performance insights
      const performanceMetrics = {
        responseTime: result.processingTime,
        qualityScore: result.qualityScore,
        tokenEfficiency: result.optimization?.tokenEfficiency,
        modelUsed: result.layersUsed?.[0] || 'unknown'
      };

      // Basic prompt optimization suggestions
      let promptOptimization;
      if (request.prompt.length < 20) {
        promptOptimization = 'Consider adding more context and specific requirements to your prompt for better results.';
      } else if (request.prompt.length > 500) {
        promptOptimization = 'Your prompt is quite long. Consider breaking it into smaller, focused requests.';
      } else {
        promptOptimization = 'Your prompt length is optimal for generating quality content.';
      }

      // Content improvement suggestions
      let contentImprovement;
      if (result.qualityScore < 0.7) {
        contentImprovement = 'Consider refining your request or adding more specific details for higher quality output.';
      } else if (result.qualityScore > 0.9) {
        contentImprovement = 'Excellent quality! This content is ready for use or minor refinement.';
      } else {
        contentImprovement = 'Good quality content. Consider reviewing and polishing before final use.';
      }

      return {
        promptOptimization,
        contentImprovement,
        performanceMetrics
      };
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return {};
    }
  }

  private async generateRecommendations(
    request: EnhancedAIRequest,
    result: any
  ): Promise<string[]> {
    const recommendations: string[] = [];
    
    try {
      // Performance-based recommendations
      if (result.processingTime > 5000) {
        recommendations.push('Consider using "speed" mode for faster responses');
      }
      
      if (result.qualityScore < 0.7) {
        recommendations.push('Try adding more specific requirements to your prompt');
        recommendations.push('Consider using "quality" mode for better results');
      }
      
      // Feature recommendations
      if (!request.autoSave && request.userId) {
        recommendations.push('Enable auto-save to build your content library');
      }
      
      if (!request.sessionId) {
        recommendations.push('Use session IDs to maintain conversation context');
      }
      
      // Product-specific recommendations
      if (request.productId === 'content-spawner') {
        recommendations.push('Consider batch generating multiple content pieces');
      } else if (request.productId === 'bundle-builder') {
        recommendations.push('Add pricing strategy details for better bundle suggestions');
      }
      
      return recommendations.slice(0, 3); // Limit to top 3 recommendations
      
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      return ['Check our documentation for tips on improving results'];
    }
  }

  // Convenience methods for different use cases
  async generateContent(
    prompt: string,
    options: {
      userId?: string;
      productId?: string;
      useCase?: 'speed' | 'quality' | 'reasoning' | 'balanced';
      autoSave?: boolean;
    } = {}
  ): Promise<EnhancedAIResponse> {
    return this.process({
      prompt,
      ...options,
      enableCAL: true
    });
  }

  async optimizeForSpeed(prompt: string, userId?: string): Promise<EnhancedAIResponse> {
    return this.process({
      prompt,
      userId,
      useCase: 'speed',
      enableCAL: true
    });
  }

  async optimizeForQuality(prompt: string, userId?: string): Promise<EnhancedAIResponse> {
    return this.process({
      prompt,
      userId,
      useCase: 'quality',
      enableCAL: true
    });
  }

  async optimizeForReasoning(prompt: string, userId?: string): Promise<EnhancedAIResponse> {
    return this.process({
      prompt,
      userId,
      useCase: 'reasoning',
      enableCAL: true
    });
  }

  // Remove duplicate process; Base class requires one implementation already provided above
}

export default EnhancedAIService;