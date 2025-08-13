// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { buildBrandKit } from '@/lib/design/brand-builder';

const BrandSchema = z.object({ name: z.string().min(2) });

export const POST = requireEntitlement('aesthetic-generator')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name } = BrandSchema.parse(body);
    const kit = buildBrandKit(name);
    return NextResponse.json({ success: true, data: kit });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'BRAND_ERROR', message: 'Failed to build brand kit' } }, { status: 500 });
  }
}, {
  limit: 15,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `design-brand`
}));

