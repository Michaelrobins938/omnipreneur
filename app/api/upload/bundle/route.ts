// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { fileProcessor } from '@/lib/upload/file-processor';
import { z } from 'zod';

const CreateBundleSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  files: z.array(z.object({
    uploadId: z.string(),
    metadata: z.record(z.any()).optional()
  })).min(1).max(50),
  options: z.object({
    includeReadme: z.boolean().default(true),
    includeLicense: z.boolean().default(true),
    license: z.string().optional(),
    licenseText: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    price: z.number().min(0).optional(),
    marketplace: z.enum(['gumroad', 'etsy', 'shopify', 'custom']).optional()
  }).optional()
});

/**
 * POST /api/upload/bundle
 * 
 * Create product bundle from uploaded files
 * 
 * Authentication: Required
 * Subscription: BUNDLE_BUILDER, PRO, or ENTERPRISE required
 */
export async function POST(request: NextRequest) {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const { name, description, files, options = {} } = CreateBundleSchema.parse(body);
    
    // Check subscription access
    const subscription = await getUserSubscription(user.userId);
    const allowedPlans = ['BUNDLE_BUILDER', 'PRO', 'ENTERPRISE'];
    
    if (!allowedPlans.includes(subscription.plan)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'SUBSCRIPTION_REQUIRED', 
            message: 'Bundle Builder subscription required',
            upgradeUrl: '/pricing'
          } 
        },
        { status: 403 }
      );
    }
    
    // Check bundle creation limits
    const bundleLimits = getBundleLimits(subscription.plan);
    const currentBundles = await getUserBundleCount(user.userId);
    
    if (bundleLimits.monthlyLimit !== -1 && currentBundles >= bundleLimits.monthlyLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'BUNDLE_LIMIT_EXCEEDED', 
            message: `Monthly bundle limit of ${bundleLimits.monthlyLimit} reached`,
            upgradeUrl: '/pricing'
          } 
        },
        { status: 429 }
      );
    }
    
    // Validate file ownership
    const fileValidation = await validateFileOwnership(files, user.userId);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'FILE_ACCESS_DENIED', 
            message: fileValidation.error
          } 
        },
        { status: 403 }
      );
    }
    
    // Create bundle
    const bundleResult = await fileProcessor.createBundle(files, {
      name,
      description,
      includeReadme: options.includeReadme,
      includeLicense: options.includeLicense,
      license: options.license || 'Standard Digital License',
      licenseText: options.licenseText
    });
    
    // Generate marketplace listings if specified
    let marketplaceListings: any = {};
    
    if (options.marketplace) {
      marketplaceListings = await generateMarketplaceListings({
        bundle: bundleResult,
        name,
        description,
        category: options.category,
        tags: options.tags,
        price: options.price,
        marketplace: options.marketplace
      });
    }
    
    // Save bundle to database
    const bundleRecord = await saveBundleToDatabase({
      userId: user.userId,
      bundleId: bundleResult.bundleId,
      name,
      description,
      files,
      options,
      path: bundleResult.path,
      size: bundleResult.size,
      hash: bundleResult.hash,
      metadata: bundleResult.metadata,
      marketplaceListings
    });
    
    // Update usage counter
    await updateBundleUsage(user.userId, 1);
    
    // Log bundle creation event
    await logBundleEvent({
      userId: user.userId,
      bundleId: bundleResult.bundleId,
      action: 'created',
      metadata: {
        fileCount: files.length,
        size: bundleResult.size,
        marketplace: options.marketplace
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        bundle: {
          ...bundleResult,
          id: bundleRecord.id,
          createdAt: bundleRecord.createdAt
        },
        marketplaceListings,
        remaining: bundleLimits.monthlyLimit !== -1 ? 
          bundleLimits.monthlyLimit - currentBundles - 1 : -1,
        message: 'Bundle created successfully'
      }
    });
    
  } catch (error) {
    console.error('Bundle creation error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid bundle data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'BUNDLE_ERROR', 
          message: error.message || 'Failed to create bundle' 
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload/bundle
 * 
 * Get user's bundles
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - page: number
 * - limit: number
 * - status: 'active' | 'deleted'
 */
export async function GET(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'active';
    
    // Get user bundles
    const bundles = await getUserBundles({
      userId: user.userId,
      page,
      limit,
      status
    });
    
    // Get bundle analytics
    const bundlesWithAnalytics = await Promise.all(
      bundles.bundles.map(async (bundle: any) => {
        const analytics = await getBundleAnalytics(bundle.id);
        return {
          ...bundle,
          analytics: {
            downloads: analytics.downloads,
            views: analytics.views,
            revenue: analytics.revenue,
            conversionRate: analytics.conversionRate
          }
        };
      })
    );
    
    const usage = await getUserBundleUsage(user.userId);
    
    return NextResponse.json({
      success: true,
      data: {
        bundles: bundlesWithAnalytics,
        pagination: {
          page,
          limit,
          total: bundles.total,
          pages: Math.ceil(bundles.total / limit)
        },
        usage: {
          monthlyBundles: usage.monthlyBundles,
          totalStorage: usage.totalStorage,
          limits: getBundleLimits(usage.plan)
        }
      }
    });
    
  } catch (error) {
    console.error('Get bundles error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch bundles' 
        } 
      },
      { status: 500 }
    );
  }
}

// Helper functions
async function getUserSubscription(userId: string): Promise<{ plan: string }> {
  // Mock implementation - replace with actual database query
  return { plan: 'PRO' };
}

async function getUserBundleCount(userId: string): Promise<number> {
  // Mock implementation - replace with actual database query
  return 5;
}

async function getUserBundleUsage(userId: string): Promise<{ monthlyBundles: number; totalStorage: number; plan: string }> {
  // Mock implementation - replace with actual database query
  return {
    monthlyBundles: 5,
    totalStorage: 256 * 1024 * 1024, // 256MB
    plan: 'PRO'
  };
}

async function updateBundleUsage(userId: string, increment: number): Promise<void> {
  // Mock implementation - replace with actual database update
  console.log(`Updating bundle usage for user ${userId}: ${increment}`);
}

function getBundleLimits(plan: string): any {
  const limits = {
    FREE: {
      monthlyLimit: 2,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      maxFiles: 5
    },
    BUNDLE_BUILDER: {
      monthlyLimit: 25,
      maxFileSize: 200 * 1024 * 1024, // 200MB
      maxFiles: 20
    },
    PRO: {
      monthlyLimit: 100,
      maxFileSize: 500 * 1024 * 1024, // 500MB
      maxFiles: 50
    },
    ENTERPRISE: {
      monthlyLimit: -1, // Unlimited
      maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
      maxFiles: 100
    }
  };
  
  return limits[plan as keyof typeof limits] || limits.FREE;
}

async function validateFileOwnership(files: Array<{ uploadId: string }>, userId: string): Promise<{ valid: boolean; error?: string }> {
  for (const file of files) {
    const upload = fileProcessor.getUploadStatus(file.uploadId);
    
    if (!upload) {
      return {
        valid: false,
        error: `Upload ${file.uploadId} not found`
      };
    }
    
    if (upload.options.userId !== userId) {
      return {
        valid: false,
        error: `Access denied to upload ${file.uploadId}`
      };
    }
    
    if (upload.status !== 'completed') {
      return {
        valid: false,
        error: `Upload ${file.uploadId} is not completed`
      };
    }
  }
  
  return { valid: true };
}

async function generateMarketplaceListings(data: any): Promise<any> {
  const { bundle, name, description, category, tags, price, marketplace } = data;
  
  const listings: any = {};
  
  switch (marketplace) {
    case 'gumroad':
      listings.gumroad = {
        title: name,
        description: description || 'Digital product bundle',
        price: price || 9.99,
        tags: tags || ['digital', 'bundle'],
        files: [
          {
            name: `${name}.zip`,
            url: bundle.downloadUrl
          }
        ]
      };
      break;
      
    case 'etsy':
      listings.etsy = {
        title: name,
        description: description || 'Digital download bundle',
        price: price || 9.99,
        category: category || 'Craft Supplies & Tools',
        tags: tags || ['digital', 'download', 'bundle'],
        photos: [] // Add bundle preview images
      };
      break;
      
    case 'shopify':
      listings.shopify = {
        title: name,
        body_html: description || 'Digital product bundle for download',
        product_type: 'Digital Product',
        vendor: 'Omnipreneur',
        variants: [
          {
            price: price || 9.99,
            inventory_management: null,
            requires_shipping: false
          }
        ]
      };
      break;
      
    default:
      listings.custom = {
        name,
        description,
        price,
        downloadUrl: bundle.downloadUrl
      };
  }
  
  return listings;
}

async function saveBundleToDatabase(bundleData: any): Promise<any> {
  // Mock implementation - replace with actual database save
  const bundleRecord = {
    id: bundleData.bundleId,
    userId: bundleData.userId,
    name: bundleData.name,
    description: bundleData.description,
    path: bundleData.path,
    size: bundleData.size,
    hash: bundleData.hash,
    metadata: bundleData.metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  console.log('Saving bundle to database:', bundleRecord);
  return bundleRecord;
}

async function getUserBundles(filters: any): Promise<any> {
  // Mock implementation - replace with actual database query
  const bundles = [
    {
      id: 'bundle_1',
      name: 'Social Media Templates Pack',
      description: 'Complete social media template collection',
      size: 45 * 1024 * 1024,
      fileCount: 12,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: '/api/bundles/download/bundle_1'
    },
    {
      id: 'bundle_2',
      name: 'E-book Design Kit',
      description: 'Professional e-book design templates',
      size: 78 * 1024 * 1024,
      fileCount: 8,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      downloadUrl: '/api/bundles/download/bundle_2'
    }
  ];
  
  return {
    bundles,
    total: bundles.length
  };
}

async function getBundleAnalytics(bundleId: string): Promise<any> {
  // Mock implementation - replace with actual analytics query
  return {
    downloads: Math.floor(Math.random() * 100) + 10,
    views: Math.floor(Math.random() * 500) + 50,
    revenue: Math.floor(Math.random() * 1000) + 100,
    conversionRate: Math.random() * 10 + 2
  };
}

async function logBundleEvent(eventData: any): Promise<void> {
  // Mock implementation - replace with actual logging
  console.log('Bundle event:', eventData);
}