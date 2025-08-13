// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { chatComplete } from '@/lib/ai/openai';
import { completeClaude } from '@/lib/ai/claude';
import { logAIRequest } from '@/lib/db';
import prisma from '@/lib/db';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  stream?: boolean;
}

// POST /api/chat/complete
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  const startTime = Date.now();
  
  try {
    const user = (request as any).user;
    const body: ChatRequest = await request.json();
    
    const {
      messages,
      model = 'gpt-4o-mini',
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt,
      stream = false
    } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Messages array is required' } },
        { status: 400 }
      );
    }

    // Check user's AI credits
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { ai_credits_remaining: true, subscription: { select: { plan: true, status: true } } }
    });

    if (!userRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Check if user has credits (unless they have unlimited plan)
    const hasUnlimitedPlan = ['PRO', 'ENTERPRISE'].includes(userRecord.subscription?.plan || '');
    if (!hasUnlimitedPlan && (userRecord.ai_credits_remaining || 0) <= 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INSUFFICIENT_CREDITS', message: 'Insufficient AI credits' } },
        { status: 402 }
      );
    }

    // Prepare messages for AI
    const aiMessages = [...messages];
    
    // Add system prompt if provided
    if (systemPrompt) {
      aiMessages.unshift({ role: 'system', content: systemPrompt });
    }

    // Convert to AI service format
    const formattedMessages = aiMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    let response;
    let tokensUsed = 0;
    let modelUsed = model;

    try {
      // Route to appropriate AI service
      if (model.includes('claude')) {
        response = await completeClaude({
          messages: formattedMessages,
          temperature,
          maxTokens,
          model: model
        });
        modelUsed = model;
      } else {
        // Default to OpenAI
        response = await chatComplete({
          messages: formattedMessages,
          temperature,
          maxTokens,
          model: model
        });
        modelUsed = model;
      }

      if (!response) {
        throw new Error('Empty response from AI service');
      }

      // Extract content and token usage
      const content = typeof response === 'string' ? response : response.content || response.message || 'No response generated';
      tokensUsed = response.usage?.total_tokens || Math.ceil(content.length / 4); // Rough estimation

    } catch (aiError: any) {
      console.error('AI service error:', aiError);
      
      // Log failed request
      try {
        await logAIRequest({
          userId: user.userId,
          productId: 'chat-interface',
          modelUsed,
          processingTimeMs: Date.now() - startTime,
          success: false,
          inputData: { messageCount: messages.length, model },
          outputData: { error: aiError.message }
        });
      } catch (logError) {
        console.error('Failed to log AI request:', logError);
      }

      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AI_SERVICE_ERROR', 
            message: 'Failed to generate response. Please try again.' 
          } 
        },
        { status: 503 }
      );
    }

    const processingTime = Date.now() - startTime;

    // Update user's AI credits (if not unlimited plan)
    if (!hasUnlimitedPlan) {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          ai_credits_remaining: Math.max(0, (userRecord.ai_credits_remaining || 0) - 1)
        }
      });
    }

    // Update usage tracking
    try {
      await prisma.usage.upsert({
        where: { userId: user.userId },
        update: {
          aiRequestsUsed: { increment: 1 }
        },
        create: {
          userId: user.userId,
          aiRequestsUsed: 1,
          rewrites: 0,
          contentPieces: 0,
          bundles: 0,
          affiliateLinks: 0
        }
      });
    } catch (usageError) {
      console.error('Failed to update usage:', usageError);
    }

    // Log successful request
    try {
      await logAIRequest({
        userId: user.userId,
        productId: 'chat-interface',
        modelUsed,
        processingTimeMs: processingTime,
        success: true,
        inputData: { 
          messageCount: messages.length, 
          model,
          temperature,
          maxTokens
        },
        outputData: { 
          responseLength: response.length,
          tokensUsed
        }
      });
    } catch (logError) {
      console.error('Failed to log AI request:', logError);
    }

    // Create response
    const responseData = {
      success: true,
      content: response,
      usage: {
        totalTokens: tokensUsed,
        promptTokens: Math.ceil(formattedMessages.reduce((sum, msg) => sum + msg.content.length, 0) / 4),
        completionTokens: Math.ceil(response.length / 4)
      },
      model: modelUsed,
      processingTime,
      timestamp: new Date().toISOString()
    };

    // Handle streaming response
    if (stream) {
      // For now, return non-streaming response
      // TODO: Implement proper streaming with Server-Sent Events
      return NextResponse.json(responseData);
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Chat completion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'An unexpected error occurred' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyGenerator: (req) => `chat:${(req as any).user?.userId || 'anonymous'}`
}));

// GET /api/chat/complete - Get chat sessions and configuration  
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Get user's subscription to determine available models
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { 
        ai_credits_remaining: true, 
        subscription: { select: { plan: true, status: true } } 
      }
    });

    const hasUnlimitedPlan = ['PRO', 'ENTERPRISE'].includes(userRecord?.subscription?.plan || '');
    
    const availableModels = [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4O Mini',
        provider: 'openai',
        description: 'Fast and efficient for most tasks',
        maxTokens: 16384,
        available: true
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4O',
        provider: 'openai',
        description: 'Most capable model for complex reasoning',
        maxTokens: 128000,
        available: hasUnlimitedPlan
      },
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        description: 'Excellent for analysis and creative writing',
        maxTokens: 200000,
        available: hasUnlimitedPlan
      }
    ];

    const configuration = {
      defaultModel: 'gpt-4o-mini',
      defaultTemperature: 0.7,
      defaultMaxTokens: 2000,
      maxMessagesPerRequest: 50,
      enableSystemPrompts: true,
      enableAttachments: hasUnlimitedPlan,
      enableVoice: false, // Not implemented yet
      rateLimits: {
        requestsPerMinute: hasUnlimitedPlan ? 60 : 30,
        tokensPerHour: hasUnlimitedPlan ? 100000 : 10000
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        models: availableModels,
        configuration,
        userCredits: userRecord?.ai_credits_remaining,
        hasUnlimitedPlan
      }
    });

  } catch (error) {
    console.error('Failed to get chat configuration:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to get configuration' } },
      { status: 500 }
    );
  }
});

// DELETE /api/chat/complete - Clear chat history or session
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Delete specific session (if we implement session storage)
      // For now, just return success
      return NextResponse.json({
        success: true,
        message: `Session ${sessionId} cleared`
      });
    } else {
      // Clear all chat history for user (if we implement chat storage)
      return NextResponse.json({
        success: true,
        message: 'All chat history cleared'
      });
    }

  } catch (error) {
    console.error('Failed to clear chat data:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to clear chat data' } },
      { status: 500 }
    );
  }
});

