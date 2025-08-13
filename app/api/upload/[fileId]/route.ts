// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

interface RouteParams {
  params: {
    fileId: string;
  };
}

// GET /api/upload/[fileId] - Get file metadata
export async function GET(request: NextRequest, { params }: RouteParams) {
  return requireAuth(async (req: NextRequest) => {
    try {
      const user = (req as any).user;
      const { fileId } = params;

      // Find file and verify ownership
      const file = await prisma.uploadedFile.findFirst({
        where: {
          id: fileId,
          userId: user.userId
        }
      });

      if (!file) {
        return NextResponse.json(
          { success: false, error: { code: 'FILE_NOT_FOUND', message: 'File not found' } },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: file.id,
          originalName: file.originalName,
          filename: file.filename,
          mimeType: file.mimeType,
          size: file.size,
          purpose: file.purpose,
          context: file.context,
          extractedText: file.extractedText,
          metadata: file.metadata,
          processingStatus: file.processingStatus,
          createdAt: file.createdAt,
          downloadUrl: `/api/upload/${file.id}/download`,
          previewUrl: file.mimeType.startsWith('image/') ? `/api/upload/${file.id}/preview` : null
        }
      });

    } catch (error) {
      console.error('Get file metadata error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to get file metadata' } },
        { status: 500 }
      );
    }
  })(request);
}