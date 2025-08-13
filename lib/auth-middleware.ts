/**
 * Enhanced Authentication Middleware for API Routes
 * Provides decorators for easy authentication and authorization
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './db';
import { config } from '@/lib/config';

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    subscription?: {
      plan: string;
      status: string;
    } | undefined;
  };
}

/**
 * Extract and verify JWT token from request
 */
async function getTokenFromRequest(request: NextRequest): Promise<any> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Get user from database with subscription info
 */
async function getUserFromDatabase(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
     include: {
      subscription: true,
      entitlements: true
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

/**
 * Authentication decorator for API routes
 * Usage: export const POST = requireAuth(async (request) => { ... });
 */
export function requireAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract and verify token
      const tokenData = await getTokenFromRequest(request);
      
      // Get user from database
      const user = await getUserFromDatabase(tokenData.userId);
      
      // Attach user to request
      (request as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription ? {
          plan: user.subscription.plan,
          status: user.subscription.status
        } : undefined
      };
      
      // Call the actual handler
      return await handler(request as AuthenticatedRequest);
      
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED', 
            message: error instanceof Error ? error.message : 'Authentication failed' 
          } 
        },
        { status: 401 }
      );
    }
  };
}

/**
 * Role-based authorization decorator
 * Usage: export const POST = requireRole('ADMIN')(async (request) => { ... });
 */
export function requireRole(requiredRole: string) {
  return function(
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      if (request.user.role !== requiredRole && request.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'FORBIDDEN', 
              message: `Access denied. Required role: ${requiredRole}` 
            } 
          },
          { status: 403 }
        );
      }
      
      return await handler(request);
    });
  };
}

/**
 * Subscription-based authorization decorator
 * Usage: export const POST = requireSubscription('PRO')(async (request) => { ... });
 */
export function requireSubscription(requiredPlan: string) {
  return function(
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const subscription = request.user.subscription;
      
      if (!subscription || subscription.status !== 'ACTIVE') {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'SUBSCRIPTION_REQUIRED', 
              message: 'Active subscription required' 
            } 
          },
          { status: 402 }
        );
      }
      
      // Check plan hierarchy: FREE < PRO < ENTERPRISE
      const planHierarchy = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
      const userPlanLevel = planHierarchy[subscription.plan as keyof typeof planHierarchy] ?? -1;
      const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] ?? 999;
      
      if (userPlanLevel < requiredPlanLevel) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'PLAN_UPGRADE_REQUIRED', 
              message: `${requiredPlan} plan or higher required` 
            } 
          },
          { status: 402 }
        );
      }
      
      return await handler(request);
    });
  };
}

/**
 * Product entitlement check
 * Usage: export const GET = requireEntitlement('auto-rewrite')(async (req) => { ... })
 */
export function requireEntitlement(productId: string) {
  return function(
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      try {
        const userRecord = await prisma.user.findUnique({
          where: { id: request.user.id },
          include: { entitlements: true, subscription: true }
        });

        const hasEntitlement = userRecord?.entitlements?.some(e => e.productId === productId && e.status === 'ACTIVE');

        if (!hasEntitlement) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'ENTITLEMENT_REQUIRED',
                message: `Access to product '${productId}' is not granted`
              }
            },
            { status: 403 }
          );
        }

        return await handler(request);
      } catch (error) {
        return NextResponse.json(
          { success: false, error: { code: 'ENTITLEMENT_CHECK_FAILED', message: 'Failed to verify entitlement' } },
          { status: 500 }
        );
      }
    });
  };
}

/**
 * Usage limit decorator
 * Usage: export const POST = requireUsageLimit('contentPieces', 100)(async (request) => { ... });
 */
export function requireUsageLimit(usageType: string, limit: number) {
  return function(
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    return requireAuth(async (request: AuthenticatedRequest) => {
      const usage = await prisma.usage.findUnique({
        where: { userId: request.user.id }
      });
      
      if (usage && (usage as any)[usageType] >= limit) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'USAGE_LIMIT_EXCEEDED', 
              message: `Monthly ${usageType} limit of ${limit} exceeded` 
            } 
          },
          { status: 429 }
        );
      }
      
      return await handler(request);
    });
  };
}

/**
 * Combined authentication and authorization decorator
 * Usage: export const POST = requirePermissions({ role: 'ADMIN', subscription: 'PRO' })(async (request) => { ... });
 */
export function requirePermissions(permissions: {
  role?: string;
  subscription?: string;
  usageLimit?: { type: string; limit: number };
}) {
  return function(
    handler: (request: AuthenticatedRequest) => Promise<NextResponse>
  ) {
    let decoratedHandler = handler;
    
    // Apply usage limit check if specified
    if (permissions.usageLimit) {
      decoratedHandler = requireUsageLimit(
        permissions.usageLimit.type, 
        permissions.usageLimit.limit
      )(decoratedHandler);
    }
    
    // Apply subscription check if specified
    if (permissions.subscription) {
      decoratedHandler = requireSubscription(permissions.subscription)(decoratedHandler);
    }
    
    // Apply role check if specified
    if (permissions.role) {
      decoratedHandler = requireRole(permissions.role)(decoratedHandler);
    }
    
    return decoratedHandler;
  };
}

/**
 * Get current user (for use in authenticated handlers)
 * Usage: const user = await getCurrentUser(request);
 */
export async function getCurrentUser(request: NextRequest) {
  try {
    const tokenData = await getTokenFromRequest(request);
    const user = await getUserFromDatabase(tokenData.userId);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription ? {
        plan: user.subscription.plan,
        status: user.subscription.status
      } : undefined
    };
  } catch (error) {
    return null;
  }
}

/**
 * Optional authentication (doesn't fail if no token)
 * Usage: export const GET = optionalAuth(async (request) => { const user = request.user; ... });
 */
export function optionalAuth(
  handler: (request: NextRequest & { user?: any }) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const user = await getCurrentUser(request);
      (request as any).user = user;
    } catch (error) {
      // Ignore auth errors for optional auth
    }
    
    return await handler(request as NextRequest & { user?: any });
  };
}