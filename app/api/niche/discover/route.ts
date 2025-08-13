// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const DiscoverSchema = z.object({ seed: z.string().min(2), count: z.number().min(1).max(20).default(6) });

export const POST = requireEntitlement('auto-niche-engine')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { seed, count } = DiscoverSchema.parse(body);
    const niches = Array.from({ length: count }).map((_, i) => `${seed} niche ${i + 1}`);
    return NextResponse.json({ success: true, data: { niches } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'DISCOVER_ERROR', message: 'Failed to discover niches' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `niche-discover`
}));

