// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const ContentSchema = z.object({
  text: z.string().min(20),
  targetKeyword: z.string().min(2)
});

export const POST = requireEntitlement('seo-optimizer-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { text, targetKeyword } = ContentSchema.parse(body);
    const density = (text.toLowerCase().match(new RegExp(`\\b${targetKeyword.toLowerCase()}\\b`, 'g')) || []).length / (text.split(/\s+/).length || 1);
    const suggestions = [
      density < 0.01 ? 'Increase keyword usage slightly (avoid stuffing)' : 'Keyword density looks healthy',
      /\b(h1|h2|h3)\b/i.test(text) ? 'Headings present' : 'Add H2/H3 subheadings with variations',
      text.length > 1000 ? 'Consider adding a table of contents' : 'Add more detail to reach 1000+ words if needed'
    ];
    return NextResponse.json({ success: true, data: { density, suggestions } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'CONTENT_SEO_ERROR', message: 'Failed to analyze content' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `seo-content`
}));

