import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { config } from '@/lib/config';
import { withRateLimit } from '@/lib/rate-limit';

const ValidateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * POST /api/auth/reset-password/validate
 * Validate password reset token without consuming it
 */
export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { token } = ValidateTokenSchema.parse(body);

    // Verify and decode the reset token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'TOKEN_EXPIRED',
              message: 'Reset token has expired. Please request a new password reset.',
            },
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid reset token',
          },
        },
        { status: 400 }
      );
    }

    // Check if token is specifically for password reset
    if (decoded.type !== 'password_reset') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN_TYPE',
            message: 'Invalid reset token type',
          },
        },
        { status: 400 }
      );
    }

    // Verify the user still exists
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        email: decoded.email 
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User account not found',
          },
        },
        { status: 404 }
      );
    }

    // Token is valid
    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        name: user.name,
        tokenValid: true,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Token validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request format',
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
          code: 'VALIDATION_ERROR',
          message: 'Failed to validate token',
        },
      },
      { status: 500 }
    );
  }
}, {
  limit: 10, // 10 validation attempts per minute per IP
  windowMs: 60 * 1000,
}, (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `validate-reset-token:${ip}`;
});