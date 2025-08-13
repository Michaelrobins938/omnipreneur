// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { suggestPricing } from '@/lib/ai/pricing-calculator';

const OptimizeSchema = z.object({
  products: z.array(z.object({ price: z.number().min(0) })).min(1),
  goal: z.enum(['conversion','aov','retention']).default('conversion')
});

export const POST = requireEntitlement('bundle-builder')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { products, goal } = OptimizeSchema.parse(body);
    const individualTotal = products.reduce((s, p) => s + p.price, 0);
    const pricing = suggestPricing({ individualTotal, productCount: products.length, goal });

    const copyTips = [
      'Use quantified savings (e.g., Save $X or Y%)',
      'Add social proof and testimonials near CTA',
      'Present tier comparison with value highlights',
      'Offer a time-limited bonus for early buyers'
    ];

    return NextResponse.json({ success: true, data: { pricing, copyTips } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'OPTIMIZE_ERROR', message: 'Failed to optimize bundle' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `bundles-optimize:${userId}:${ip}`;
  }
}));

