import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db';
import { config } from '@/lib/config';

const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const ResendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * POST /api/auth/verify-email
 * Verify user email with token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = VerifyEmailSchema.parse(body);

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_TOKEN', 
            message: 'Invalid or expired verification token' 
          } 
        },
        { status: 400 }
      );
    }

    const { email, type } = decoded;

    if (type !== 'email_verification') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_TOKEN_TYPE', 
            message: 'Invalid token type' 
          } 
        },
        { status: 400 }
      );
    }

    // Find user and update email verification status
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_NOT_FOUND', 
            message: 'User not found' 
          } 
        },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email already verified',
          alreadyVerified: true 
        }
      );
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: updatedUser.email,
        verified: true,
      },
    });

  } catch (error: any) {
    console.error('Email verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
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
          code: 'VERIFICATION_ERROR',
          message: 'Failed to verify email',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/verify-email
 * Resend verification email
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = ResendSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, a verification email has been sent.',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'ALREADY_VERIFIED', 
            message: 'Email is already verified' 
          } 
        },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { 
        email: user.email,
        type: 'email_verification',
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
    });

  } catch (error: any) {
    console.error('Resend verification error:', error);

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
          code: 'RESEND_ERROR',
          message: 'Failed to resend verification email',
        },
      },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Omnipreneur AI Suite</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px; padding: 40px; border: 1px solid #404040;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: 600;">
              Omnipreneur AI Suite
            </h1>
            <p style="color: #a1a1a1; font-size: 16px; margin: 0;">
              Verify Your Email Address
            </p>
          </div>

          <!-- Content -->
          <div style="margin-bottom: 30px;">
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi ${name},
            </p>
            
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for signing up! Please verify your email address to complete your account setup and access all features of the Omnipreneur AI Suite.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                        color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; 
                        font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
                Verify Email Address
              </a>
            </div>

            <p style="color: #a1a1a1; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 10px 0 0 0;">
              ${verificationUrl}
            </p>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #404040; padding-top: 20px; margin-top: 30px;">
            <p style="color: #a1a1a1; font-size: 12px; line-height: 1.5; margin: 0;">
              This verification link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
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
    subject: 'Verify Your Email Address - Omnipreneur AI Suite',
    html: htmlContent,
  });
}