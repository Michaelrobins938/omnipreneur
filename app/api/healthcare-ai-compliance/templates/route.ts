import { NextRequest, NextResponse } from 'next/server';
import { toolkitStorage } from '@/lib/toolkit/storage';

const PRODUCT_ID = 'healthcare-ai-compliance';

export async function GET(request: NextRequest) {
  try {
    const userId = 'demo-user';
    const templates = await toolkitStorage.getTemplates(PRODUCT_ID, userId);

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to load templates' }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, variables, body: templateBody } = body;

    if (!name || !templateBody) {
      return NextResponse.json({
        success: false,
        error: { message: 'Name and body are required' }
      }, { status: 400 });
    }

    const userId = 'demo-user';
    const template = await toolkitStorage.createTemplate(PRODUCT_ID, userId, {
      name,
      variables: variables || [],
      body: templateBody
    });

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to create template' }
    }, { status: 500 });
  }
}