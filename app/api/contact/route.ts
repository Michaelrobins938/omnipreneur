// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';
import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'],
  port: Number(process.env['SMTP_PORT']),
  secure: true,
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});

export const POST = withRateLimit(withCsrfProtection(async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send email
    await transporter.sendMail({
      from: process.env['SMTP_FROM'],
      to: process.env['CONTACT_EMAIL'],
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Company:</strong> ${company || 'Not provided'}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send auto-reply
    await transporter.sendMail({
      from: process.env['SMTP_FROM'],
      to: email,
      subject: 'Thank you for contacting Omnipreneur AI',
      text: `
Dear ${name},

Thank you for reaching out to Omnipreneur AI. We have received your message and will get back to you within 24-48 business hours.

Best regards,
The Omnipreneur AI Team
      `,
      html: `
<h2>Thank you for contacting Omnipreneur AI</h2>
<p>Dear ${name},</p>
<p>Thank you for reaching out to Omnipreneur AI. We have received your message and will get back to you within 24-48 business hours.</p>
<p>Best regards,<br>The Omnipreneur AI Team</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}), {
  limit: 30,
  windowMs: 10 * 60 * 1000,
  key: (req: any) => {
    const ua = req.headers?.get?.('user-agent') || 'ua-unknown';
    const ref = req.headers?.get?.('referer') || 'ref-unknown';
    return `contact:${ua}:${ref}`;
  }
});