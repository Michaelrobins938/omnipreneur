// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const PayoutsSchema = z.object({
  linkId: z.string(),
  method: z.enum(['paypal','bank','crypto']).default('paypal'),
  amount: z.number().min(1)
});

// Admin-only payout trigger (stub implementation)
export const POST = requireRole('ADMIN')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { linkId, method, amount } = PayoutsSchema.parse(body);

    const link = await prisma.affiliateLink.findUnique({ where: { linkId } });
    if (!link) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Affiliate link not found' } }, { status: 404 });
    }

    // In real implementation, invoke payment provider
    await prisma.event.create({
      data: {
        userId: link.userId,
        event: 'affiliate_payout',
        metadata: { linkId, method, amount }
      }
    });

    return NextResponse.json({ success: true, data: { linkId, method, amount, status: 'initiated' } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    console.error('Affiliate payout error:', error);
    return NextResponse.json({ success: false, error: { code: 'PAYOUT_ERROR', message: 'Failed to initiate payout' } }, { status: 500 });
  }
}, {
  limit: 10,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `affiliate-payouts:${ip}`;
  }
}));

