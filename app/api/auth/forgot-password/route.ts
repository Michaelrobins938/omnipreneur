import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { config } from '@/lib/config';
import nodemailer from 'nodemailer';
import { withRateLimit } from '@/lib/rate-limit';

const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { email } = ForgotPasswordSchema.parse(body);

    // Find user (but don't reveal if they exist for security)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
      });
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      { 
        email: user.email,
        userId: user.id,
        type: 'password_reset',
      },
      config.jwt.secret,
      { expiresIn: '1h' } // Short expiry for security
    );

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    // Log the password reset attempt
    await prisma.event.create({
      data: {
        userId: user.id,
        event: 'PASSWORD_RESET_REQUESTED',
        metadata: {
          email: user.email,
          timestamp: new Date().toISOString(),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid email address',
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
          code: 'FORGOT_PASSWORD_ERROR',
          message: 'Failed to process password reset request',
        },
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5, // 5 password reset attempts per 10 minutes per IP
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `forgot-password:${ip}`;
  }
});

async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Omnipreneur AI Suite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; padding: 40px; border: 1px solid #404040;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 600;">
              Reset Your Password
            </h1>
            <p style="color: #a1a1a1; font-size: 16px; margin: 0;">
              Omnipreneur AI Suite
            </p>
          </div>

          <!-- Content -->
          <div style="margin-bottom: 30px;">
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi ${name},
            </p>
            
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your password for your Omnipreneur AI Suite account. Click the button below to set a new password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                        color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; 
                        font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="color: #a1a1a1; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="color: #ef4444; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${resetUrl}
            </p>

            <div style="background: #fbbf24/10; border: 1px solid #fbbf24/20; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="color: #fbbf24; font-size: 14px; margin: 0; font-weight: 600;">
                ⚠️ Security Notice
              </p>
              <p style="color: #a1a1a1; font-size: 14px; margin: 8px 0 0 0; line-height: 1.4;">
                This link will expire in 1 hour for your security. If you didn't request this reset, please ignore this email and your password will remain unchanged.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #404040; padding-top: 20px; margin-top: 30px;">
            <p style="color: #a1a1a1; font-size: 12px; line-height: 1.5; margin: 0;">
              If you have any questions or didn't request this password reset, please contact our support team immediately.
            </p>
            
            <p style="color: #a1a1a1; font-size: 12px; margin: 15px 0 0 0;">
              Best regards,<br>
              The Omnipreneur AI Team
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Omnipreneur AI Suite" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your Password - Omnipreneur AI Suite',
    html: htmlContent,
  });
}