import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import { z } from 'zod';

const CreateTicketSchema = z.object({
  subject: z.string().min(1).max(200),
  description: z.string().min(20).max(2000),
  category: z.enum(['technical', 'billing', 'account', 'feature', 'bug', 'general']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  attachments: z.array(z.object({
    name: z.string(),
    size: z.number(),
    type: z.string()
  })).optional()
});

const getHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || undefined;
    const status = searchParams.get('status') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For now, return mock data
    // In a real app, this would query your support ticket system
    const mockTickets = [
      {
        id: 'TKT-001',
        subject: 'Unable to generate content - API timeout errors',
        description: 'I keep getting timeout errors when trying to generate long-form content...',
        status: 'in_progress',
        priority: 'high',
        category: 'technical',
        createdAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T14:20:00Z',
        lastResponseAt: '2025-01-15T14:20:00Z',
        assignedTo: 'Sarah Chen',
        responseTime: 2,
        attachments: 2,
        messagesCount: 5,
        tags: ['api', 'timeout', 'content-generation']
      },
      {
        id: 'TKT-002',
        subject: 'Billing question about pro plan upgrade',
        description: 'I upgraded to pro but still see starter limits...',
        status: 'waiting_for_response',
        priority: 'medium',
        category: 'billing',
        createdAt: '2025-01-14T16:45:00Z',
        updatedAt: '2025-01-15T09:10:00Z',
        lastResponseAt: '2025-01-15T09:10:00Z',
        assignedTo: 'Mike Johnson',
        responseTime: 1,
        attachments: 1,
        messagesCount: 3,
        tags: ['billing', 'upgrade', 'limits']
      }
    ];

    // Apply filters
    let filteredTickets = mockTickets;

    if (query) {
      const searchTerm = query.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.description.toLowerCase().includes(searchTerm)
      );
    }

    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }

    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }

    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }

    // Apply pagination
    const total = filteredTickets.length;
    const paginatedTickets = filteredTickets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        tickets: paginatedTickets,
        total,
        hasMore: offset + paginatedTickets.length < total
      }
    });

  } catch (error: any) {
    console.error('Support tickets fetch error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch support tickets' 
        } 
      },
      { status: 500 }
    );
  }
};

const postHandler = async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();

    const validatedData = CreateTicketSchema.parse(body);

    // Get user details
    const currentUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { email: true, name: true }
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

    // Generate ticket ID
    const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;

    // In a real application, you would:
    // 1. Save the ticket to your support system database
    // 2. Send email notifications to the user and support team
    // 3. Create initial ticket message
    // 4. Handle file uploads for attachments

    // Log ticket creation for tracking
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'SUPPORT_TICKET_CREATED',
        metadata: {
          ticketId,
          subject: validatedData.subject,
          category: validatedData.category,
          priority: validatedData.priority,
          attachmentCount: validatedData.attachments?.length || 0,
          timestamp: new Date().toISOString()
        }
      }
    });

    // Mock ticket response
    const newTicket = {
      id: ticketId,
      subject: validatedData.subject,
      description: validatedData.description,
      status: 'open',
      priority: validatedData.priority,
      category: validatedData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: validatedData.attachments?.length || 0,
      messagesCount: 1,
      tags: []
    };

    // Send confirmation email (mock)
    console.log(`Sending ticket confirmation email to ${currentUser.email} for ticket ${ticketId}`);

    // Notify support team (mock)
    console.log(`Notifying support team about new ${validatedData.priority} priority ticket: ${ticketId}`);

    return NextResponse.json({
      success: true,
      data: newTicket
    });

  } catch (error: any) {
    console.error('Support ticket creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid ticket data',
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
          code: 'CREATE_ERROR', 
          message: 'Failed to create support ticket' 
        } 
      },
      { status: 500 }
    );
  }
};

export const GET = requireAuth(withRateLimit(getHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 30, // 30 requests per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `support-tickets:${userId}:${ip}`;
  }
}));

export const POST = requireAuth(withCsrfProtection(withRateLimit(postHandler as any, {
  windowMs: 60 * 1000, // 1 minute
  limit: 5, // 5 ticket creations per minute
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `support-ticket-create:${userId}:${ip}`;
  }
})));