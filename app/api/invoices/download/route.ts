// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const DownloadInvoiceSchema = z.object({
  paymentId: z.string().optional(),
  invoiceId: z.string().optional(),
  format: z.enum(['pdf', 'json']).default('pdf')
});

// GET /api/invoices/download?paymentId=123&format=pdf
// Downloads an invoice for a specific payment
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const { paymentId, invoiceId, format } = DownloadInvoiceSchema.parse({
      paymentId: searchParams.get('paymentId') || undefined,
      invoiceId: searchParams.get('invoiceId') || undefined,
      format: searchParams.get('format') || 'pdf'
    });

    if (!paymentId && !invoiceId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_ID', message: 'Payment ID or Invoice ID is required' } },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { id: paymentId, userId: user.userId },
          { stripePaymentIntentId: invoiceId, userId: user.userId }
        ]
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: { code: 'INVOICE_NOT_FOUND', message: 'Invoice not found or access denied' } },
        { status: 404 }
      );
    }

    if (format === 'json') {
      // Return invoice data as JSON
      const invoiceData = {
        invoiceNumber: `INV-${payment.id.slice(-8).toUpperCase()}`,
        date: payment.createdAt,
        dueDate: payment.createdAt, // For subscription payments, this is same as payment date
        billTo: {
          name: payment.user.name,
          email: payment.user.email
        },
        billFrom: {
          name: 'Omnipreneur AI Suite',
          address: '123 Innovation Street\nTech City, TC 12345\nUnited States',
          email: 'billing@omnipreneur.com',
          website: 'https://omnipreneur.com'
        },
        items: [
          {
            description: payment.productName,
            plan: payment.plan,
            amount: payment.amount,
            currency: payment.currency,
            period: getPeriodFromMetadata(payment.metadata)
          }
        ],
        total: {
          subtotal: payment.amount,
          tax: 0, // Tax handling would be implemented based on business rules
          total: payment.amount
        },
        payment: {
          status: payment.status,
          method: 'Credit Card', // This would come from Stripe payment method details
          transactionId: payment.stripePaymentIntentId
        },
        metadata: payment.metadata
      };

      return NextResponse.json({
        success: true,
        data: invoiceData
      });
    }

    // Generate PDF invoice
    const pdfBuffer = await generateInvoicePDF(payment);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${payment.id.slice(-8)}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error('Invoice download error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request parameters', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INVOICE_ERROR', message: 'Failed to download invoice' } },
      { status: 500 }
    );
  }
}, {
  limit: 30,
  windowMs: 15 * 60 * 1000, // 30 requests per 15 minutes
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `invoice-download:${userId}:${ip}`;
  }
}));

// POST /api/invoices/download - Bulk download multiple invoices
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const { paymentIds, format = 'pdf' } = z.object({
      paymentIds: z.array(z.string()),
      format: z.enum(['pdf', 'zip']).default('pdf')
    }).parse(body);

    if (paymentIds.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'EMPTY_LIST', message: 'No payment IDs provided' } },
        { status: 400 }
      );
    }

    if (paymentIds.length > 50) {
      return NextResponse.json(
        { success: false, error: { code: 'TOO_MANY_INVOICES', message: 'Maximum 50 invoices per request' } },
        { status: 400 }
      );
    }

    // Find the payment records
    const payments = await prisma.payment.findMany({
      where: {
        id: { in: paymentIds },
        userId: user.userId
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (payments.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_INVOICES_FOUND', message: 'No accessible invoices found' } },
        { status: 404 }
      );
    }

    if (format === 'zip') {
      // Create ZIP file with multiple PDFs
      const zipBuffer = await createInvoiceZip(payments);
      
      return new NextResponse(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="invoices-${new Date().toISOString().split('T')[0]}.zip"`,
          'Content-Length': zipBuffer.length.toString()
        }
      });
    }

    // Return JSON array of invoice data
    const invoicesData = payments.map(payment => ({
      invoiceNumber: `INV-${payment.id.slice(-8).toUpperCase()}`,
      date: payment.createdAt,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      productName: payment.productName,
      plan: payment.plan,
      transactionId: payment.stripePaymentIntentId
    }));

    return NextResponse.json({
      success: true,
      data: {
        invoices: invoicesData,
        total: payments.length
      }
    });

  } catch (error: any) {
    console.error('Bulk invoice download error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'BULK_INVOICE_ERROR', message: 'Failed to process bulk invoice download' } },
      { status: 500 }
    );
  }
}, {
  limit: 10,
  windowMs: 15 * 60 * 1000, // 10 requests per 15 minutes for bulk operations
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `invoice-bulk-download:${userId}:${ip}`;
  }
}));

/**
 * Generate PDF invoice (simplified version)
 * In a real implementation, you'd use a library like puppeteer, jsPDF, or PDFKit
 */
async function generateInvoicePDF(payment: any): Promise<Buffer> {
  // This is a simplified HTML-to-PDF conversion
  // In production, you'd use a proper PDF generation library
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice INV-${payment.id.slice(-8).toUpperCase()}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
        .invoice-number { font-size: 14px; color: #666; margin-top: 5px; }
        .billing-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .bill-to, .bill-from { width: 45%; }
        .bill-to h3, .bill-from h3 { margin-bottom: 10px; color: #333; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #f5f5f5; font-weight: bold; }
        .total-row { font-weight: bold; background-color: #f9f9f9; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">Invoice #: INV-${payment.id.slice(-8).toUpperCase()}</div>
        <div class="invoice-number">Date: ${new Date(payment.createdAt).toLocaleDateString()}</div>
      </div>
      
      <div class="billing-info">
        <div class="bill-from">
          <h3>From:</h3>
          <strong>Omnipreneur AI Suite</strong><br>
          123 Innovation Street<br>
          Tech City, TC 12345<br>
          United States<br>
          billing@omnipreneur.com
        </div>
        <div class="bill-to">
          <h3>Bill To:</h3>
          <strong>${payment.user.name}</strong><br>
          ${payment.user.email}
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Plan</th>
            <th>Period</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${payment.productName}</td>
            <td>${payment.plan}</td>
            <td>${getPeriodFromMetadata(payment.metadata)}</td>
            <td>$${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>$${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p><strong>Payment Status:</strong> ${payment.status}</p>
        <p><strong>Transaction ID:</strong> ${payment.stripePaymentIntentId}</p>
        <p>Thank you for your business!</p>
      </div>
    </body>
    </html>
  `;

  // In production, convert HTML to PDF using puppeteer or similar
  // For now, return the HTML as a simple text buffer
  return Buffer.from(html, 'utf8');
}

/**
 * Create ZIP file with multiple invoice PDFs
 */
async function createInvoiceZip(payments: any[]): Promise<Buffer> {
  // This would use a ZIP library like JSZip or node-archiver in production
  // For now, return a simple buffer
  const zipContent = payments.map(payment => 
    `Invoice ${payment.id}: ${payment.productName} - $${(payment.amount / 100).toFixed(2)}`
  ).join('\n');
  
  return Buffer.from(zipContent, 'utf8');
}

/**
 * Extract billing period from payment metadata
 */
function getPeriodFromMetadata(metadata: any): string {
  if (!metadata) return 'One-time';
  
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed.billingCycle || 'Monthly';
    } catch {
      return 'Monthly';
    }
  }
  
  return metadata.billingCycle || 'Monthly';
}