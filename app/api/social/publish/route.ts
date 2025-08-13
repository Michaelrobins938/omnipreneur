// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { publishMany } from '@/lib/social/publisher';

const PublishSchema = z.object({
  items: z.array(z.object({
    platform: z.enum(['facebook','instagram','twitter','linkedin','tiktok','youtube']),
    text: z.string().min(1),
    mediaUrls: z.array(z.string().url()).optional(),
    scheduledAt: z.string().datetime().optional()
  })).min(1)
});

export const POST = requireEntitlement('social-media-manager')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { items } = PublishSchema.parse(body);
    const results = await publishMany(items as any);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'PUBLISH_ERROR', message: 'Failed to publish posts' } }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `social-publish`
}));

