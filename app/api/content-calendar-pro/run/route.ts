import { NextRequest, NextResponse } from 'next/server';
import { TOOL_STRATEGIES } from '@/lib/tools/strategies';
import { runPipeline, validateInput } from '@/lib/toolkit/pipeline';
import { consumeQuota } from '@/lib/toolkit/limits';

const PRODUCT_ID = 'content-calendar-pro';
const strategy = TOOL_STRATEGIES[PRODUCT_ID];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, params } = body;

    if (!input) {
      return NextResponse.json({
        success: false,
        error: { message: 'Input is required' }
      }, { status: 400 });
    }

    validateInput(input);

    const userId = 'demo-user';
    const quotaConsumed = await consumeQuota(PRODUCT_ID, userId);
    
    if (!quotaConsumed) {
      return NextResponse.json({
        success: false,
        error: { message: 'Usage limit exceeded. Please upgrade to continue.' }
      }, { status: 429 });
    }

    const result = await runPipeline(input, params, strategy);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Content Calendar Pro processing error:', error);
    return NextResponse.json({
      success: false,
      error: { 
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    }, { status: 500 });
  }
}