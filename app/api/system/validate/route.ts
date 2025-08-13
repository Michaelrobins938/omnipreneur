// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import APIValidator from '@/lib/validation/api-validator';

// GET /api/system/validate - Run comprehensive system validation
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Only allow admins to run system validation
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'all'; // all, apis, database, ai
    const includeDetails = searchParams.get('details') === 'true';

    const validator = new APIValidator();
    
    // Set auth tokens for API testing
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      await validator.setAuthTokens(token, token); // Use same token for admin tests
    }

    let report;

    switch (scope) {
      case 'apis':
        const apiResults = await validator.validateAllAPIs();
        report = {
          summary: {
            total: apiResults.length,
            passed: apiResults.filter(r => r.status === 'pass').length,
            warnings: apiResults.filter(r => r.status === 'warning').length,
            failed: apiResults.filter(r => r.status === 'fail').length
          },
          results: { apis: apiResults },
          scope: 'APIs Only'
        };
        break;

      case 'database':
        const dbResults = await validator.validateDatabaseIntegrity();
        report = {
          summary: {
            total: dbResults.length,
            passed: dbResults.filter(r => r.status === 'pass').length,
            warnings: dbResults.filter(r => r.status === 'warning').length,
            failed: dbResults.filter(r => r.status === 'fail').length
          },
          results: { database: dbResults },
          scope: 'Database Only'
        };
        break;

      case 'ai':
        const aiResults = await validator.validateAIServices();
        report = {
          summary: {
            total: aiResults.length,
            passed: aiResults.filter(r => r.status === 'pass').length,
            warnings: aiResults.filter(r => r.status === 'warning').length,
            failed: aiResults.filter(r => r.status === 'fail').length
          },
          results: { aiServices: aiResults },
          scope: 'AI Services Only'
        };
        break;

      case 'all':
      default:
        report = await validator.generateValidationReport();
        report.scope = 'Complete System';
        break;
    }

    // Remove detailed results if not requested
    if (!includeDetails && report.results) {
      Object.keys(report.results).forEach(key => {
        report.results[key] = report.results[key].map((result: any) => ({
          endpoint: result.endpoint,
          status: result.status,
          message: result.message,
          responseTime: result.responseTime
        }));
      });
    }

    // Add metadata
    report.timestamp = new Date().toISOString();
    report.requestedBy = user.userId;
    report.version = process.env.npm_package_version || '1.0.0';

    return NextResponse.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('System validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Failed to run system validation' 
        } 
      },
      { status: 500 }
    );
  }
});

// POST /api/system/validate - Run targeted validation tests
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { endpoints, options = {} } = await request.json();

    if (!endpoints || !Array.isArray(endpoints)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Endpoints array required' } },
        { status: 400 }
      );
    }

    const validator = new APIValidator();
    
    // Set auth tokens
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      await validator.setAuthTokens(token, token);
    }

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const test = {
          endpoint: endpoint.path,
          method: endpoint.method || 'GET',
          description: endpoint.description || `Test ${endpoint.path}`,
          requiresAuth: endpoint.requiresAuth !== false,
          requiresAdmin: endpoint.requiresAdmin || false,
          testData: endpoint.testData
        };

        const result = await validator.validateEndpoint(test);
        results.push(result);
      } catch (error) {
        results.push({
          endpoint: endpoint.path,
          status: 'fail',
          message: `Test setup error: ${error.message}`
        });
      }
    }

    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      warnings: results.filter(r => r.status === 'warning').length,
      failed: results.filter(r => r.status === 'fail').length
    };

    return NextResponse.json({
      success: true,
      data: {
        summary,
        results,
        timestamp: new Date().toISOString(),
        requestedBy: user.userId
      }
    });

  } catch (error) {
    console.error('Targeted validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Failed to run targeted validation' 
        } 
      },
      { status: 500 }
    );
  }
});