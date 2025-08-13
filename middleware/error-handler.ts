// This file should be renamed to .tsx since it contains React JSX
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { errorManager } from '@/lib/error/error-manager';

// Global error handling middleware for Next.js
export async function errorHandlerMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    // Add request context to headers
    const enhancedRequest = new Proxy(request, {
      get(target, prop) {
        if (prop === 'headers') {
          const headers = new Headers(target.headers);
          headers.set('x-request-id', requestId);
          headers.set('x-request-start', startTime.toString());
          return headers;
        }
        return target[prop as keyof NextRequest];
      }
    });

    // Execute the handler with error recovery
    const response = await errorManager.executeWithRecovery(
      () => handler(enhancedRequest),
      {
        retryStrategy: 'exponential',
        timeout: 30000, // 30 second timeout
        context: {
          requestId,
          method: request.method,
          url: request.url,
          userAgent: request.headers.get('user-agent') || 'unknown',
          userId: await getUserIdFromRequest(request)
        }
      }
    );

    // Add performance headers
    const processingTime = Date.now() - startTime;
    response.headers.set('x-request-id', requestId);
    response.headers.set('x-processing-time', processingTime.toString());

    return response;

  } catch (error) {
    // Handle unrecovered errors
    return handleUnrecoverableError(error as Error, request, requestId, startTime);
  }
}

// Express.js style error handler
export function createExpressErrorHandler() {
  return async (error: Error, req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] || generateRequestId();
    
    try {
      const result = await errorManager.handleError(error, {
        operation: `${req.method} ${req.path}`,
        requestId,
        userId: req.user?.id,
        metadata: {
          headers: req.headers,
          body: req.body,
          query: req.query,
          params: req.params
        }
      });

      // If error was recovered, send the recovery response
      if (result.success && result.recovery) {
        switch (result.recovery.type) {
          case 'redirect':
            return res.redirect(result.recovery.url);
          case 'static_response':
            return res.json(result.recovery.result);
          case 'fallback':
            return res.json({
              error: false,
              message: result.message,
              data: result.recovery.result
            });
          default:
            return res.status(200).json({
              error: false,
              message: result.message
            });
        }
      }

      // Send appropriate error response
      const statusCode = getStatusCodeForError(error);
      const errorResponse = createErrorResponse(error, requestId, result);

      res.status(statusCode).json(errorResponse);

    } catch (handlingError) {
      // Fallback if error handling itself fails
      console.error('Error handler failed:', handlingError);
      
      res.status(500).json({
        error: true,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        requestId
      });
    }
  };
}

// API route wrapper with error handling
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await errorManager.executeWithRecovery(
        () => handler(...args),
        {
          retryStrategy: 'exponential',
          fallbackStrategy: 'default',
          context: {
            handler: handler.name || 'anonymous',
            arguments: args.length
          }
        }
      );
    } catch (error) {
      // Convert to appropriate API error response
      throw createAPIError(error as Error);
    }
  };
}

// Component error boundary for React
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<ErrorBoundaryProps> },
  { hasError: boolean; error?: Error; errorId?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
      errorId: generateRequestId()
    };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle React errors
    await errorManager.handleError(error, {
      category: 'react_error',
      severity: 'high',
      operation: 'component_render',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      }
    });
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error!}
          errorId={this.state.errorId!}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [isRecovering, setIsRecovering] = React.useState(false);

  const handleError = React.useCallback(async (error: Error, context?: any) => {
    setError(error);
    setIsRecovering(true);

    try {
      const result = await errorManager.handleError(error, {
        category: 'react_hook',
        operation: 'user_action',
        ...context
      });

      if (result.success && result.recovery) {
        // Apply recovery if available
        if (result.recovery.type === 'retry') {
          // Retry the operation after delay
          setTimeout(() => {
            setError(null);
            setIsRecovering(false);
          }, result.recovery.delay || 1000);
        } else {
          setError(null);
          setIsRecovering(false);
        }
      } else {
        setIsRecovering(false);
      }
    } catch (handlingError) {
      console.error('Error handling failed:', handlingError);
      setIsRecovering(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setIsRecovering(false);
  }, []);

  return {
    error,
    isRecovering,
    handleError,
    clearError
  };
}

// Database operation wrapper with error handling
export function withDatabaseErrorHandling<T extends any[], R>(
  operation: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return errorManager.createCircuitBreaker(
    async (...args: T): Promise<R> => {
      return await errorManager.retryOperation(
        () => operation(...args),
        'database',
        { operation: operation.name || 'database_operation' }
      );
    },
    {
      failureThreshold: 5,
      resetTimeout: 30000
    }
  );
}

// File operation wrapper with error handling
export function withFileErrorHandling<T extends any[], R>(
  operation: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    return await errorManager.executeWithRecovery(
      () => operation(...args),
      {
        retryStrategy: 'linear',
        fallbackStrategy: 'static',
        timeout: 10000,
        context: {
          operation: 'file_operation',
          type: operation.name
        }
      }
    );
  };
}

// Network request wrapper with error handling
export function withNetworkErrorHandling<T extends any[], R>(
  operation: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return errorManager.createBulkhead(
    async (...args: T): Promise<R> => {
      return await errorManager.retryOperation(
        () => operation(...args),
        'network',
        { operation: 'network_request' }
      );
    },
    {
      maxConcurrent: 10,
      maxQueue: 50
    }
  );
}

// Validation wrapper with error handling
export function withValidationErrorHandling<T>(
  schema: any,
  data: T
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ValidationError(
      'Validation failed',
      error.errors || [{ message: error.message }]
    );
  }
}

// Helper functions
async function handleUnrecoverableError(
  error: Error,
  request: NextRequest,
  requestId: string,
  startTime: number
): Promise<NextResponse> {
  const processingTime = Date.now() - startTime;
  
  // Log the unrecoverable error
  await errorManager.handleError(error, {
    category: 'unrecoverable',
    severity: 'critical',
    operation: `${request.method} ${request.nextUrl.pathname}`,
    requestId,
    metadata: {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      processingTime
    }
  });

  const statusCode = getStatusCodeForError(error);
  const errorResponse = createErrorResponse(error, requestId);

  return NextResponse.json(errorResponse, {
    status: statusCode,
    headers: {
      'x-request-id': requestId,
      'x-processing-time': processingTime.toString(),
      'Content-Type': 'application/json'
    }
  });
}

function getStatusCodeForError(error: Error): number {
  switch (error.name) {
    case 'ValidationError':
      return 400;
    case 'AuthenticationError':
      return 401;
    case 'AuthorizationError':
      return 403;
    case 'NotFoundError':
      return 404;
    case 'RateLimitError':
      return 429;
    case 'TimeoutError':
      return 408;
    case 'NetworkError':
      return 502;
    case 'DatabaseError':
      return 503;
    default:
      return 500;
  }
}

function createErrorResponse(error: Error, requestId: string, result?: any): any {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    error: true,
    code: error.name || 'UNKNOWN_ERROR',
    message: getPublicErrorMessage(error),
    requestId,
    timestamp: new Date().toISOString(),
    ...(isDevelopment && {
      details: {
        message: error.message,
        stack: error.stack
      }
    }),
    ...(result?.recovery && {
      recovery: {
        available: true,
        type: result.recovery.type,
        message: result.recovery.message
      }
    })
  };
}

function getPublicErrorMessage(error: Error): string {
  // Don't expose internal error details in production
  const publicMessages: Record<string, string> = {
    ValidationError: 'Invalid input data provided',
    AuthenticationError: 'Authentication required',
    AuthorizationError: 'Insufficient permissions',
    NotFoundError: 'Resource not found',
    RateLimitError: 'Too many requests, please try again later',
    TimeoutError: 'Request timed out, please try again',
    NetworkError: 'Network error, please check your connection',
    DatabaseError: 'Service temporarily unavailable'
  };

  return publicMessages[error.name] || 'An unexpected error occurred';
}

function createAPIError(error: Error): Error {
  const apiError = new Error(getPublicErrorMessage(error));
  apiError.name = error.name;
  return apiError;
}

async function getUserIdFromRequest(request: NextRequest): Promise<string | undefined> {
  try {
    // Extract user ID from JWT or session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return undefined;
    
    // Mock implementation
    const token = authHeader.replace('Bearer ', '');
    if (token === 'mock_token') {
      return 'user_123';
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Default error fallback component
function DefaultErrorFallback({ error, errorId, retry }: ErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Something went wrong
            </h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Error ID: {errorId}
          </span>
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// Custom error types
export class ValidationError extends Error {
  constructor(message: string, public errors: any[] = []) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string = 'Database error') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Type definitions
interface ErrorBoundaryProps {
  error: Error;
  errorId: string;
  retry: () => void;
}

// React import for error boundary
import React from 'react';