// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { AestheticGeneratorService } from '@/lib/ai/aesthetic-generator-service';
import prisma, { logAIRequest } from '@/lib/db';

interface AuthenticatedRequest extends NextRequest {
  user: { userId: string; email: string; };
}

const AestheticDesignSchema = z.object({
  prompt: z.string().min(5).max(500),
  style: z.enum(['modern', 'minimalist', 'vintage', 'professional']).default('modern'),
  format: z.enum(['social-post', 'business-card', 'logo', 'flyer']).default('social-post'),
  brandColors: z.array(z.string()).max(5).optional()
});

export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as AuthenticatedRequest).user;
        const body = await request.json();
        const validated = AestheticDesignSchema.parse(body);
        
        const userWithSubscription = await prisma.user.findUnique({
          where: { id: user.userId },
          include: { subscription: true }
        });
        
        const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
        const allowedPlans = ['AESTHETIC_GENERATOR', 'PRO', 'ENTERPRISE'];
        
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'SUBSCRIPTION_REQUIRED',
              message: 'Aesthetic Generator subscription required',
              upgradeUrl: '/products/aesthetic-generator'
            }
          }, { status: 403 });
        }

        const t0 = Date.now();
        const aiService = new AestheticGeneratorService();
        const result = await aiService.process({ prompt: validated.prompt, style: validated.style });
        
        const enhancedDesign = {
          ...result,
          designId: `design_${Date.now()}`,
          colors: validated.brandColors || ['#6366f1', '#8b5cf6', '#ec4899'],
          typography: { primary: 'Inter', secondary: 'Poppins' },
          exportFormats: ['PNG', 'SVG', 'PDF'],
          variations: ['Original', 'Alternative Layout', 'Color Variant']
        };

        await logAIRequest({
          userId: user.userId,
          productId: 'aesthetic-generator',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4-turbo-preview',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { style: validated.style, format: validated.format },
          outputData: { designGenerated: true }
        });

        return NextResponse.json({
          success: true,
          data: {
            design: enhancedDesign,
            metadata: { processedAt: new Date().toISOString(), processingTimeMs: Date.now() - t0 }
          }
        });

      } catch (error) {
        console.error('Design generation error:', error);
        
        if (error instanceof z.ZodError) {
          return NextResponse.json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'Invalid parameters', details: error.issues }
          }, { status: 400 });
        }
        
        return NextResponse.json({
          success: false,
          error: { code: 'DESIGN_ERROR', message: 'Failed to generate design' }
        }, { status: 500 });
      }
    }, {
      limit: 30,
      windowMs: 10 * 60 * 1000,
      key: (req: NextRequest) => `design-generate:${(req as any).user?.userId || 'anonymous'}`
    })
  )
);

export const GET = requireAuth(async function GET(request: NextRequest) {
  try {
    const user = (request as AuthenticatedRequest).user;
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });
    
    const userPlan = userWithSubscription?.subscription?.plan || 'FREE';
    const hasAccess = ['AESTHETIC_GENERATOR', 'PRO', 'ENTERPRISE'].includes(userPlan);
    
    return NextResponse.json({
      success: true,
      data: {
        hasAccess,
        currentPlan: userPlan,
        features: { aiDesignGeneration: hasAccess, multipleVariations: hasAccess, customBranding: hasAccess },
        limits: { generationsPerMonth: hasAccess ? 500 : 10, maxVariations: hasAccess ? 8 : 2 },
        upgradeUrl: hasAccess ? null : '/products/aesthetic-generator'
      }
    });
  } catch (error) {
    console.error('Info error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'INFO_ERROR', message: 'Failed to get information' }
    }, { status: 500 });
  }
});