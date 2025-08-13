// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { dynamicPricing } from '@/lib/ecommerce/pricing';

const PricingSchema = z.object({ basePrice: z.number().min(0), competitorPrice: z.number().min(0).optional() });

export const POST = requireEntitlement('ecommerce-optimizer')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { basePrice, competitorPrice } = PricingSchema.parse(body);
    const result = dynamicPricing(basePrice, competitorPrice);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'ECOM_PRICING_ERROR', message: 'Failed to suggest pricing' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `ecommerce-pricing`
}));

