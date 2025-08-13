// app/api/novus/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runCALPipeline } from '@/lib/novus/cal';
import { checkFreeTierLimits, consumeQuota } from '@/lib/novus/limits';
import { storage } from '@/lib/novus/storage';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { prompt, language, tone, goals } = body;
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'Prompt is required and must be a string' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Check usage limits for free tier users
    const limitCheck = await checkFreeTierLimits(userId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: limitCheck.message || 'Usage limit exceeded',
            remaining: limitCheck.remaining,
            limit: limitCheck.limit
          } 
        },
        { status: 429 }
      );
    }
    
    // Run the CAL pipeline
    const result = runCALPipeline(prompt);
    
    // Consume quota
    await consumeQuota(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        optimized: result.optimized,
        metrics: result.metrics,
        diff: result.diff,
        improvements: result.improvements
      }
    });
    
  } catch (error: any) {
    console.error('NOVUS optimization error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'OPTIMIZATION_ERROR', 
          message: 'Failed to optimize prompt' 
        } 
      },
      { status: 500 }
    );
  }
}