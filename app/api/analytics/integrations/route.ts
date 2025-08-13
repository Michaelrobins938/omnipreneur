// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth-middleware';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';
import { fetchGoogleAnalyticsSummary, fetchStripeSummary, fetchFacebookAdsSummary } from '@/lib/integrations/data-connectors';

const IntegrationsSchema = z.object({
  sources: z.array(z.enum(['google-analytics','stripe','facebook-ads'])).default(['google-analytics','stripe'])
});

export const POST = requireAuth(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { sources } = IntegrationsSchema.parse(body);
    const results = await Promise.all(sources.map(async (src) => {
      switch (src) {
        case 'google-analytics':
          return await fetchGoogleAnalyticsSummary('default');
        case 'stripe':
          return await fetchStripeSummary('default');
        case 'facebook-ads':
          return await fetchFacebookAdsSummary('default');
      }
    }));
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    console.error('Integrations error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTEGRATIONS_ERROR', message: 'Failed to fetch integrations' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.id || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-integrations:${userId}:${ip}`;
  }
})));

