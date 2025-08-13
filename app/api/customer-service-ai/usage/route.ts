import { NextRequest, NextResponse } from 'next/server';
import { toolkitStorage } from '@/lib/toolkit/storage';

const PRODUCT_ID = 'customer-service-ai';

export async function GET(request: NextRequest) {
  try {
    const userId = 'demo-user';
    const usage = await toolkitStorage.getUsage(PRODUCT_ID, userId);

    return NextResponse.json({
      success: true,
      data: usage
    });

  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to load usage' }
    }, { status: 500 });
  }
}