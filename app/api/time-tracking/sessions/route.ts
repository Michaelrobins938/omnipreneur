// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { analyzeProductivity } from '@/lib/time/tracker';

const SessionsSchema = z.object({
  sessions: z.array(z.object({
    id: z.string().min(1),
    projectId: z.string().optional(),
    category: z.enum(['DEVELOPMENT','DESIGN','MARKETING','MEETINGS','RESEARCH','ADMIN']),
    description: z.string().min(1),
    startTime: z.string().datetime(),
    endTime: z.string().datetime().optional()
  })).min(1)
});

export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { sessions } = SessionsSchema.parse(body);
    const productivity = analyzeProductivity(sessions as any);
    return NextResponse.json({ success: true, data: productivity });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SESSIONS_ERROR', message: 'Failed to process sessions' } }, { status: 500 });
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `time-sessions`
}));

