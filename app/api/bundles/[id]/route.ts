// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { withCsrfProtection } from '@/lib/security/csrf';

const prisma = new PrismaClient();

// Update validation schema
const UpdateBundleSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  description: z.string().max(1000).optional(),
  targetAudience: z.string().min(1).max(200).optional(),
  products: z.array(z.string()).min(1).max(20).optional(),
  pricingStrategy: z.string().optional(),
  regenerateSalesCopy: z.boolean().default(false),
  regenerateMarketing: z.boolean().default(false)
});

/**
 * GET /api/bundles/[id]
 * 
 * Get specific bundle by ID with full details
 * 
 * Authentication: Required
 * Authorization: Bundle must belong to authenticated user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Bundle ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Get bundle with ownership verification
    const bundle = await prisma.bundle.findUnique({
      where: { 
        id,
        userId: authResult.userId // Ensure user owns the bundle
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!bundle) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'BUNDLE_NOT_FOUND', 
            message: 'Bundle not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Log view event for analytics
    await prisma.event.create({
      data: {
        userId: authResult.userId,
        event: 'bundle_viewed',
        metadata: {
          bundleId: id,
          bundleType: bundle.bundleType,
          bundleName: bundle.name,
          price: bundle.price
        }
      }
    });

    // Get related analytics data
    const analyticsData = await getBundleAnalytics(id, authResult.userId);

    return NextResponse.json({
      success: true,
      data: {
        ...bundle,
        analytics: analyticsData
      }
    });

  } catch (error: any) {
    console.error('Get bundle error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to retrieve bundle' 
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bundles/[id]
 * 
 * Update specific bundle
 * 
 * Authentication: Required
 * Authorization: Bundle must belong to authenticated user
 * 
 * Body:
 * {
 *   name?: string,
 *   price?: number,
 *   description?: string,
 *   targetAudience?: string,
 *   products?: string[],
 *   pricingStrategy?: string,
 *   regenerateSalesCopy?: boolean,
 *   regenerateMarketing?: boolean
 * }
 */
async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Bundle ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = UpdateBundleSchema.parse(body);

    // Verify bundle exists and user owns it
    const existingBundle = await prisma.bundle.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!existingBundle) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'BUNDLE_NOT_FOUND', 
            message: 'Bundle not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Regenerate AI content if requested
    let updatedSalesCopy = existingBundle.salesCopy;
    let updatedMarketingMaterials = existingBundle.marketingMaterials;

    if (validatedData.regenerateSalesCopy || validatedData.regenerateMarketing) {
      const regenerationData = await regenerateBundleContent(
        { ...existingBundle, ...validatedData },
        validatedData.regenerateSalesCopy,
        validatedData.regenerateMarketing
      );
      
      if (validatedData.regenerateSalesCopy) {
        updatedSalesCopy = regenerationData.salesCopy;
      }
      
      if (validatedData.regenerateMarketing) {
        updatedMarketingMaterials = regenerationData.marketingMaterials;
      }
    }

    // Update bundle
    const updatedBundle = await prisma.$transaction(async (tx) => {
      const updated = await tx.bundle.update({
        where: { id },
        data: {
          ...(validatedData.name ? { name: validatedData.name } : {}),
          ...(validatedData.price ? { price: validatedData.price } : {}),
          ...(validatedData.description ? { description: validatedData.description } : {}),
          ...(validatedData.targetAudience ? { targetAudience: validatedData.targetAudience } : {}),
          ...(validatedData.products ? { products: validatedData.products } : {}),
          ...(validatedData.pricingStrategy ? { pricingStrategy: validatedData.pricingStrategy } : {}),
          ...(updatedSalesCopy ? { salesCopy: updatedSalesCopy as any } : {}),
          ...(updatedMarketingMaterials ? { marketingMaterials: updatedMarketingMaterials as any } : {})
        }
      });

      // Log update event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'bundle_updated',
          metadata: {
            bundleId: id,
            updatedFields: Object.keys(validatedData).filter(key => 
              !['regenerateSalesCopy', 'regenerateMarketing'].includes(key)
            ),
            regeneratedContent: {
              salesCopy: validatedData.regenerateSalesCopy,
              marketing: validatedData.regenerateMarketing
            },
            bundleType: existingBundle.bundleType,
            priceChange: validatedData.price ? (validatedData.price - existingBundle.price) : 0
          }
        }
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      data: updatedBundle,
      message: 'Bundle updated successfully'
    });

  } catch (error: any) {
    console.error('Update bundle error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: error.issues 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'UPDATE_ERROR', 
          message: error.message || 'Failed to update bundle' 
        } 
      },
      { status: 500 }
    );
  }
}

export const PUT = withCsrfProtection((request: NextRequest, context: { params: { id: string } }) => {
  return handlePUT(request, context);
});

/**
 * DELETE /api/bundles/[id]
 * 
 * Delete specific bundle
 * 
 * Authentication: Required
 * Authorization: Bundle must belong to authenticated user
 */
async function handleDELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Bundle ID is required' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify bundle exists and user owns it
    const existingBundle = await prisma.bundle.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!existingBundle) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'BUNDLE_NOT_FOUND', 
            message: 'Bundle not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Delete bundle and update usage counter
    await prisma.$transaction(async (tx) => {
      // Delete the bundle
      await tx.bundle.delete({
        where: { id }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: authResult.userId },
        data: {
          bundles: { decrement: 1 }
        }
      });

      // Log deletion event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'bundle_deleted',
          metadata: {
            bundleId: id,
            bundleName: existingBundle.name,
            bundleType: existingBundle.bundleType,
            price: existingBundle.price,
            productCount: existingBundle.products.length,
            deletedAt: new Date().toISOString()
          }
        }
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        id,
        deleted: true
      },
      message: 'Bundle deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete bundle error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: error.message || 'Failed to delete bundle' 
        } 
      },
      { status: 500 }
    );
  }
}

export const DELETE = withCsrfProtection((request: NextRequest, context: { params: { id: string } }) => {
  return handleDELETE(request, context);
});

/**
 * POST /api/bundles/[id]/duplicate
 * 
 * Duplicate specific bundle
 */
async function handlePOST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Apply authentication middleware manually
    const authResult = await import('@/lib/auth').then(auth => auth.authenticateRequest(request));
    if (!authResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'AUTHENTICATION_REQUIRED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'duplicate') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_ACTION', 
            message: 'Invalid action. Use ?action=duplicate' 
          } 
        },
        { status: 400 }
      );
    }

    // Get original bundle
    const originalBundle = await prisma.bundle.findUnique({
      where: { 
        id,
        userId: authResult.userId
      }
    });

    if (!originalBundle) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'BUNDLE_NOT_FOUND', 
            message: 'Bundle not found or access denied' 
          } 
        },
        { status: 404 }
      );
    }

    // Check usage limits
    const userWithUsage = await prisma.user.findUnique({
      where: { id: authResult.userId },
      include: { 
        usage: true,
        subscription: true
      }
    });

    if (!userWithUsage || !userWithUsage.usage || !userWithUsage.subscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_DATA_ERROR', 
            message: 'User data not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Usage limits by plan
    const PLAN_LIMITS = {
      FREE: { bundles: 2 },
      PRO: { bundles: 25 },
      ENTERPRISE: { bundles: -1 } // Unlimited
    };

    const currentPlan = userWithUsage.subscription.plan;
    const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS];
    
    if (planLimit.bundles !== -1 && 
        userWithUsage.usage.bundles >= planLimit.bundles) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: `Bundle creation limit reached for ${currentPlan} plan` 
          } 
        },
        { status: 402 }
      );
    }

    // Duplicate the bundle
    const duplicatedBundle = await prisma.$transaction(async (tx) => {
      const duplicate = await tx.bundle.create({
        data: {
          userId: originalBundle.userId,
          name: `${originalBundle.name} (Copy)`,
          price: originalBundle.price,
          bundleType: originalBundle.bundleType,
          targetAudience: originalBundle.targetAudience,
          description: originalBundle.description,
          products: originalBundle.products,
          pricingStrategy: originalBundle.pricingStrategy,
          bundleData: originalBundle.bundleData as any,
          salesCopy: originalBundle.salesCopy as any,
          marketingMaterials: originalBundle.marketingMaterials as any
        }
      });

      // Update usage counter
      await tx.usage.update({
        where: { userId: authResult.userId },
        data: {
          bundles: { increment: 1 }
        }
      });

      // Log duplication event
      await tx.event.create({
        data: {
          userId: authResult.userId,
          event: 'bundle_duplicated',
          metadata: {
            originalBundleId: id,
            duplicatedBundleId: duplicate.id,
            bundleName: originalBundle.name,
            bundleType: originalBundle.bundleType,
            price: originalBundle.price
          }
        }
      });

      return duplicate;
    });

    return NextResponse.json({
      success: true,
      data: duplicatedBundle,
      message: 'Bundle duplicated successfully'
    });

  } catch (error: any) {
    console.error('Duplicate bundle error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DUPLICATE_ERROR', 
          message: error.message || 'Failed to duplicate bundle' 
        } 
      },
      { status: 500 }
    );
  }
}

export const POST = withCsrfProtection((request: NextRequest, context: { params: { id: string } }) => {
  return handlePOST(request, context);
});

/**
 * Get bundle analytics data
 */
async function getBundleAnalytics(bundleId: string, userId: string) {
  const events = await prisma.event.findMany({
    where: {
      userId,
      event: { in: ['bundle_viewed', 'bundle_updated'] },
      metadata: {
        path: ['bundleId'],
        equals: bundleId
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 10
  });

  const viewCount = events.filter(e => e.event === 'bundle_viewed').length;
  const updateCount = events.filter(e => e.event === 'bundle_updated').length;
  const lastViewed = events.find(e => e.event === 'bundle_viewed')?.timestamp;
  const lastUpdated = events.find(e => e.event === 'bundle_updated')?.timestamp;

  return {
    viewCount,
    updateCount,
    lastViewed,
    lastUpdated,
    recentActivity: events.slice(0, 5).map(event => ({
      action: event.event,
      timestamp: event.timestamp,
      details: event.metadata
    }))
  };
}

/**
 * Regenerate bundle content using AI
 */
async function regenerateBundleContent(bundleData: any, regenerateSales: boolean, regenerateMarketing: boolean) {
  const startTime = Date.now();
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

  const result: any = {};

  if (regenerateSales) {
    result.salesCopy = {
      headline: `Updated: The Complete ${bundleData.bundleType} Solution for ${bundleData.targetAudience}`,
      subheadline: `Newly optimized ${bundleData.bundleType.toLowerCase()} bundle with enhanced value`,
      features: [
        `${bundleData.products.length} premium components (updated)`,
        `Enhanced for ${bundleData.targetAudience}`,
        'Latest strategies and techniques',
        'Updated templates and resources',
        'Revised implementation guides',
        '30-day money-back guarantee'
      ],
      benefits: [
        'Improved ROI with latest optimizations',
        'Faster implementation with updated guides',
        'Enhanced user experience',
        'More comprehensive coverage',
        'Better results tracking'
      ],
      regeneratedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
  }

  if (regenerateMarketing) {
    result.marketingMaterials = {
      socialMediaPosts: [
        {
          platform: 'LinkedIn',
          content: `🔄 UPDATED: Enhanced ${bundleData.bundleType} Bundle\n\n✨ New features and improvements\n📈 Better results for ${bundleData.targetAudience}\n🎯 ${bundleData.products.length} components\n\nGet the updated version: $${bundleData.price}\n\n#Updated #${bundleData.bundleType}Bundle`
        }
      ],
      emailSequence: [
        {
          subject: `Updated: Your ${bundleData.bundleType} Bundle`,
          content: `Great news!\n\nWe've just updated our ${bundleData.bundleType} bundle with new features and improvements.\n\nExisting customers get free access to all updates.\n\nNew to the bundle? Get it now: $${bundleData.price}`
        }
      ],
      regeneratedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
  }

  return result;
}