// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/db';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

// use shared prisma client

/**
 * GET /api/users/me
 * 
 * Get current user profile with subscription and usage data
 * 
 * Authentication: Required
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Fetch user with related data
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        subscription: true,
        usage: true,
        entitlements: true,
        _count: {
          select: {
            rewrites: true,
            contentPieces: true,
            bundles: true,
            affiliateLinks: true,
            payments: true
          }
        }
      }
    });

    if (!userData) {
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

    // Remove sensitive data
    const { password, ...userWithoutPassword } = userData;

    return NextResponse.json({
      success: true,
      data: {
        ...userWithoutPassword,
        stats: {
          totalRewrites: userData._count.rewrites,
          totalContent: userData._count.contentPieces,
          totalBundles: userData._count.bundles,
          totalAffiliateLinks: userData._count.affiliateLinks,
          totalPayments: userData._count.payments
        }
      }
    });

  } catch (error: any) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch user profile' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `users-me-get:${userId}:${ip}`;
  }
}));

/**
 * PUT /api/users/me
 * 
 * Update current user profile
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   name?: string,
 *   email?: string
 * }
 */
export const PUT = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const Schema = z.object({ 
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      bio: z.string().max(500).optional(),
      company: z.string().max(100).optional(),
      website: z.string().url().optional().or(z.literal('')),
      location: z.string().max(100).optional(),
      timezone: z.string().optional(),
      language: z.string().optional(),
      phone: z.string().optional(),
      avatar: z.string().optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().min(8).optional()
    });
    
    const validatedData = Schema.parse(body);
    const { currentPassword, newPassword, ...updateData } = validatedData;

    // Check if password change is requested
    if (newPassword && !currentPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CURRENT_PASSWORD_REQUIRED', 
            message: 'Current password is required to change password' 
          } 
        },
        { status: 400 }
      );
    }

    // Verify current password if changing password
    if (currentPassword && newPassword) {
      const currentUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { password: true }
      });

      if (!currentUser) {
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

      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(currentPassword, currentUser.password);
      
      if (!isValidPassword) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'INVALID_PASSWORD', 
              message: 'Current password is incorrect' 
            } 
          },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    // Check if email is already taken by another user
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: user.userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'EMAIL_TAKEN', 
              message: 'Email is already taken by another user' 
            } 
          },
          { status: 409 }
        );
      }
    }

    // Clean up empty strings for optional fields
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => 
        value !== '' && value !== null && value !== undefined
      )
    );

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...cleanedData,
        updatedAt: new Date()
      },
      include: {
        subscription: true,
        usage: true
      }
    });

    // Log the profile update
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'PROFILE_UPDATED',
        metadata: {
          updatedFields: Object.keys(cleanedData),
          timestamp: new Date().toISOString()
        }
      }
    });

    // Remove sensitive data
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({ success: true, data: userWithoutPassword, message: 'Profile updated successfully' });

  } catch (error: any) {
    console.error('Update user profile error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: (error as any).errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'UPDATE_ERROR', message: 'Failed to update user profile' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `users-me-put:${userId}:${ip}`;
  }
})));