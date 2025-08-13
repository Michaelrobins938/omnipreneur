import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const DataRequestSchema = z.object({
  requestType: z.enum(['export', 'delete', 'correct']),
  email: z.string().email(),
  reason: z.string().optional(),
  specificData: z.array(z.string()).optional()
});

const postHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const { requestType, email, reason, specificData } = DataRequestSchema.parse(body);

    // Verify email matches the authenticated user
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { email: true, name: true }
    });

    if (!currentUser || currentUser.email !== email) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'EMAIL_MISMATCH', 
            message: 'Email address does not match your account' 
          } 
        },
        { status: 400 }
      );
    }

    // Check for existing pending requests
    const existingRequest = await prisma.event.findFirst({
      where: {
        userId: user.userId,
        event: `DATA_REQUEST_${requestType.toUpperCase()}`,
        metadata: {
          path: ['status'],
          equals: 'pending'
        },
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'REQUEST_EXISTS', 
            message: 'You already have a pending request of this type. Please wait for it to be processed.' 
          } 
        },
        { status: 409 }
      );
    }

    // Create the data request record
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: `DATA_REQUEST_${requestType.toUpperCase()}`,
        metadata: {
          requestId,
          requestType,
          email,
          reason,
          specificData: requestType === 'export' ? specificData : undefined,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
        }
      }
    });

    // For immediate export requests of basic data, we could process automatically
    if (requestType === 'export' && specificData && specificData.length > 0) {
      // Queue for processing or handle immediately for basic requests
      await queueDataExport(user.userId, requestId, specificData);
    }

    // Send email notification to legal team
    await sendLegalNotification(requestType, currentUser.name, email, requestId);

    // Log the request for compliance tracking
    console.log(`Data request submitted: ${requestType} by user ${user.userId} (${email})`);

    return NextResponse.json({
      success: true,
      data: {
        requestId,
        requestType,
        status: 'pending',
        estimatedCompletionDays: requestType === 'export' ? 3 : 30
      }
    });

  } catch (error: any) {
    console.error('Data request error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'REQUEST_ERROR', 
          message: 'Failed to submit data request' 
        } 
      },
      { status: 500 }
    );
  }
};

const getHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const requests = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: {
          in: ['DATA_REQUEST_EXPORT', 'DATA_REQUEST_DELETE', 'DATA_REQUEST_CORRECT']
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    const formattedRequests = requests.map(request => ({
      id: request.id,
      requestId: (request.metadata && typeof request.metadata === 'object' && 'requestId' in request.metadata) ? (request.metadata as any).requestId : null,
      type: request.event.replace('DATA_REQUEST_', '').toLowerCase(),
      status: (request.metadata && typeof request.metadata === 'object' && 'status' in request.metadata) ? (request.metadata as any).status : 'pending',
      submittedAt: request.timestamp.toISOString(),
      reason: (request.metadata && typeof request.metadata === 'object' && 'reason' in request.metadata) ? (request.metadata as any).reason : null
    }));

    return NextResponse.json({
      success: true,
      data: formattedRequests
    });

  } catch (error: any) {
    console.error('Data request history error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch request history' 
        } 
      },
      { status: 500 }
    );
  }
};

export const POST = requireAuth(withCsrfProtection(withRateLimit(postHandler as any, {
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3, // Maximum 3 data requests per hour
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `data-request:${userId}:${ip}`;
  }
})));

export const GET = requireAuth(withRateLimit(getHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `data-request-history:${userId}:${ip}`;
  }
}));

/**
 * Queue data export for processing
 */
async function queueDataExport(userId: string, requestId: string, dataTypes: string[]) {
  // This would typically queue a background job
  // For now, we'll just log the export request
  console.log(`Queuing data export for user ${userId}, request ${requestId}, types:`, dataTypes);
  
  // In a real implementation, you might:
  // 1. Queue a background job using a service like Bull/Bee Queue
  // 2. Generate the export file asynchronously
  // 3. Send an email with download link when ready
  // 4. Store the export file securely with expiration
}

/**
 * Send notification to legal team
 */
async function sendLegalNotification(requestType: string, userName: string, email: string, requestId: string) {
  // This would typically send an email to the legal team
  console.log(`Legal notification: ${requestType} request from ${userName} (${email}), ID: ${requestId}`);
  
  // In a real implementation:
  // 1. Send email to legal@omnipreneur.ai
  // 2. Include request details and required actions
  // 3. Set up automated follow-up reminders
  // 4. Track response times for compliance reporting
}