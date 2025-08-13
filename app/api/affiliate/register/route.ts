// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const RegisterSchema = z.object({
  preferredSlug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/i),
  commissionRate: z.number().min(0).max(100).default(20),
  campaignName: z.string().optional()
});

export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { preferredSlug, commissionRate, campaignName } = RegisterSchema.parse(body);

    const linkId = preferredSlug.toLowerCase();

    // Ensure uniqueness
    const existing = await prisma.affiliateLink.findUnique({ where: { linkId } });
    if (existing) {
      return NextResponse.json({ success: false, error: { code: 'SLUG_TAKEN', message: 'Affiliate slug already taken' } }, { status: 409 });
    }

    const baseUrl = process.env['NEXTAUTH_URL'] || 'http://localhost:3000';
    const originalUrl = `${baseUrl}/?ref=${encodeURIComponent(linkId)}`;
    const affiliateUrl = `${baseUrl}/r/${encodeURIComponent(linkId)}`;

    const record = await prisma.affiliateLink.create({
      data: {
        userId: user.userId,
        linkId,
        originalUrl,
        affiliateUrl,
        campaignName: campaignName || null,
        commissionRate: commissionRate / 100,
      }
    });

    return NextResponse.json({ success: true, data: { id: record.id, linkId, affiliateUrl } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    console.error('Affiliate register error:', error);
    return NextResponse.json({ success: false, error: { code: 'REGISTER_ERROR', message: 'Failed to register affiliate' } }, { status: 500 });
  }
}, {
  limit: 15,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `affiliate-register:${userId}:${ip}`;
  }
}));

