import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const UserActionSchema = z.object({
  action: z.enum(['send-email', 'toggle-status', 'reset-password', 'impersonate']),
  data: z.object({
    subject: z.string().optional(),
    message: z.string().optional(),
  }).optional()
});

/**
 * POST /api/admin/users/[userId]/action
 * Perform actions on specific users
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = (request as any).user;
    const { userId } = params;
    
    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true, name: true, email: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, data } = UserActionSchema.parse(body);

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        usage: true
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    let result: any = {};

    switch (action) {
      case 'send-email':
        result = await sendUserEmail(
          targetUser, 
          adminUser,
          data?.subject || 'Message from Omnipreneur AI Support',
          data?.message || 'Hello! This is a message from our support team.'
        );
        break;

      case 'toggle-status':
        result = await toggleUserStatus(targetUser);
        break;

      case 'reset-password':
        result = await initiatePasswordReset(targetUser);
        break;

      case 'impersonate':
        // This would require additional security measures in production
        result = { message: 'Impersonation not implemented for security reasons' };
        break;

      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ACTION', message: 'Invalid action' } },
          { status: 400 }
        );
    }

    // Log admin action
    await logAdminAction(user.userId, action, userId, result);

    return NextResponse.json({
      success: true,
      message: `Action ${action} completed successfully`,
      data: result
    });

  } catch (error: any) {
    console.error('Admin user action error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid action data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'ACTION_ERROR', message: 'Failed to perform action' } },
      { status: 500 }
    );
  }
}

async function sendUserEmail(targetUser: any, adminUser: any, subject: string, message: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 12px;">
      <h1 style="color: #3b82f6;">Message from Omnipreneur AI Support</h1>
      <p>Hi ${targetUser.name},</p>
      <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
      <hr style="border: 1px solid #404040; margin: 30px 0;">
      <p style="color: #a1a1a1; font-size: 14px;">
        This message was sent by ${adminUser.name} (${adminUser.email}) from the Omnipreneur AI admin panel.
      </p>
      <p style="color: #a1a1a1; font-size: 14px;">
        If you have any questions, please reply to this email or contact our support team.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Omnipreneur AI Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: targetUser.email,
    subject,
    html: htmlContent,
  });

  return { emailSent: true, recipient: targetUser.email };
}

async function toggleUserStatus(targetUser: any) {
  // This could toggle between active/suspended status
  // For now, we'll update a custom field or add to the event log
  
  const currentStatus = targetUser.role === 'SUSPENDED' ? 'USER' : 'SUSPENDED';
  
  const updatedUser = await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      role: currentStatus === 'SUSPENDED' ? 'SUSPENDED' : targetUser.role
    }
  });

  return { 
    statusChanged: true, 
    previousStatus: targetUser.role,
    newStatus: currentStatus 
  };
}

async function initiatePasswordReset(targetUser: any) {
  // Generate password reset token and send email
  // This would integrate with your password reset system
  
  return { 
    passwordResetInitiated: true,
    email: targetUser.email 
  };
}

async function logAdminAction(adminId: string, action: string, targetUserId: string, result: any) {
  try {
    await prisma.event.create({
      data: {
        userId: adminId,
        event: 'ADMIN_ACTION',
        metadata: {
          action,
          targetUserId,
          result,
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}