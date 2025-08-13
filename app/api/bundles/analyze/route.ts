// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const AnalyzeSchema = z.object({
  products: z.array(z.object({
    name: z.string(),
    price: z.number().min(0),
    category: z.string().optional()
  })).min(1),
  targetAudience: z.string().optional(),
  goal: z.enum(['conversion','aov','retention']).default('conversion')
});

export const POST = requireEntitlement('bundle-builder')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { products, targetAudience, goal } = AnalyzeSchema.parse(body);

    const total = products.reduce((s, p) => s + p.price, 0);
    const complementarity = Math.min(1, products.length / 6);
    const priceSpread = Math.max(0, 1 - (stdDev(products.map(p => p.price)) / (total / products.length || 1)));
    const synergyScore = Math.round(((complementarity * 0.6) + (priceSpread * 0.4)) * 100);

    const recommendations = [
      'Create tiered bundles (basic, pro, ultimate) to segment price sensitivity',
      'Include a high-anchoring item to justify bundle price',
      'Add clear value bullets and quantified savings in copy',
      'Offer limited-time launch discount to increase conversion'
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalIndividualPrice: total,
        suggestedBundlePrice: Math.round(total * (goal === 'conversion' ? 0.45 : goal === 'aov' ? 0.6 : 0.5)),
        synergyScore,
        recommendations,
        audience: targetAudience || null
      }
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'ANALYZE_ERROR', message: 'Failed to analyze bundle' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `bundles-analyze:${userId}:${ip}`;
  }
}));

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

