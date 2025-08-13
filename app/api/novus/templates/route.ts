// app/api/novus/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/novus/storage';
import { NovusTemplate } from '@/lib/novus/types';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const templates = await storage.getTemplates(userId);
    
    return NextResponse.json({
      success: true,
      data: templates
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch templates' 
        } 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.body) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: 'Template name and body are required' 
          } 
        },
        { status: 400 }
      );
    }
    
    // Extract variables from template body
    const variableRegex = /\{([^}]+)\}/g;
    const variables = Array.from(new Set(
      Array.from(body.body.matchAll(variableRegex)).map(match => match[0])
    ));
    
    // Create template
    const template = await storage.createTemplate(userId, {
      name: body.name,
      variables,
      body: body.body
    });
    
    return NextResponse.json({
      success: true,
      data: template
    });
  } catch (error: any) {
    console.error('Error creating template:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CREATE_ERROR', 
          message: 'Failed to create template' 
        } 
      },
      { status: 500 }
    );
  }
}