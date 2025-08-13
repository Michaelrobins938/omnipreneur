// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import { generateCsrfToken } from '@/lib/security/csrf';
import { config } from '@/lib/config';

// use shared prisma client

export const POST = withCsrfProtection(withRateLimit(async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
        usage: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        subscription: user.subscription?.plan || 'FREE'
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );

    // Update last login (you might want to add this field to your schema)
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    // Set secure httpOnly cookie and return JSON
    const resp = NextResponse.json({ success: true, data: { user: userWithoutPassword, token, expiresIn: '7d' } });
    try {
      resp.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });
      // Issue CSRF token cookie for subsequent unsafe requests
      const csrf = generateCsrfToken();
      resp.cookies.set('csrf_token', csrf, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60
      });
      // Set a client-side accessible cookie to trigger auth state updates
      resp.cookies.set('auth_status', 'logged_in', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });
    } catch {}
    return resp;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'LOGIN_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}, {
  limit: 10, // 10 attempts per 10 minutes per IP
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    const email = (() => { try { return JSON.parse((req as any).body || '{}').email || 'unknown'; } catch { return 'unknown'; } })();
    return `auth-login:${ip}:${email}`;
  }
}));