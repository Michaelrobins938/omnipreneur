// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { chatComplete } from '@/lib/ai/openai';

const ContentSchema = z.object({
  platform: z.enum(['facebook','instagram','twitter','linkedin','tiktok','youtube']),
  topic: z.string().min(2),
  count: z.number().min(1).max(20).default(3)
});

export const POST = requireEntitlement('social-media-manager')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { platform, topic, count } = ContentSchema.parse(body);
    const completion = await chatComplete({
      system: 'Generate platform-specific social post ideas. Respond ONLY with JSON {"items":[{"text":"...","hashtags":["#a"]}]}',
      user: `Platform=${platform}, Topic=${topic}, Count=${count}`,
      temperature: 0.6,
      maxTokens: 600
    });
    let items: any[] = [];
    try { items = JSON.parse(completion).items || []; } catch { /* noop */ }
    return NextResponse.json({ success: true, data: { items } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SOCIAL_CONTENT_ERROR', message: 'Failed to generate content' } }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `social-content`
}));

