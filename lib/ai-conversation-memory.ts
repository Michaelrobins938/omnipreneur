import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface ConversationContext {
  userPreferences?: Record<string, any>;
  projectContext?: {
    niche?: string;
    targetAudience?: string;
    tone?: string;
    goals?: string[];
  };
  previousOutputs?: Array<{
    type: string;
    content: string;
    quality?: number;
    userFeedback?: string;
  }>;
  sessionData?: Record<string, any>;
}

export interface CreateConversationData {
  userId: string;
  productContext: string;
  sessionId?: string;
  title?: string;
  initialMessage?: ConversationMessage;
  context?: ConversationContext;
}

export interface UpdateConversationData {
  messages?: ConversationMessage[];
  context?: ConversationContext;
  qualityRating?: number;
  isSuccessful?: boolean;
  learningData?: any;
}

export class AIConversationMemory {
  /**
   * Create a new conversation session
   */
  static async createConversation(data: CreateConversationData) {
    try {
      const conversation = await prisma.aIConversation.create({
        data: {
          userId: data.userId,
          productContext: data.productContext,
          sessionId: data.sessionId || `session_${Date.now()}`,
          title: data.title || this.generateConversationTitle(data.initialMessage?.content),
          messages: data.initialMessage ? [data.initialMessage] : [],
          context: data.context || {},
          messageCount: data.initialMessage ? 1 : 0,
          lastMessageAt: new Date()
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  /**
   * Add message to existing conversation
   */
  static async addMessage(
    conversationId: string, 
    userId: string, 
    message: ConversationMessage,
    contextUpdates?: Partial<ConversationContext>
  ) {
    try {
      const conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId, userId }
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const existingMessages = conversation.messages as ConversationMessage[];
      const updatedMessages = [...existingMessages, message];
      
      // Update context if provided
      const existingContext = conversation.context as ConversationContext || {};
      const updatedContext = contextUpdates 
        ? { ...existingContext, ...contextUpdates }
        : existingContext;

      const updatedConversation = await prisma.aIConversation.update({
        where: { id: conversationId },
        data: {
          messages: updatedMessages,
          context: updatedContext,
          messageCount: updatedMessages.length,
          lastMessageAt: new Date(),
          totalTokens: { increment: this.estimateTokens(message.content) }
        }
      });

      return updatedConversation;
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Failed to add message to conversation');
    }
  }

  /**
   * Get conversation history with context
   */
  static async getConversation(conversationId: string, userId: string) {
    try {
      const conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId, userId }
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      return {
        ...conversation,
        messages: conversation.messages as ConversationMessage[],
        context: conversation.context as ConversationContext
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw new Error('Failed to get conversation');
    }
  }

  /**
   * Get recent conversations for context
   */
  static async getRecentConversations(
    userId: string, 
    productContext?: string, 
    limit: number = 10
  ) {
    try {
      const where: any = { userId };
      if (productContext) {
        where.productContext = productContext;
      }

      const conversations = await prisma.aIConversation.findMany({
        where,
        orderBy: { lastMessageAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          productContext: true,
          sessionId: true,
          messageCount: true,
          lastMessageAt: true,
          qualityRating: true,
          isSuccessful: true,
          context: true
        }
      });

      return conversations.map(conv => ({
        ...conv,
        context: conv.context as ConversationContext
      }));
    } catch (error) {
      console.error('Error getting recent conversations:', error);
      throw new Error('Failed to get recent conversations');
    }
  }

  /**
   * Build context from conversation history for AI generation
   */
  static async buildAIContext(
    userId: string, 
    productContext: string,
    currentSessionId?: string
  ): Promise<{
    conversationHistory: ConversationMessage[];
    userContext: ConversationContext;
    recommendations: string[];
  }> {
    try {
      // Get recent conversations for this product
      const recentConversations = await this.getRecentConversations(
        userId, 
        productContext, 
        5
      );

      // Get current session if specified
      let currentConversation = null;
      if (currentSessionId) {
        const conversations = await prisma.aIConversation.findMany({
          where: {
            userId,
            sessionId: currentSessionId,
            productContext
          },
          orderBy: { lastMessageAt: 'desc' },
          take: 1
        });
        currentConversation = conversations[0];
      }

      // Build conversation history
      const conversationHistory: ConversationMessage[] = [];
      if (currentConversation) {
        conversationHistory.push(...(currentConversation.messages as ConversationMessage[]));
      }

      // Aggregate user context from recent conversations
      const userContext: ConversationContext = {
        userPreferences: {},
        projectContext: {},
        previousOutputs: [],
        sessionData: {}
      };

      for (const conv of recentConversations) {
        const context = conv.context as ConversationContext;
        if (context.userPreferences) {
          Object.assign(userContext.userPreferences!, context.userPreferences);
        }
        if (context.projectContext) {
          Object.assign(userContext.projectContext!, context.projectContext);
        }
        if (context.previousOutputs) {
          userContext.previousOutputs!.push(...context.previousOutputs);
        }
      }

      // Generate recommendations based on patterns
      const recommendations = await this.generateRecommendations(
        userId, 
        productContext, 
        userContext
      );

      return {
        conversationHistory,
        userContext,
        recommendations
      };
    } catch (error) {
      console.error('Error building AI context:', error);
      return {
        conversationHistory: [],
        userContext: {},
        recommendations: []
      };
    }
  }

  /**
   * Update conversation with feedback for learning
   */
  static async updateConversationFeedback(
    conversationId: string,
    userId: string,
    updates: UpdateConversationData
  ) {
    try {
      const updatedConversation = await prisma.aIConversation.update({
        where: { id: conversationId, userId },
        data: {
          qualityRating: updates.qualityRating,
          isSuccessful: updates.isSuccessful,
          learningData: updates.learningData,
          updatedAt: new Date()
        }
      });

      // Store learning insights for future improvements
      if (updates.learningData) {
        await this.storeLearningInsights(userId, conversationId, updates.learningData);
      }

      return updatedConversation;
    } catch (error) {
      console.error('Error updating conversation feedback:', error);
      throw new Error('Failed to update conversation feedback');
    }
  }

  /**
   * Search conversations by content
   */
  static async searchConversations(
    userId: string,
    query: string,
    productContext?: string,
    limit: number = 20
  ) {
    try {
      const conversations = await prisma.aIConversation.findMany({
        where: {
          userId,
          productContext: productContext || undefined,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            // Note: Prisma doesn't support full-text search on JSON fields natively
            // You might want to implement a more sophisticated search later
          ]
        },
        orderBy: { lastMessageAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          productContext: true,
          messageCount: true,
          lastMessageAt: true,
          qualityRating: true,
          context: true
        }
      });

      // Filter by message content (client-side for now)
      const filteredConversations = conversations.filter(conv => {
        const messages = conv.messages as ConversationMessage[] || [];
        return messages.some(msg => 
          msg.content.toLowerCase().includes(query.toLowerCase())
        );
      });

      return filteredConversations.map(conv => ({
        ...conv,
        context: conv.context as ConversationContext
      }));
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw new Error('Failed to search conversations');
    }
  }

  /**
   * Get conversation analytics
   */
  static async getConversationAnalytics(userId: string) {
    try {
      // Total conversations
      const totalConversations = await prisma.aIConversation.count({
        where: { userId }
      });

      // Conversations by product
      const conversationsByProduct = await prisma.aIConversation.groupBy({
        by: ['productContext'],
        where: { userId },
        _count: { productContext: true }
      });

      // Average quality rating
      const qualityStats = await prisma.aIConversation.aggregate({
        where: { 
          userId,
          qualityRating: { not: null }
        },
        _avg: { qualityRating: true },
        _count: { qualityRating: true }
      });

      // Success rate
      const successStats = await prisma.aIConversation.aggregate({
        where: { 
          userId,
          isSuccessful: { not: null }
        },
        _count: { isSuccessful: true }
      });

      const successCount = await prisma.aIConversation.count({
        where: { 
          userId,
          isSuccessful: true
        }
      });

      // Recent activity
      const recentConversations = await prisma.aIConversation.findMany({
        where: { userId },
        orderBy: { lastMessageAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          productContext: true,
          lastMessageAt: true,
          messageCount: true
        }
      });

      return {
        totalConversations,
        conversationsByProduct: conversationsByProduct.reduce((acc, item) => {
          acc[item.productContext] = item._count.productContext;
          return acc;
        }, {} as Record<string, number>),
        averageQualityRating: qualityStats._avg.qualityRating || 0,
        successRate: successStats._count.isSuccessful > 0 
          ? (successCount / successStats._count.isSuccessful) * 100 
          : 0,
        recentActivity: recentConversations
      };
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      throw new Error('Failed to get conversation analytics');
    }
  }

  /**
   * Clean up old conversations (data retention)
   */
  static async cleanupOldConversations(
    userId: string, 
    daysToKeep: number = 90
  ) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const deletedConversations = await prisma.aIConversation.deleteMany({
        where: {
          userId,
          lastMessageAt: { lt: cutoffDate },
          qualityRating: null // Only delete unrated conversations
        }
      });

      return { deletedCount: deletedConversations.count };
    } catch (error) {
      console.error('Error cleaning up conversations:', error);
      throw new Error('Failed to cleanup old conversations');
    }
  }

  /**
   * Private helper methods
   */
  private static generateConversationTitle(content?: string): string {
    if (!content) return `Conversation ${new Date().toLocaleDateString()}`;
    
    // Extract first meaningful phrase
    const words = content.slice(0, 50).split(' ');
    return words.length > 8 ? words.slice(0, 8).join(' ') + '...' : content;
  }

  private static estimateTokens(content: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(content.length / 4);
  }

  private static async generateRecommendations(
    userId: string,
    productContext: string,
    userContext: ConversationContext
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Analyze successful patterns
    const successfulConversations = await prisma.aIConversation.findMany({
      where: {
        userId,
        productContext,
        isSuccessful: true,
        qualityRating: { gte: 4 }
      },
      take: 10,
      select: { context: true, learningData: true }
    });

    // Generate recommendations based on patterns
    if (userContext.projectContext?.niche) {
      recommendations.push(`Focus on ${userContext.projectContext.niche} content`);
    }

    if (userContext.userPreferences?.tone) {
      recommendations.push(`Maintain ${userContext.userPreferences.tone} tone`);
    }

    // Add more sophisticated pattern analysis here

    return recommendations;
  }

  private static async storeLearningInsights(
    userId: string,
    conversationId: string,
    learningData: any
  ) {
    try {
      // Store insights that can be used for user preference learning
      // This could be expanded to feed into a machine learning pipeline
      await prisma.event.create({
        data: {
          userId,
          event: 'ai_conversation_learning',
          metadata: {
            conversationId,
            learningData,
            timestamp: new Date()
          }
        }
      });
    } catch (error) {
      console.error('Error storing learning insights:', error);
    }
  }
}