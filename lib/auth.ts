import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  subscription?: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secret
    ) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Prefer Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Fallback to httpOnly cookie (server-side readable)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...rest] = c.trim().split('=');
        return [k ? decodeURIComponent(k) : '', decodeURIComponent(rest.join('='))];
      })
    );
    const token = cookies['auth_token'] || cookies['token'] || null;
    if (token) return token;
  }
  return null;
}

export async function authenticateRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// Alias for consistency with content library usage
export const verifyAuth = authenticateRequest;

export type AuthedHandler = (request: NextRequest & { user?: JWTPayload }) => Promise<NextResponse> | NextResponse;

export function requireAuth(handler: AuthedHandler) {
  return async (request: NextRequest) => {
    const payload = await authenticateRequest(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user info to request context (typed)
    (request as any).user = payload as JWTPayload;
    return handler(request as NextRequest & { user: JWTPayload });
  };
}

export function requireRole(role: string) {
  return function(handler: AuthedHandler) {
    return async (request: NextRequest) => {
      const payload = await authenticateRequest(request);
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (payload.role !== role && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      (request as any).user = payload as JWTPayload;
      return handler(request as NextRequest & { user: JWTPayload });
    };
  };
}

export function requireSubscription(plan: string) {
  return function(handler: AuthedHandler) {
    return async (request: NextRequest) => {
      const payload = await authenticateRequest(request);
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const userPlan = payload.subscription || 'FREE';
      const planHierarchy = {
        'FREE': 0,
        'BASIC': 1,
        'PRO': 2,
        'ENTERPRISE': 3
      };

      if (planHierarchy[userPlan as keyof typeof planHierarchy] < planHierarchy[plan as keyof typeof planHierarchy]) {
        return NextResponse.json(
          { error: 'Subscription upgrade required' },
          { status: 402 }
        );
      }

      (request as any).user = payload as JWTPayload;
      return handler(request as NextRequest & { user: JWTPayload });
    };
  };
} 