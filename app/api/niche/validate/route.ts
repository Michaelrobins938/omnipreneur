// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { validateOpportunity } from '@/lib/niche/validator';

const ValidateSchema = z.object({ searchVolume: z.number().min(0), competition: z.number().min(0).max(100), cpc: z.number().min(0) });

export const POST = requireEntitlement('auto-niche-engine')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { searchVolume, competition, cpc } = ValidateSchema.parse(body);
    const result = validateOpportunity({ searchVolume, competition, cpc });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'VALIDATE_ERROR', message: 'Failed to validate niche' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `niche-validate`
}));

