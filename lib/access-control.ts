import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';

export interface AccessControlResult {
  hasAccess: boolean;
  reason?: 'no_auth' | 'no_subscription' | 'wrong_plan' | 'no_entitlement';
  upgradeUrl?: string;
}

/**
 * Server-side product access control
 * This replaces the insecure client-side ?access=true bypass
 */
export async function checkProductAccess(
  userId: string,
  productId: string,
  requiredPlans: string[] = []
): Promise<AccessControlResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        entitlements: {
          where: { 
            productId,
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!user) {
      return { hasAccess: false, reason: 'no_auth' };
    }

    // Check for direct product entitlement (purchased individually)
    const hasEntitlement = user.entitlements.length > 0;
    if (hasEntitlement) {
      return { hasAccess: true };
    }

    // Check subscription-based access
    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      return { 
        hasAccess: false, 
        reason: 'no_subscription',
        upgradeUrl: `/products/${productId}#pricing`
      };
    }

    const userPlan = user.subscription.plan;
    
    // Plan hierarchy: FREE < PRO < ENTERPRISE
    const planHierarchy = {
      'FREE': 0,
      'PRO': 1,
      'ENTERPRISE': 2
    };

    const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const hasValidPlan = requiredPlans.some(plan => {
      const requiredLevel = planHierarchy[plan as keyof typeof planHierarchy] || 0;
      return userPlanLevel >= requiredLevel;
    });

    if (!hasValidPlan) {
      return {
        hasAccess: false,
        reason: 'wrong_plan',
        upgradeUrl: `/pricing?current=${userPlan}&required=${requiredPlans[0]}`
      };
    }

    return { hasAccess: true };

  } catch (error) {
    console.error('Access control check failed:', error);
    return { hasAccess: false, reason: 'no_auth' };
  }
}

/**
 * Product to plan mapping
 * This standardizes which products require which plans
 */
export const PRODUCT_ACCESS_MAP: Record<string, string[]> = {
  'bundle-builder': ['PRO', 'ENTERPRISE'],
  'content-spawner': ['PRO', 'ENTERPRISE'],
  'auto-rewrite': ['PRO', 'ENTERPRISE'],
  'affiliate-portal': ['PRO', 'ENTERPRISE'],
  'live-dashboard': ['PRO', 'ENTERPRISE'],
  'novus-protocol': ['PRO', 'ENTERPRISE'],
  
  // Premium products requiring enterprise
  'quantum-ai-processor': ['ENTERPRISE'],
  'healthcare-ai-compliance': ['ENTERPRISE'],
  'financial-ai-compliance': ['ENTERPRISE'],
  'legal-ai-compliance': ['ENTERPRISE'],
  
  // Starter products (available on free trial)
  'aesthetic-generator': ['FREE', 'PRO', 'ENTERPRISE'],
  'invoice-generator': ['FREE', 'PRO', 'ENTERPRISE'],
  'prompt-packs': ['FREE', 'PRO', 'ENTERPRISE'],
};

/**
 * Next.js middleware for protecting product routes
 */
export function createAccessMiddleware(productId: string) {
  return async (userId: string) => {
    const requiredPlans = PRODUCT_ACCESS_MAP[productId] || ['ENTERPRISE'];
    return checkProductAccess(userId, productId, requiredPlans);
  };
}