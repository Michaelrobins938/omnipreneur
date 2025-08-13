import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

/**
 * POST /api/users/avatar
 * 
 * Upload user avatar image
 * Handles file upload, validation, and storage
 * 
 * Authentication: Required
 * Content-Type: multipart/form-data
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NO_FILE', 
            message: 'No avatar file provided' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_FILE_TYPE', 
            message: 'Only JPG, PNG, and WebP images are allowed' 
          } 
        },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FILE_TOO_LARGE', 
            message: 'Avatar must be smaller than 2MB' 
          } 
        },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage (in production, use cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const avatarUrl = `data:${file.type};base64,${base64}`;

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { 
        avatar: avatarUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    });

    // Log the avatar update
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'AVATAR_UPDATED',
        metadata: {
          fileType: file.type,
          fileSize: file.size,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        avatarUrl: updatedUser.avatar,
        user: updatedUser
      }
    });

  } catch (error: any) {
    console.error('Avatar upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'UPLOAD_ERROR', 
          message: 'Failed to upload avatar' 
        } 
      },
      { status: 500 }
    );
  }
}), {
  windowMs: 60 * 1000, // 1 minute
  max: 5 // 5 uploads per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `avatar-upload:${userId}:${ip}`;
}));

/**
 * DELETE /api/users/avatar
 * 
 * Remove user avatar
 */
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Remove avatar from database
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { 
        avatar: null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    });

    // Log the avatar removal
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'AVATAR_REMOVED',
        metadata: {
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser
      }
    });

  } catch (error: any) {
    console.error('Avatar deletion error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to remove avatar' 
        } 
      },
      { status: 500 }
    );
  }
});