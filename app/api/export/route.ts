// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface ExportRequest {
  type: 'pdf' | 'csv' | 'json';
  data: any;
  template?: string;
  filename?: string;
  options?: {
    includeHeaders?: boolean;
    dateRange?: {
      start: string;
      end: string;
    };
    filters?: Record<string, any>;
  };
}

// POST /api/export - Export data in various formats
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body: ExportRequest = await request.json();
    
    const { type, data, template = 'default', filename, options = {} } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Type and data are required' } },
        { status: 400 }
      );
    }

    let buffer: Buffer;
    let contentType: string;
    let defaultFilename: string;

    switch (type) {
      case 'pdf':
        ({ buffer, contentType, defaultFilename } = await generatePDF(data, template, options));
        break;
      case 'csv':
        ({ buffer, contentType, defaultFilename } = await generateCSV(data, options));
        break;
      case 'json':
        ({ buffer, contentType, defaultFilename } = await generateJSON(data, options));
        break;
      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_TYPE', message: 'Unsupported export type' } },
          { status: 400 }
        );
    }

    const finalFilename = filename || defaultFilename;

    // Log export activity
    try {
      await prisma.event.create({
        data: {
          userId: user.userId,
          event: 'data_export',
          metadata: {
            type,
            template,
            filename: finalFilename,
            dataSize: buffer.length,
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (logError) {
      console.error('Failed to log export activity:', logError);
    }

    // Set response headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${finalFilename}"`);
    headers.set('Content-Length', buffer.length.toString());
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(buffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'EXPORT_ERROR', message: 'Failed to generate export' } },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 exports per minute
  keyGenerator: (req) => `export:${(req as any).user?.userId || 'anonymous'}`
}));

// Helper function to generate PDF
async function generatePDF(data: any, template: string, options: any) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const buffers: Buffer[] = [];

  // Collect PDF data
  doc.on('data', (chunk) => buffers.push(chunk));
  
  return new Promise<{ buffer: Buffer; contentType: string; defaultFilename: string }>((resolve, reject) => {
    doc.on('end', () => {
      const buffer = Buffer.concat(buffers);
      resolve({
        buffer,
        contentType: 'application/pdf',
        defaultFilename: `export_${new Date().toISOString().split('T')[0]}.pdf`
      });
    });

    doc.on('error', reject);

    try {
      switch (template) {
        case 'analytics':
          generateAnalyticsPDF(doc, data, options);
          break;
        case 'user_report':
          generateUserReportPDF(doc, data, options);
          break;
        case 'ai_results':
          generateAIResultsPDF(doc, data, options);
          break;
        default:
          generateDefaultPDF(doc, data, options);
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to generate CSV
async function generateCSV(data: any, options: any) {
  let csvContent = '';
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      csvContent = 'No data available\n';
    } else {
      // Get headers from first object
      const headers = Object.keys(data[0]);
      
      if (options.includeHeaders !== false) {
        csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
      }
      
      // Add data rows
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '""';
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += values.join(',') + '\n';
      }
    }
  } else if (typeof data === 'object') {
    // Convert object to key-value CSV
    if (options.includeHeaders !== false) {
      csvContent += 'Key,Value\n';
    }
    
    for (const [key, value] of Object.entries(data)) {
      csvContent += `"${key}","${String(value).replace(/"/g, '""')}"\n`;
    }
  } else {
    csvContent = `"Data","${String(data).replace(/"/g, '""')}"\n`;
  }

  return {
    buffer: Buffer.from(csvContent, 'utf-8'),
    contentType: 'text/csv; charset=utf-8',
    defaultFilename: `export_${new Date().toISOString().split('T')[0]}.csv`
  };
}

// Helper function to generate JSON
async function generateJSON(data: any, options: any) {
  const jsonData = {
    exportDate: new Date().toISOString(),
    filters: options.filters || {},
    dateRange: options.dateRange,
    data
  };

  const jsonString = JSON.stringify(jsonData, null, 2);
  
  return {
    buffer: Buffer.from(jsonString, 'utf-8'),
    contentType: 'application/json; charset=utf-8',
    defaultFilename: `export_${new Date().toISOString().split('T')[0]}.json`
  };
}

// PDF Template Functions
function generateAnalyticsPDF(doc: any, data: any, options: any) {
  // Header
  doc.fontSize(20).text('Analytics Report', { align: 'center' });
  doc.moveDown();
  
  // Date range
  if (options.dateRange) {
    doc.fontSize(12).text(`Period: ${options.dateRange.start} to ${options.dateRange.end}`, { align: 'center' });
    doc.moveDown();
  }
  
  // Summary metrics
  if (data.overview) {
    doc.fontSize(16).text('Overview', { underline: true });
    doc.moveDown(0.5);
    
    const metrics = [
      ['Total Users', data.overview.totalUsers],
      ['Active Users', data.overview.activeUsers],
      ['Total Revenue', `$${data.overview.totalRevenue?.toLocaleString()}`],
      ['AI Requests', data.overview.aiRequests]
    ];
    
    metrics.forEach(([label, value]) => {
      doc.fontSize(12).text(`${label}: ${value}`);
    });
    
    doc.moveDown();
  }
  
  // AI Usage
  if (data.aiUsage) {
    doc.fontSize(16).text('AI Usage', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(12).text(`Total Requests: ${data.aiUsage.totalRequests}`);
    doc.text(`Average Processing Time: ${data.aiUsage.avgProcessingTime}`);
    
    if (data.aiUsage.byProduct) {
      doc.moveDown(0.5);
      doc.text('By Product:');
      data.aiUsage.byProduct.forEach((product: any) => {
        doc.text(`  ${product.productId}: ${product.requests} requests (${product.avgTime})`, { indent: 20 });
      });
    }
    
    doc.moveDown();
  }
  
  // Insights
  if (data.aiInsights) {
    doc.fontSize(16).text('AI Insights', { underline: true });
    doc.moveDown(0.5);
    
    if (data.aiInsights.insights) {
      doc.fontSize(14).text('Key Insights:', { underline: true });
      data.aiInsights.insights.forEach((insight: string) => {
        doc.fontSize(10).text(`• ${insight}`, { indent: 20 });
      });
      doc.moveDown(0.5);
    }
    
    if (data.aiInsights.opportunities) {
      doc.fontSize(14).text('Opportunities:', { underline: true });
      data.aiInsights.opportunities.forEach((opportunity: string) => {
        doc.fontSize(10).text(`• ${opportunity}`, { indent: 20 });
      });
      doc.moveDown(0.5);
    }
    
    if (data.aiInsights.warnings) {
      doc.fontSize(14).text('Warnings:', { underline: true });
      data.aiInsights.warnings.forEach((warning: string) => {
        doc.fontSize(10).text(`• ${warning}`, { indent: 20 });
      });
    }
  }
  
  // Footer
  doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, 50, doc.page.height - 50, { align: 'center' });
}

function generateUserReportPDF(doc: any, data: any, options: any) {
  doc.fontSize(20).text('User Report', { align: 'center' });
  doc.moveDown();
  
  if (Array.isArray(data)) {
    data.forEach((user, index) => {
      if (index > 0) doc.addPage();
      
      doc.fontSize(16).text(`User: ${user.name}`, { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(12);
      doc.text(`Email: ${user.email}`);
      doc.text(`Plan: ${user.subscription?.plan || 'FREE'}`);
      doc.text(`Status: ${user.subscription?.status || 'ACTIVE'}`);
      doc.text(`Joined: ${new Date(user.createdAt).toLocaleDateString()}`);
      
      if (user.usage) {
        doc.moveDown();
        doc.fontSize(14).text('Usage Statistics:', { underline: true });
        doc.fontSize(12);
        doc.text(`AI Requests: ${user.usage.aiRequestsUsed || 0}`);
        doc.text(`Content Pieces: ${user.usage.contentPieces || 0}`);
        doc.text(`Rewrites: ${user.usage.rewrites || 0}`);
        doc.text(`Bundles: ${user.usage.bundles || 0}`);
      }
    });
  }
}

function generateAIResultsPDF(doc: any, data: any, options: any) {
  doc.fontSize(20).text('AI Generation Results', { align: 'center' });
  doc.moveDown();
  
  if (Array.isArray(data)) {
    data.forEach((result, index) => {
      if (index > 0 && index % 3 === 0) doc.addPage();
      
      doc.fontSize(14).text(`${result.title || `Result ${index + 1}`}`, { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(10);
      if (result.metadata) {
        doc.text(`Model: ${result.metadata.model || 'Unknown'}`);
        doc.text(`Processing Time: ${result.metadata.processingTime || 'Unknown'}ms`);
        doc.text(`Generated: ${new Date(result.metadata.timestamp || Date.now()).toLocaleString()}`);
      }
      
      doc.moveDown(0.5);
      doc.fontSize(12);
      
      const content = typeof result.content === 'string' 
        ? result.content 
        : JSON.stringify(result.content, null, 2);
      
      doc.text(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      doc.moveDown();
    });
  }
}

function generateDefaultPDF(doc: any, data: any, options: any) {
  doc.fontSize(20).text('Data Export', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(12);
  const content = typeof data === 'string' 
    ? data 
    : JSON.stringify(data, null, 2);
  
  doc.text(content);
}