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

// GET /api/upload/[fileId]/download - Download file
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

      // Read file from filesystem
      const filePath = join(UPLOAD_DIR, file.filename);
      
      try {
        const fileBuffer = await readFile(filePath);
        
        // Create response with file
        const response = new NextResponse(fileBuffer);
        
        // Set appropriate headers
        response.headers.set('Content-Type', file.mimeType);
        response.headers.set('Content-Disposition', `attachment; filename="${file.originalName}"`);
        response.headers.set('Content-Length', file.size.toString());
        
        return response;
        
      } catch (fsError) {
        console.error('File read error:', fsError);
        return NextResponse.json(
          { success: false, error: { code: 'FILE_READ_ERROR', message: 'File could not be read' } },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error('Download file error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to download file' } },
        { status: 500 }
      );
    }
  })(request);
}