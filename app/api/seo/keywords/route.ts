// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { suggestKeywords } from '@/lib/seo/keyword-tool';

const KeywordsSchema = z.object({
  seed: z.string().min(2),
  count: z.number().min(1).max(50).default(10)
});

export const POST = requireEntitlement('seo-optimizer-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { seed, count } = KeywordsSchema.parse(body);
    const keywords = suggestKeywords(seed, count);
    return NextResponse.json({ success: true, data: keywords });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'KEYWORDS_ERROR', message: 'Failed to suggest keywords' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `seo-keywords`
}));

