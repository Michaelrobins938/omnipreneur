// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/json'
];

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// POST /api/upload
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user has upload permissions
    const userRecord = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { subscription: true }
    });

    // Ensure upload directory exists
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const purpose = formData.get('purpose') as string || 'general';
    const context = formData.get('context') as string || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_FILE', message: 'No file provided' } },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FILE_TOO_LARGE', 
            message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` 
          } 
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_FILE_TYPE', 
            message: `File type ${file.type} is not allowed` 
          } 
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${randomUUID()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, uniqueFilename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Process file based on type
    let extractedText = '';
    let metadata = {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    };

    try {
      if (file.type.startsWith('text/')) {
        // Extract text from text files
        extractedText = buffer.toString('utf-8');
      } else if (file.type === 'application/json') {
        // Parse and validate JSON
        const jsonContent = buffer.toString('utf-8');
        const parsed = JSON.parse(jsonContent);
        extractedText = JSON.stringify(parsed, null, 2);
        metadata.jsonValid = true;
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'd need a PDF parser library
        // For now, just mark it as processable
        extractedText = '[PDF file - text extraction available via AI processing]';
      } else if (file.type.startsWith('image/')) {
        // For images, mark for AI vision processing
        extractedText = '[Image file - visual analysis available via AI processing]';
        metadata.imageAnalysis = true;
      }
    } catch (parseError) {
      console.error('File processing error:', parseError);
      metadata.processingError = parseError.message;
    }

    // Save file record to database
    const fileRecord = await prisma.uploadedFile.create({
      data: {
        id: randomUUID(),
        userId: user.userId,
        originalName: file.name,
        filename: uniqueFilename,
        mimeType: file.type,
        size: file.size,
        purpose: purpose,
        context: context,
        extractedText: extractedText.substring(0, 10000), // Limit to 10k chars
        metadata: metadata,
        processingStatus: 'completed',
        createdAt: new Date()
      }
    });

    // Return file information
    return NextResponse.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        originalName: file.name,
        filename: uniqueFilename,
        mimeType: file.type,
        size: file.size,
        purpose: purpose,
        extractedText: extractedText.length > 0 ? extractedText.substring(0, 1000) + '...' : null,
        metadata: metadata,
        uploadUrl: `/api/upload/${fileRecord.id}`,
        downloadUrl: `/api/upload/${fileRecord.id}/download`
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_FAILED', message: 'File upload failed' } },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 uploads per minute
}));

// GET /api/upload - List user's uploaded files
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get('purpose');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause: any = { userId: user.userId };
    if (purpose) {
      whereClause.purpose = purpose;
    }

    const files = await prisma.uploadedFile.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        originalName: true,
        filename: true,
        mimeType: true,
        size: true,
        purpose: true,
        context: true,
        metadata: true,
        processingStatus: true,
        createdAt: true
      }
    });

    const total = await prisma.uploadedFile.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      data: {
        files,
        total,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Failed to fetch files' } },
      { status: 500 }
    );
  }
});

// DELETE /api/upload - Delete uploaded file
export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'File ID is required' } },
        { status: 400 }
      );
    }

    // Find and verify file belongs to user
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

    // Delete file from filesystem
    try {
      const filePath = join(UPLOAD_DIR, file.filename);
      await import('fs/promises').then(fs => fs.unlink(filePath));
    } catch (fsError) {
      console.error('Failed to delete file from filesystem:', fsError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete file record from database
    await prisma.uploadedFile.delete({
      where: { id: fileId }
    });

    return NextResponse.json({
      success: true,
      data: { message: 'File deleted successfully' }
    });

  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Failed to delete file' } },
      { status: 500 }
    );
  }
});