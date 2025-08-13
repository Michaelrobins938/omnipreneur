// API Validation and Testing Utilities
import { z } from 'zod';

// Request validation schemas
export const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000)
  })).min(1),
  model: z.string().optional().default('gpt-4o-mini'),
  maxTokens: z.number().min(1).max(4000).optional().default(2000),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  systemPrompt: z.string().optional(),
  sessionId: z.string().optional()
});

export const ProductGenerationSchema = z.object({
  productId: z.string().min(1),
  action: z.enum(['generate', 'analyze']),
  parameters: z.record(z.any()),
  userId: z.string().optional()
});

export const UploadSchema = z.object({
  file: z.any(), // File validation handled separately
  purpose: z.string().optional().default('general'),
  context: z.string().optional().default('')
});

export const ExportRequestSchema = z.object({
  type: z.enum(['analytics', 'users', 'ai-requests', 'chat-sessions', 'results']),
  format: z.enum(['csv', 'pdf', 'json']),
  filters: z.object({
    dateRange: z.object({
      start: z.string(),
      end: z.string()
    }).optional(),
    userId: z.string().optional(),
    productId: z.string().optional()
  }).optional(),
  columns: z.array(z.string()).optional()
});

export const AdminUserUpdateSchema = z.object({
  userId: z.string(),
  updates: z.object({
    role: z.enum(['USER', 'ADMIN']).optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']).optional(),
    aiCredits: z.number().min(0).optional(),
    subscription: z.object({
      plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']).optional(),
      status: z.enum(['ACTIVE', 'CANCELLED', 'PAST_DUE']).optional()
    }).optional()
  })
});

// Response validation schemas
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  }).optional(),
  metadata: z.object({
    timestamp: z.string(),
    requestId: z.string().optional(),
    processingTime: z.number().optional()
  }).optional()
});

export const PaginatedResponseSchema = APIResponseSchema.extend({
  data: z.object({
    items: z.array(z.any()),
    total: z.number(),
    page: z.number().optional(),
    limit: z.number().optional(),
    hasMore: z.boolean().optional()
  })
});

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request): Promise<{ isValid: boolean; data?: T; errors?: string[] }> => {
    try {
      const body = await request.json();
      const result = schema.safeParse(body);
      
      if (result.success) {
        return { isValid: true, data: result.data };
      } else {
        const errors = result.error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        return { isValid: false, errors };
      }
    } catch (error) {
      return { isValid: false, errors: ['Invalid JSON in request body'] };
    }
  };
}

export function validateResponse<T>(schema: z.ZodSchema<T>, response: any): { isValid: boolean; errors?: string[] } {
  const result = schema.safeParse(response);
  
  if (result.success) {
    return { isValid: true };
  } else {
    const errors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
    return { isValid: false, errors };
  }
}

// API endpoint testing utilities
export class APITester {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string = '', authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async testEndpoint(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    expectedStatus: number = 200
  ): Promise<{
    success: boolean;
    status: number;
    response?: any;
    error?: string;
    duration: number;
  }> {
    const start = Date.now();
    
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: this.getHeaders()
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const duration = Date.now() - start;
      
      const responseData = await response.json();
      
      return {
        success: response.status === expectedStatus,
        status: response.status,
        response: responseData,
        duration
      };

    } catch (error) {
      const duration = Date.now() - start;
      return {
        success: false,
        status: 0,
        error: error.message,
        duration
      };
    }
  }

  async testChatAPI(messages: any[], model?: string): Promise<any> {
    return this.testEndpoint('POST', '/api/chat/complete', {
      messages,
      model,
      maxTokens: 100,
      temperature: 0.7
    });
  }

  async testAnalyticsAPI(): Promise<any> {
    return this.testEndpoint('GET', '/api/analytics/dashboard');
  }

  async testProductAPI(productId: string, parameters: any): Promise<any> {
    return this.testEndpoint('POST', '/api/products/universal', {
      productId,
      action: 'generate',
      parameters
    });
  }

  async testUploadAPI(file: any, purpose?: string): Promise<any> {
    // Note: This would need to be adapted for actual file upload testing
    const formData = new FormData();
    formData.append('file', file);
    if (purpose) formData.append('purpose', purpose);

    const headers = this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {};

    try {
      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        headers,
        body: formData
      });

      return {
        success: response.ok,
        status: response.status,
        response: await response.json()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runFullAPITest(): Promise<{
    passed: number;
    failed: number;
    tests: Array<{
      name: string;
      status: 'passed' | 'failed';
      duration: number;
      error?: string;
    }>;
  }> {
    const tests = [];
    let passed = 0;
    let failed = 0;

    // Test 1: Analytics Dashboard
    const analyticsTest = await this.testAnalyticsAPI();
    const analyticsResult = {
      name: 'Analytics Dashboard',
      status: analyticsTest.success ? 'passed' as const : 'failed' as const,
      duration: analyticsTest.duration,
      error: analyticsTest.error
    };
    tests.push(analyticsResult);
    if (analyticsResult.status === 'passed') passed++; else failed++;

    // Test 2: Chat API
    const chatTest = await this.testChatAPI([
      { role: 'user', content: 'Hello, this is a test message' }
    ]);
    const chatResult = {
      name: 'Chat API',
      status: chatTest.success ? 'passed' as const : 'failed' as const,
      duration: chatTest.duration,
      error: chatTest.error
    };
    tests.push(chatResult);
    if (chatResult.status === 'passed') passed++; else failed++;

    // Test 3: Product Generation
    const productTest = await this.testProductAPI('aesthetic-generator', {
      theme: 'modern',
      primaryColor: '#000000'
    });
    const productResult = {
      name: 'Product Generation',
      status: productTest.success ? 'passed' as const : 'failed' as const,
      duration: productTest.duration,
      error: productTest.error
    };
    tests.push(productResult);
    if (productResult.status === 'passed') passed++; else failed++;

    return { passed, failed, tests };
  }
}

// Utility functions for common validations
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validateFileUpload(file: any): { isValid: boolean; errors: string[] } {
  const errors = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword', 'application/json'
  ];

  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  return { isValid: errors.length === 0, errors };
}

// Environment validation
export function validateEnvironment(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors = [];
  const warnings = [];

  // Required environment variables
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET'
  ];

  required.forEach(key => {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  });

  // Optional but recommended
  const recommended = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'REDIS_URL',
    'WEBSOCKET_PORT'
  ];

  recommended.forEach(key => {
    if (!process.env[key]) {
      warnings.push(`Missing recommended environment variable: ${key}`);
    }
  });

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long');
  }

  return { isValid: errors.length === 0, errors, warnings };
}

export default {
  ChatRequestSchema,
  ProductGenerationSchema,
  UploadSchema,
  ExportRequestSchema,
  AdminUserUpdateSchema,
  APIResponseSchema,
  PaginatedResponseSchema,
  validateRequest,
  validateResponse,
  APITester,
  validateEmail,
  validatePassword,
  validateFileUpload,
  validateEnvironment
};