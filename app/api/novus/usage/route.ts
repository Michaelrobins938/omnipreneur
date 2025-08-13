// app/api/novus/usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/novus/storage';

// Mock user authentication for development
const getUserId = (request: NextRequest): string => {
  // In a real implementation, this would come from the authenticated user
  return 'user_dev_123';
};

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const usage = await storage.getUsage(userId);
    
    return NextResponse.json({
      success: true,
      data: usage
    });
  } catch (error: any) {
    console.error('Error fetching usage:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch usage information' 
        } 
      },
      { status: 500 }
    );
  }
}