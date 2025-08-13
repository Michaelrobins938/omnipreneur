import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { NovusOptimizer } from '@/lib/ai/novus-optimizer';
import { saveNovusUsage } from '@/lib/db/novus';

const optimizeSchema = z.object({
  prompt: z.string().min(10).max(5000),
  strategy: z.enum(['clarity', 'specificity', 'context', 'structure', 'all']).default('all'),
  outputCount: z.number().min(1).max(5).default(3),
  targetUseCase: z.enum(['general', 'creative', 'technical', 'business']).default('general')
});

export async function POST(request: NextRequest) {
  return requireAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { prompt, strategy, outputCount, targetUseCase } = optimizeSchema.parse(body);
      
      const optimizer = new NovusOptimizer();
      const result = await optimizer.optimizePrompt({
        prompt,
        strategy,
        outputCount,
        targetUseCase,
        userId: (request as any).user.userId
      });
      
      // Save usage to database
      await saveNovusUsage({
        userId: (request as any).user.userId,
        inputPrompt: prompt,
        optimizedPrompts: result.optimizedPrompts,
        analysis: result.analysis,
        settings: { strategy, outputCount, targetUseCase },
        creditsUsed: outputCount
      });
      
      return NextResponse.json({
        success: true,
        data: result,
        usage: {
          creditsUsed: outputCount,
          processingTime: result.processingTime
        }
      });
      
    } catch (error) {
      console.error('NOVUS optimization error:', error);
      return NextResponse.json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Optimization failed',
          code: 'OPTIMIZATION_ERROR'
        }
      }, { status: 500 });
    }
  })(request);
}