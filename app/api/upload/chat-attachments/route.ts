// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { fileProcessor } from '@/lib/upload/file-processor';
import { z } from 'zod';

const ChatAttachmentSchema = z.object({
  chatSessionId: z.string().optional(),
  messageId: z.string().optional(),
  maxFiles: z.number().min(1).max(10).default(5),
  extractText: z.boolean().default(true),
  generatePreview: z.boolean().default(true)
});

/**
 * POST /api/upload/chat-attachments
 * 
 * Upload files as chat attachments with text extraction
 * 
 * Authentication: Required
 * Content-Type: multipart/form-data
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const configData = formData.get('config');
    
    // Parse configuration
    const config = configData ? 
      ChatAttachmentSchema.parse(JSON.parse(configData as string)) : 
      ChatAttachmentSchema.parse({});
    
    if (files.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No files provided for upload'
        }
      }, { status: 400 });
    }
    
    // Validate file count
    if (files.length > config.maxFiles) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TOO_MANY_FILES',
          message: `Maximum ${config.maxFiles} files allowed for chat attachments`
        }
      }, { status: 400 });
    }
    
    // Set up upload options for chat attachments
    const uploadOptions = {
      userId: user.userId,
      category: 'chat-attachment',
      validator: createChatFileValidator(),
      documentProcessing: {
        extractText: config.extractText,
        generatePreview: config.generatePreview,
        convertToPdf: false
      },
      imageProcessing: {
        generateThumbnails: true,
        thumbnailSizes: [
          { width: 200, height: 200, suffix: 'thumb' }
        ],
        optimize: true,
        format: 'webp' as const,
        quality: 80
      },
      metadata: {
        chatSessionId: config.chatSessionId,
        messageId: config.messageId,
        uploadedAt: new Date().toISOString()
      }
    };
    
    // Process uploads
    const results = [];
    
    for (const file of files) {
      try {
        const result = await fileProcessor.uploadFile(file, uploadOptions);
        
        // Extract text content if available
        let textContent = '';
        if (result.metadata?.extractedText) {
          textContent = result.metadata.extractedText;
        }
        
        results.push({
          id: result.id,
          filename: result.filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          textContent,
          extractedData: result.metadata?.extractedData,
          previewUrl: result.metadata?.previewUrl,
          uploadedAt: result.uploadedAt
        });
        
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        results.push({
          filename: file.name,
          error: error.message || 'Upload failed',
          failed: true
        });
      }
    }
    
    const successful = results.filter(r => !r.failed);
    const failed = results.filter(r => r.failed);
    
    return NextResponse.json({
      success: true,
      data: {
        attachments: successful,
        failed: failed.length > 0 ? failed : undefined,
        summary: {
          total: files.length,
          successful: successful.length,
          failed: failed.length
        }
      }
    });
    
  } catch (error: any) {
    console.error('Chat attachment upload error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid upload configuration',
          details: error.errors
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: error.message || 'Failed to upload chat attachments'
      }
    }, { status: 500 });
  }
});

/**
 * GET /api/upload/chat-attachments
 * 
 * Get chat attachments for a session
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - chatSessionId: string (required)
 * - messageId: string (optional - get attachments for specific message)
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const chatSessionId = searchParams.get('chatSessionId');
    const messageId = searchParams.get('messageId');
    
    if (!chatSessionId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_SESSION_ID',
          message: 'Chat session ID is required'
        }
      }, { status: 400 });
    }
    
    // TODO: Replace with actual database query
    const mockAttachments = [
      {
        id: 'att_123',
        filename: 'document.pdf',
        originalName: 'project_requirements.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '/uploads/documents/att_123.pdf',
        thumbnailUrl: '/uploads/thumbnails/att_123_thumb.jpg',
        textContent: 'This is the extracted text from the PDF...',
        chatSessionId,
        messageId: messageId || 'msg_456',
        uploadedAt: new Date().toISOString()
      }
    ];
    
    // Filter by messageId if provided
    const filteredAttachments = messageId 
      ? mockAttachments.filter(att => att.messageId === messageId)
      : mockAttachments;
    
    return NextResponse.json({
      success: true,
      data: {
        attachments: filteredAttachments,
        total: filteredAttachments.length
      }
    });
    
  } catch (error: any) {
    console.error('Get chat attachments error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch chat attachments'
      }
    }, { status: 500 });
  }
});

/**
 * Create file validator for chat attachments
 */
function createChatFileValidator() {
  const allowedTypes = new Set([
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]);
  
  const maxFileSize = 25 * 1024 * 1024; // 25MB per file
  
  return {
    validateFile: (file: File) => {
      if (!allowedTypes.has(file.type)) {
        throw new Error(`File type ${file.type} is not allowed for chat attachments`);
      }
      
      if (file.size > maxFileSize) {
        throw new Error(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      }
      
      return true;
    }
  };
}