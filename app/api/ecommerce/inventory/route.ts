// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const InventorySchema = z.object({ items: z.array(z.object({ sku: z.string().min(1), stock: z.number().min(0), avgDailySales: z.number().min(0) })) });

export const POST = requireEntitlement('ecommerce-optimizer')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { items } = InventorySchema.parse(body);
    const suggestions = items.map(it => ({ sku: it.sku, reorderInDays: it.avgDailySales ? Math.max(0, Math.round(it.stock / it.avgDailySales)) : null }));
    return NextResponse.json({ success: true, data: { suggestions } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'INVENTORY_ERROR', message: 'Failed to analyze inventory' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `ecommerce-inventory`
}));

