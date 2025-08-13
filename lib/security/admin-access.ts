// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/auth';
import { cache, cacheKeys } from '@/lib/cache/redis-cache';
import prisma from '@/lib/db';

export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  permissions: string[];
  lastLoginAt?: Date;
  mfaEnabled: boolean;
}

export interface AdminPermissions {
  canViewUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAnalytics: boolean;
  canViewSystemLogs: boolean;
  canModifySettings: boolean;
  canManageSubscriptions: boolean;
  canAccessDatabase: boolean;
  canDeployChanges: boolean;
  canManageApiKeys: boolean;
}

/**
 * Admin access control middleware
 */
export function requireAdmin(requiredPermissions: string[] = []) {
  return async (handler: Function) => {
    return async (request: NextRequest) => {
      try {
        // Get and verify token
        const token = getTokenFromRequest(request);
        if (!token) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required'
            }
          }, { status: 401 });
        }

        const user = verifyToken(token);
        if (!user) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid or expired token'
            }
          }, { status: 401 });
        }

        // Check if user is admin
        const adminUser = await getAdminUser(user.userId);
        if (!adminUser) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'FORBIDDEN',
              message: 'Admin access required'
            }
          }, { status: 403 });
        }

        // Check specific permissions if required
        if (requiredPermissions.length > 0) {
          const hasPermissions = await checkAdminPermissions(adminUser, requiredPermissions);
          if (!hasPermissions) {
            return NextResponse.json({
              success: false,
              error: {
                code: 'INSUFFICIENT_PERMISSIONS',
                message: `Required permissions: ${requiredPermissions.join(', ')}`,
                missingPermissions: requiredPermissions.filter(p => !adminUser.permissions.includes(p))
              }
            }, { status: 403 });
          }
        }

        // Log admin action
        await logAdminAction(adminUser, request);

        // Add admin user to request
        (request as any).adminUser = adminUser;
        (request as any).user = user;

        return handler(request);

      } catch (error: any) {
        console.error('Admin access check error:', error);
        return NextResponse.json({
          success: false,
          error: {
            code: 'ACCESS_CHECK_ERROR',
            message: 'Failed to verify admin access'
          }
        }, { status: 500 });
      }
    };
  };
}

/**
 * Get admin user with caching
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    // Check cache first
    const cacheKey = cacheKeys.user(`admin:${userId}`);
    const cached = await cache.get<AdminUser>(cacheKey);
    if (cached) {
      return cached;
    }

    // Query database
    const user = await prisma.user.findUnique({
      where: { 
        id: userId,
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        lastLoginAt: true,
        mfaEnabled: true,
        adminPermissions: true
      }
    });

    if (!user) {
      return null;
    }

    const adminUser: AdminUser = {
      id: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'SUPER_ADMIN',
      permissions: user.adminPermissions || getDefaultPermissions(user.role),
      lastLoginAt: user.lastLoginAt,
      mfaEnabled: user.mfaEnabled || false
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, adminUser, { ttl: 300 });

    return adminUser;

  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
}

/**
 * Check if admin has required permissions
 */
export async function checkAdminPermissions(
  adminUser: AdminUser, 
  requiredPermissions: string[]
): Promise<boolean> {
  // Super admins have all permissions
  if (adminUser.role === 'SUPER_ADMIN') {
    return true;
  }

  // Check each required permission
  return requiredPermissions.every(permission => 
    adminUser.permissions.includes(permission)
  );
}

/**
 * Get default permissions based on role
 */
function getDefaultPermissions(role: string): string[] {
  const permissions = {
    ADMIN: [
      'view:users',
      'edit:users',
      'view:analytics',
      'view:system_logs',
      'manage:subscriptions'
    ],
    SUPER_ADMIN: [
      'view:users',
      'edit:users',
      'delete:users',
      'view:analytics',
      'view:system_logs',
      'modify:settings',
      'manage:subscriptions',
      'access:database',
      'deploy:changes',
      'manage:api_keys'
    ]
  };

  return permissions[role as keyof typeof permissions] || [];
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminUser: AdminUser, 
  request: NextRequest
): Promise<void> {
  try {
    const logEntry = {
      adminUserId: adminUser.id,
      adminEmail: adminUser.email,
      action: request.method,
      endpoint: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      ip: getClientIP(request),
      timestamp: new Date().toISOString()
    };

    // In production, save to audit log table
    console.log('Admin action:', logEntry);

    // Optional: Send to monitoring service
    // await sendToMonitoring('admin_action', logEntry);

  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

/**
 * Security middleware for sensitive admin operations
 */
export function requireSecureAdmin(requiredPermissions: string[] = []) {
  return async (handler: Function) => {
    return async (request: NextRequest) => {
      try {
        // First, run standard admin check
        const adminHandler = requireAdmin(requiredPermissions);
        const adminResponse = await adminHandler(handler)(request);
        
        if (adminResponse.status !== 200) {
          return adminResponse;
        }

        const adminUser = (request as any).adminUser as AdminUser;

        // Additional security checks for sensitive operations
        
        // 1. Check if MFA is enabled for sensitive operations
        const sensitiveOperations = ['delete:users', 'access:database', 'deploy:changes'];
        const requiresMFA = requiredPermissions.some(p => sensitiveOperations.includes(p));
        
        if (requiresMFA && !adminUser.mfaEnabled) {
          return NextResponse.json({
            success: false,
            error: {
              code: 'MFA_REQUIRED',
              message: 'Multi-factor authentication required for this operation'
            }
          }, { status: 403 });
        }

        // 2. Check recent login (within last 30 minutes for sensitive operations)
        if (requiresMFA && adminUser.lastLoginAt) {
          const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
          if (adminUser.lastLoginAt < thirtyMinutesAgo) {
            return NextResponse.json({
              success: false,
              error: {
                code: 'SESSION_EXPIRED',
                message: 'Please re-authenticate for sensitive operations'
              }
            }, { status: 403 });
          }
        }

        // 3. Rate limit sensitive operations more strictly
        const rateLimitKey = `secure_admin:${adminUser.id}`;
        const current = await cache.incr(rateLimitKey, { ttl: 300 }); // 5 minutes
        
        if (current > 5) { // Max 5 sensitive operations per 5 minutes
          return NextResponse.json({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many sensitive operations, please wait'
            }
          }, { status: 429 });
        }

        return handler(request);

      } catch (error: any) {
        console.error('Secure admin check error:', error);
        return NextResponse.json({
          success: false,
          error: {
            code: 'SECURITY_CHECK_ERROR',
            message: 'Failed to verify secure admin access'
          }
        }, { status: 500 });
      }
    };
  };
}

/**
 * Check if user has admin access without middleware
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const adminUser = await getAdminUser(userId);
  return adminUser !== null;
}

/**
 * Get user permissions
 */
export async function getUserPermissions(userId: string): Promise<AdminPermissions | null> {
  const adminUser = await getAdminUser(userId);
  if (!adminUser) return null;

  return {
    canViewUsers: adminUser.permissions.includes('view:users'),
    canEditUsers: adminUser.permissions.includes('edit:users'),
    canDeleteUsers: adminUser.permissions.includes('delete:users'),
    canViewAnalytics: adminUser.permissions.includes('view:analytics'),
    canViewSystemLogs: adminUser.permissions.includes('view:system_logs'),
    canModifySettings: adminUser.permissions.includes('modify:settings'),
    canManageSubscriptions: adminUser.permissions.includes('manage:subscriptions'),
    canAccessDatabase: adminUser.permissions.includes('access:database'),
    canDeployChanges: adminUser.permissions.includes('deploy:changes'),
    canManageApiKeys: adminUser.permissions.includes('manage:api_keys')
  };
}

/**
 * Utility functions
 */
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || 'unknown';
}

/**
 * Admin session management
 */
export class AdminSessionManager {
  private static instance: AdminSessionManager;
  private activeSessions: Map<string, AdminSession> = new Map();

  static getInstance(): AdminSessionManager {
    if (!AdminSessionManager.instance) {
      AdminSessionManager.instance = new AdminSessionManager();
    }
    return AdminSessionManager.instance;
  }

  async createSession(adminUser: AdminUser, request: NextRequest): Promise<string> {
    const sessionId = generateSessionId();
    const session: AdminSession = {
      id: sessionId,
      adminUserId: adminUser.id,
      createdAt: new Date(),
      lastActivity: new Date(),
      ip: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    this.activeSessions.set(sessionId, session);
    
    // Cache the session
    await cache.set(
      cacheKeys.session(`admin:${sessionId}`), 
      session, 
      { ttl: 8 * 60 * 60 } // 8 hours
    );

    return sessionId;
  }

  async validateSession(sessionId: string): Promise<AdminSession | null> {
    const session = await cache.get<AdminSession>(
      cacheKeys.session(`admin:${sessionId}`)
    );
    
    if (session) {
      // Update last activity
      session.lastActivity = new Date();
      await cache.set(
        cacheKeys.session(`admin:${sessionId}`), 
        session, 
        { ttl: 8 * 60 * 60 }
      );
    }

    return session;
  }

  async revokeSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
    await cache.del(cacheKeys.session(`admin:${sessionId}`));
  }

  async revokeAllUserSessions(adminUserId: string): Promise<void> {
    // In production, this would query all sessions for the user
    // For now, we'll clear the cache pattern
    await cache.clear(`session:admin:`);
  }
}

interface AdminSession {
  id: string;
  adminUserId: string;
  createdAt: Date;
  lastActivity: Date;
  ip: string;
  userAgent: string;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}