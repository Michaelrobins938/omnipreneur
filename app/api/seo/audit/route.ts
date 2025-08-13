// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { auditHtml } from '@/lib/seo/analyzer';

const AuditSchema = z.object({
  url: z.string().url().optional(),
  html: z.string().min(10).optional()
}).refine((d) => d.url || d.html, { message: 'Provide either url or html' });

export const POST = requireEntitlement('seo-optimizer-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { url, html } = AuditSchema.parse(body);

    // For now, only direct HTML auditing; fetching by URL would be added later
    const sourceHtml = html || `<html><head><title>${url}</title></head><body><h1>${url}</h1></body></html>`;
    const result = auditHtml(sourceHtml);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SEO_AUDIT_ERROR', message: 'Failed to audit SEO' } }, { status: 500 });
  }
}, {
  limit: 15,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `seo-audit`
}));

