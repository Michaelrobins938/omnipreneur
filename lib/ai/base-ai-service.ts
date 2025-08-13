import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/lib/config';
import { ContentLibraryService } from '@/lib/content-library';
import { AIConversationMemory, ConversationMessage, ConversationContext } from '@/lib/ai-conversation-memory';

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic';
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export abstract class BaseAIService {
  protected openai: OpenAI;
  protected anthropic: Anthropic;
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
    
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'] || ''
    });
    
    // Initialize Anthropic
    this.anthropic = new Anthropic({
      apiKey: process.env['ANTHROPIC_API_KEY'] || ''
    });
  }

  protected async callOpenAI(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const messages: any[] = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      
      messages.push({ role: 'user', content: prompt });
      
      const response = await this.openai.chat.completions.create({
        model: this.config.model || 'gpt-4-turbo-preview',
        messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 2000
      });
      
      return {
        success: true,
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  protected async callAnthropic(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const response = await (this.anthropic as any).messages.create({
        model: this.config.model || 'claude-3-sonnet-20241022',
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature || 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });
      
      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      return {
        success: true,
        content,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        }
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  protected async generateWithAI(prompt: string, systemPrompt?: string): Promise<AIResponse> {
    if (this.config.provider === 'anthropic') {
      return this.callAnthropic(prompt, systemPrompt);
    }
    return this.callOpenAI(prompt, systemPrompt);
  }

  // Context-aware generation with conversation memory
  protected async generateWithContext(
    userId: string,
    productContext: string,
    prompt: string,
    sessionId?: string,
    systemPrompt?: string
  ): Promise<AIResponse & { conversationId?: string }> {
    try {
      // Build context from conversation history
      const context = await AIConversationMemory.buildAIContext(
        userId,
        productContext,
        sessionId
      );

      // Enhance system prompt with user context
      let enhancedSystemPrompt = systemPrompt || '';
      
      if (context.userContext.userPreferences) {
        enhancedSystemPrompt += `\n\nUser Preferences: ${JSON.stringify(context.userContext.userPreferences)}`;
      }

      if (context.userContext.projectContext) {
        enhancedSystemPrompt += `\n\nProject Context: ${JSON.stringify(context.userContext.projectContext)}`;
      }

      if (context.recommendations.length > 0) {
        enhancedSystemPrompt += `\n\nRecommendations: ${context.recommendations.join(', ')}`;
      }

      // Add conversation history to prompt context
      let enhancedPrompt = prompt;
      if (context.conversationHistory.length > 0) {
        const recentMessages = context.conversationHistory.slice(-5); // Last 5 messages
        const historyContext = recentMessages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join('\n');
        enhancedPrompt = `Previous conversation:\n${historyContext}\n\nCurrent request: ${prompt}`;
      }

      // Generate AI response
      const response = await this.generateWithAI(enhancedPrompt, enhancedSystemPrompt);

      // Store conversation if successful
      let conversationId: string | undefined;
      if (response.success && response.content) {
        try {
          // Create or update conversation
          const conversation = await AIConversationMemory.createConversation({
            userId,
            productContext,
            sessionId: sessionId || `session_${Date.now()}`,
            initialMessage: {
              role: 'user',
              content: prompt,
              timestamp: new Date()
            }
          });

          // Add AI response
          await AIConversationMemory.addMessage(
            conversation.id,
            userId,
            {
              role: 'assistant',
              content: response.content,
              timestamp: new Date(),
              metadata: {
                model: this.config.model,
                provider: this.config.provider,
                usage: response.usage
              }
            }
          );

          conversationId = conversation.id;
        } catch (error) {
          console.error('Failed to store conversation:', error);
          // Don't fail the generation if conversation storage fails
        }
      }

      return {
        ...response,
        conversationId
      };
    } catch (error) {
      console.error('Error in context-aware generation:', error);
      // Fallback to regular generation
      return this.generateWithAI(prompt, systemPrompt);
    }
  }

  // Update conversation with user feedback
  protected async updateConversationFeedback(
    conversationId: string,
    userId: string,
    rating: number,
    isSuccessful?: boolean,
    learningData?: any
  ) {
    try {
      await AIConversationMemory.updateConversationFeedback(
        conversationId,
        userId,
        {
          qualityRating: rating,
          isSuccessful,
          learningData
        }
      );
    } catch (error) {
      console.error('Failed to update conversation feedback:', error);
    }
  }

  // Auto-save content to library after generation
  protected async autoSaveToLibrary(
    userId: string,
    title: string,
    content: string,
    contentType: string,
    productSource: string,
    metadata?: {
      originalPrompt?: string;
      tags?: string[];
      keywords?: string[];
      targetAudience?: string;
      niche?: string;
      qualityScore?: number;
    }
  ) {
    try {
      await ContentLibraryService.autoSaveContent({
        userId,
        title,
        content,
        contentType,
        productSource,
        originalPrompt: metadata?.originalPrompt,
        tags: metadata?.tags,
        keywords: metadata?.keywords,
        targetAudience: metadata?.targetAudience,
        niche: metadata?.niche,
        qualityScore: metadata?.qualityScore
      });
    } catch (error) {
      console.error('Failed to auto-save content to library:', error);
      // Don't throw - auto-save failure shouldn't break the main functionality
    }
  }

  // Abstract method to be implemented by each AI product service
  abstract process(input: any): Promise<any>;
}