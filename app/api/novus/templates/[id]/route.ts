// app/api/novus/templates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/novus/storage';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const templateId = params.id;
    
    const template = await storage.getTemplate(userId, templateId);
    
    if (!template) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Template not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: template
    });
  } catch (error: any) {
    console.error('Error fetching template:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch template' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const templateId = params.id;
    const body = await request.json();
    
    // Check if template exists
    const existing = await storage.getTemplate(userId, templateId);
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Template not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    // Extract variables from template body if it's being updated
    if (body.body) {
      const variableRegex = /\{([^}]+)\}/g;
      const variables = Array.from(new Set(
        Array.from(body.body.matchAll(variableRegex)).map(match => match[0])
      ));
      body.variables = variables;
    }
    
    // Update template
    const updated = await storage.updateTemplate(userId, templateId, body);
    
    if (!updated) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UPDATE_ERROR', 
            message: 'Failed to update template' 
          } 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error: any) {
    console.error('Error updating template:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'UPDATE_ERROR', 
          message: 'Failed to update template' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(request);
    const templateId = params.id;
    
    // Check if template exists
    const existing = await storage.getTemplate(userId, templateId);
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_FOUND', 
            message: 'Template not found' 
          } 
        },
        { status: 404 }
      );
    }
    
    // Delete template
    const deleted = await storage.deleteTemplate(userId, templateId);
    
    if (!deleted) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'DELETE_ERROR', 
            message: 'Failed to delete template' 
          } 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DELETE_ERROR', 
          message: 'Failed to delete template' 
        } 
      },
      { status: 500 }
    );
  }
}