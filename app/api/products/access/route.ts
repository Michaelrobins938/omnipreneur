import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { checkProductAccess, PRODUCT_ACCESS_MAP } from '@/lib/access-control';
import { z } from 'zod';

const AccessCheckSchema = z.object({
  productId: z.string(),
  requiredPlans: z.string().optional(),
});

/**
 * GET /api/products/access
 * Server-side product access verification
 * This replaces client-side access control checks
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const { productId, requiredPlans } = AccessCheckSchema.parse({
      productId: searchParams.get('productId'),
      requiredPlans: searchParams.get('requiredPlans'),
    });

    // Get required plans from URL or default mapping
    const plans = requiredPlans 
      ? requiredPlans.split(',')
      : PRODUCT_ACCESS_MAP[productId] || ['PRO'];

    // Use server-side access control
    const accessResult = await checkProductAccess(user.userId, productId, plans);

    // Check if user qualifies for demo mode
    const isDemo = !accessResult.hasAccess && 
                   (accessResult.reason === 'wrong_plan' || accessResult.reason === 'no_subscription') &&
                   plans.includes('PRO'); // Only PRO products get demo mode

    return NextResponse.json({
      success: true,
      data: {
        hasAccess: accessResult.hasAccess,
        reason: accessResult.reason,
        upgradeUrl: accessResult.upgradeUrl,
        isDemo,
        productId,
        requiredPlans: plans,
      },
    });

  } catch (error: any) {
    console.error('Access check error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid access check parameters',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ACCESS_CHECK_ERROR',
          message: 'Failed to verify product access',
        },
      },
      { status: 500 }
    );
  }
});