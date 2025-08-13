// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { analyzeText } from '@/lib/ai/content-analyzer';

const AnalyzeSchema = z.object({
  content: z.string().min(10, 'Content must be at least 10 characters')
});

export const POST = requireEntitlement('auto-rewrite')(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { content } = AnalyzeSchema.parse(body);
    const analysis = analyzeText(content);
    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'ANALYSIS_ERROR', message: 'Failed to analyze content' } }, { status: 500 });
  }
});

