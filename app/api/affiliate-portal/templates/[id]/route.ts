import { NextRequest, NextResponse } from 'next/server';
import { toolkitStorage } from '@/lib/toolkit/storage';

const PRODUCT_ID = 'affiliate-portal';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'demo-user';
    const template = await toolkitStorage.getTemplate(PRODUCT_ID, userId, params.id);

    if (!template) {
      return NextResponse.json({
        success: false,
        error: { message: 'Template not found' }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Get template error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to load template' }
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const userId = 'demo-user';
    
    const template = await toolkitStorage.updateTemplate(PRODUCT_ID, userId, params.id, body);

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Update template error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to update template' }
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'demo-user';
    await toolkitStorage.deleteTemplate(PRODUCT_ID, userId, params.id);

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Delete template error:', error);
    return NextResponse.json({
      success: false,
      error: { message: 'Failed to delete template' }
    }, { status: 500 });
  }
}