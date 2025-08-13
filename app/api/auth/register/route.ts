// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { config } from '@/lib/config';
import { generateCsrfToken } from '@/lib/security/csrf';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';

// use shared prisma client

export const POST = withCsrfProtection(withRateLimit(async function POST(request: NextRequest) {
  try {
    const { email, password, name, purchaseData } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER'
      }
    });

    // Create usage tracking
    await prisma.usage.create({
      data: {
        userId: user.id,
        rewrites: 0,
        contentPieces: 0,
        bundles: 0,
        affiliateLinks: 0
      }
    });

    // Create subscription based on purchase data
    let subscriptionPlan = 'FREE';
    if (purchaseData && purchaseData.productId) {
      // Map product ID to subscription plan
      subscriptionPlan = purchaseData.productId.toUpperCase().replace(/-/g, '_');
    }

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: subscriptionPlan as any, // Cast to match enum
        status: 'ACTIVE'
      }
    });

    // Grant entitlement if purchase was for a specific product
    if (purchaseData?.productId) {
      await prisma.entitlement.upsert({
        where: { userId_productId: { userId: user.id, productId: purchaseData.productId } },
        update: { status: 'ACTIVE' },
        create: { userId: user.id, productId: purchaseData.productId, status: 'ACTIVE' }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    // Generate email verification token
    const verificationToken = jwt.sign(
      { 
        email: user.email,
        type: 'email_verification',
      },
      config.jwt.secret,
      { expiresIn: '24h' }
    );

    // Send verification email instead of welcome email
    await sendVerificationEmail(user.email, user.name, verificationToken);

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    const resp = NextResponse.json({ success: true, data: { user: userWithoutPassword, token, expiresIn: '7d' } });
    try {
      resp.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });
      const csrf = generateCsrfToken();
      resp.cookies.set('csrf_token', csrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60
      });
    } catch {}
    return resp;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REGISTER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}, {
  limit: 10, // 10 registrations per 10 minutes per IP
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `auth-register:${ip}`;
  }
}));

async function sendVerificationEmail(email: string, name: string, token: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || 'smtp.gmail.com',
      port: parseInt(process.env['SMTP_PORT'] || '587'),
      secure: false,
      auth: {
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASS']
      }
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env['SMTP_FROM'] || 'noreply@omnipreneur.com',
      to: email,
      subject: 'Verify Your Email - Omnipreneur AI Suite',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #3b82f6;">Verify Your Email Address</h1>
          <p>Hi ${name},</p>
          <p>Thank you for signing up for Omnipreneur AI Suite! Please verify your email address to complete your account setup:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #a1a1a1; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
          <p style="color: #3b82f6; word-break: break-all;">${verificationUrl}</p>
          <p>Start exploring your dashboard to unlock the full potential of AI-powered entrepreneurship!</p>
          <p>Best regards,<br>The Omnipreneur Team</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't fail registration if email fails
  }
} 