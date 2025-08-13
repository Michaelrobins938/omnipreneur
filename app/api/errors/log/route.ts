import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ErrorLogSchema = z.object({
  errorId: z.string().optional(),
  message: z.string(),
  stack: z.string().optional(),
  componentStack: z.string().optional(),
  timestamp: z.string(),
  userAgent: z.string(),
  url: z.string(),
  type: z.enum(['client_error', 'boundary_error']).default('client_error'),
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errorData = ErrorLogSchema.parse(body);

    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Logged:', {
        ...errorData,
        timestamp: new Date(errorData.timestamp).toLocaleString(),
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Error logged (development mode)' 
      });
    }

    // In production, you would send to your monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, DataDog, etc.
    
    // For now, we'll store in a simple log format
    const logEntry = {
      ...errorData,
      id: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
    };

    // TODO: Replace with actual monitoring service integration
    // await sendToMonitoringService(logEntry);
    
    console.error('Production Error:', logEntry);

    return NextResponse.json({ 
      success: true, 
      errorId: logEntry.id,
      message: 'Error logged successfully' 
    });

  } catch (error) {
    console.error('Failed to process error log:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to log error' 
      },
      { status: 500 }
    );
  }
}

// Example function for future monitoring service integration
async function sendToMonitoringService(errorData: any) {
  // Example for Sentry
  // Sentry.captureException(new Error(errorData.message), {
  //   extra: errorData,
  //   tags: {
  //     type: errorData.type,
  //     environment: errorData.environment,
  //   },
  // });

  // Example for custom monitoring API
  // await fetch(process.env.MONITORING_ENDPOINT!, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`,
  //   },
  //   body: JSON.stringify(errorData),
  // });
}