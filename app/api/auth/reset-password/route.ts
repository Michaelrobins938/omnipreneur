import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { config } from '@/lib/config';
import { withRateLimit } from '@/lib/rate-limit';

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number')
    .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),
});

/**
 * POST /api/auth/reset-password
 * Reset user password using token
 */
export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { token, password } = ResetPasswordSchema.parse(body);

    // Verify and decode the reset token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token',
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
            message: 'Invalid reset token',
          },
        },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        email: decoded.email 
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Log the password reset
    await prisma.event.create({
      data: {
        userId: user.id,
        event: 'PASSWORD_RESET_COMPLETED',
        metadata: {
          email: user.email,
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      }
    });

    // Send confirmation email (optional)
    try {
      // You could send a password change confirmation email here
      console.log(`Password reset completed for user: ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send password reset confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });

  } catch (error: any) {
    console.error('Password reset error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid password format',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
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

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RESET_PASSWORD_ERROR',
          message: 'Failed to reset password',
        },
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // 5 password reset attempts per 10 minutes per IP
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `reset-password:${ip}`;
  }
});