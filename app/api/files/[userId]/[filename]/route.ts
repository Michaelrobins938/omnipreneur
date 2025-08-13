// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/db';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

interface RouteParams {
  params: {
    userId: string;
    filename: string;
  };
}

// GET /api/files/[userId]/[filename] - Serve uploaded files
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, filename } = params;
    
    // Verify file exists in database and user has access
    const fileRecord = await prisma.uploadedFile.findFirst({
      where: {
        filename,
        userId
      },
      select: {
        id: true,
        originalName: true,
        mimeType: true,
        size: true,
        path: true,
        userId: true
      }
    });

    if (!fileRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'FILE_NOT_FOUND', message: 'File not found' } },
        { status: 404 }
      );
    }

    // Check if user has access to this file
    const authHeader = request.headers.get('authorization');
    const isPublicAccess = request.nextUrl.searchParams.get('public') === 'true';
    
    if (!isPublicAccess) {
      // Require authentication for private files
      try {
        const authResult = await requireAuth(async (req) => req)(request);
        if (!authResult || !(authResult as any).user) {
          return NextResponse.json(
            { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
            { status: 401 }
          );
        }

        const authenticatedUser = (authResult as any).user;
        
        // Check if user owns the file or is admin
        if (authenticatedUser.userId !== userId && authenticatedUser.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } },
            { status: 403 }
          );
        }
      } catch (authError) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid authentication' } },
          { status: 401 }
        );
      }
    }

    // Construct file path
    const filePath = fileRecord.path || join(UPLOAD_DIR, userId, filename);

    try {
      // Check if file exists on filesystem
      await stat(filePath);
      
      // Read file
      const fileBuffer = await readFile(filePath);
      
      // Determine appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', fileRecord.mimeType);
      headers.set('Content-Length', fileRecord.size.toString());
      headers.set('Content-Disposition', `inline; filename="${fileRecord.originalName}"`);
      
      // Cache headers for static files
      if (fileRecord.mimeType.startsWith('image/')) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        headers.set('Cache-Control', 'private, max-age=3600');
      }

      // Security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      
      // For images, allow inline display
      if (fileRecord.mimeType.startsWith('image/')) {
        headers.set('X-Frame-Options', 'SAMEORIGIN');
      } else {
        // For other files, force download for security
        headers.set('Content-Disposition', `attachment; filename="${fileRecord.originalName}"`);
      }

      return new NextResponse(fileBuffer, {
        status: 200,
        headers
      });

    } catch (fsError) {
      console.error(`File not found on filesystem: ${filePath}`, fsError);
      
      // File exists in DB but not on filesystem - cleanup DB record
      try {
        await prisma.uploadedFile.delete({
          where: { id: fileRecord.id }
        });
      } catch (cleanupError) {
        console.error('Failed to cleanup orphaned file record:', cleanupError);
      }

      return NextResponse.json(
        { success: false, error: { code: 'FILE_NOT_FOUND', message: 'File not found on server' } },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to serve file' } },
      { status: 500 }
    );
  }
}

// DELETE /api/files/[userId]/[filename] - Delete specific file
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, filename } = params;
    
    // Require authentication
    const authResult = await requireAuth(async (req) => req)(request);
    if (!authResult || !(authResult as any).user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = (authResult as any).user;
    
    // Check if user owns the file or is admin
    if (user.userId !== userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    // Get file record
    const fileRecord = await prisma.uploadedFile.findFirst({
      where: {
        filename,
        userId
      },
      select: {
        id: true,
        path: true,
        originalName: true
      }
    });

    if (!fileRecord) {
      return NextResponse.json(
        { success: false, error: { code: 'FILE_NOT_FOUND', message: 'File not found' } },
        { status: 404 }
      );
    }

    // Delete physical file
    try {
      const { unlink } = await import('fs/promises');
      const filePath = fileRecord.path || join(UPLOAD_DIR, userId, filename);
      await unlink(filePath);
    } catch (fsError) {
      console.error('Failed to delete physical file:', fsError);
      // Continue to delete DB record even if physical file deletion fails
    }

    // Delete database record
    await prisma.uploadedFile.delete({
      where: { id: fileRecord.id }
    });

    return NextResponse.json({
      success: true,
      message: `File "${fileRecord.originalName}" deleted successfully`
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_ERROR', message: 'Failed to delete file' } },
      { status: 500 }
    );
  }
}

// HEAD /api/files/[userId]/[filename] - Get file metadata
export async function HEAD(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, filename } = params;
    
    // Get file record
    const fileRecord = await prisma.uploadedFile.findFirst({
      where: {
        filename,
        userId
      },
      select: {
        mimeType: true,
        size: true,
        originalName: true,
        createdAt: true
      }
    });

    if (!fileRecord) {
      return new NextResponse(null, { status: 404 });
    }

    // Return headers only
    const headers = new Headers();
    headers.set('Content-Type', fileRecord.mimeType);
    headers.set('Content-Length', fileRecord.size.toString());
    headers.set('Last-Modified', fileRecord.createdAt.toUTCString());
    headers.set('X-Original-Filename', encodeURIComponent(fileRecord.originalName));

    return new NextResponse(null, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('File metadata error:', error);
    return new NextResponse(null, { status: 500 });
  }
}