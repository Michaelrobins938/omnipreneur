import { NextRequest, NextResponse } from 'next/server';
import { requireEntitlement } from '@/lib/auth-middleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { chatComplete } from '@/lib/ai/openai';
import { completeClaude } from '@/lib/ai/claude';
import { logAIRequest } from '@/lib/db';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';
import AdmZip from 'adm-zip';

const prisma = new PrismaClient();

// Validation schema
const CreateBundleSchema = z.object({
  name: z.string().min(3, 'Bundle name must be at least 3 characters'),
  description: z.string().optional(),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().min(0),
    type: z.enum(['digital', 'course', 'template', 'ebook', 'software']).default('digital'),
    content: z.string().optional(),
    files: z.array(z.object({
      name: z.string(),
      content: z.string(), // Base64 encoded content
      type: z.string()
    })).optional()
  })).min(1, 'At least one product is required'),
  pricing: z.object({
    individual: z.number().min(0),
    bundle: z.number().min(0),
    discount: z.number().min(0).max(100)
  }),
  category: z.enum(['productivity', 'marketing', 'design', 'development', 'business', 'education']).default('business'),
  tags: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  marketplaces: z.array(z.enum(['gumroad', 'etsy', 'shopify', 'wordpress'])).default(['gumroad']),
  withAIMaterials: z.boolean().optional()
});

/**
 * POST /api/bundles/create
 * 
 * Create and package digital product bundles with ZIP generation
 * 
 * Authentication: Required
 * Subscription: BUNDLE_BUILDER, PRO, or ENTERPRISE required
 */
export const POST = requireEntitlement('bundle-builder')(withCsrfProtection(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateBundleSchema.parse(body);
    const { name, description, products, pricing, category, tags, targetAudience, marketplaces, withAIMaterials } = validatedData;

    // Check user subscription
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true, usage: true }
    });

    if (!userWithSubscription) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Check subscription access
    const allowedPlans = ['BUNDLE_BUILDER', 'PRO', 'ENTERPRISE'];
    const userPlan = userWithSubscription.subscription?.plan || 'FREE';
    
    if (!allowedPlans.includes(userPlan)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'SUBSCRIPTION_REQUIRED', 
            message: 'Bundle Builder subscription required',
            upgradeUrl: '/products/bundle-builder'
          } 
        },
        { status: 403 }
      );
    }

    // Check usage limits
    const usageLimits = {
      FREE: 0,
      BUNDLE_BUILDER: 25,
      PRO: 100,
      ENTERPRISE: -1 // unlimited
    };

    const monthlyLimit = usageLimits[userPlan as keyof typeof usageLimits];
    const currentUsage = userWithSubscription.usage?.bundles || 0;

    if (monthlyLimit !== -1 && currentUsage >= monthlyLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USAGE_LIMIT_EXCEEDED', 
            message: `Monthly limit of ${monthlyLimit} bundles exceeded`,
            upgradeUrl: '/products/bundle-builder'
          } 
        },
        { status: 429 }
      );
    }

    // Generate AI-powered bundle strategy
    let bundleStrategy = null;
    if (withAIMaterials) {
      try {
        const { BundleBuilderService } = await import('@/lib/ai/bundle-builder-service');
        const bundleService = new BundleBuilderService();
        
        bundleStrategy = await bundleService.process({
          products: products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            type: p.type,
            content: p.content,
            files: p.files,
            description: description
          })),
          targetAudience: targetAudience || 'General customers',
          category,
          marketplaces,
          priceStrategy: 'value',
          bundleGoal: 'maximize_revenue'
        });
      } catch (error) {
        console.error('AI bundle strategy generation failed:', error);
      }
    }

    // Create ZIP bundle with AI-enhanced materials
    const bundleResult = await createDigitalBundle({
      name: bundleStrategy?.bundleName || name,
      ...(description ? { description } : {}),
      products,
      pricing,
      category,
      tags,
      ...(targetAudience ? { targetAudience } : {}),
      marketplaces,
      withAIMaterials: !!withAIMaterials,
      userId: user.userId,
      aiStrategy: bundleStrategy
    });

    // Save bundle to database
    const bundle = await prisma.bundle.create({
      data: {
        userId: user.userId,
        name,
        price: pricing.bundle,
        bundleType: category.toUpperCase() as 'COURSE' | 'TEMPLATE' | 'TOOLKIT' | 'MASTERCLASS' | 'SOFTWARE',
        targetAudience: targetAudience || 'General customers',
        description: description || '',
        products: products.map(p => p.name),
        pricingStrategy: 'value',
        bundleData: {
          pricing,
          productDetails: products,
          marketplaces,
          downloadUrl: bundleResult.downloadUrl,
          zipSize: bundleResult.zipSize,
          productCount: products.length,
          bundleId: bundleResult.bundleId
        },
        marketingMaterials: bundleResult.marketingMaterials
      }
    });

    // Update usage counter
    await prisma.usage.upsert({
      where: { userId: user.userId },
      update: { bundles: { increment: 1 } },
      create: {
        userId: user.userId,
        rewrites: 0,
        contentPieces: 0,
        bundles: 1,
        affiliateLinks: 0
      }
    });

    // Log analytics event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'bundle_created',
        metadata: {
          bundleId: bundle.id,
          bundleName: name,
          productCount: products.length,
          totalValue: pricing.individual,
          bundlePrice: pricing.bundle,
          discountPercent: pricing.discount,
          category,
          marketplaces
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: bundle.id,
        name: bundle.name,
        description: bundle.description,
        downloadUrl: bundleResult.downloadUrl,
        zipSize: bundleResult.zipSize,
        productCount: products.length,
        pricing,
        marketingMaterials: bundleResult.marketingMaterials,
        listingTemplates: bundleResult.listingTemplates,
        usage: {
          current: currentUsage + 1,
          limit: monthlyLimit,
          remaining: monthlyLimit === -1 ? -1 : Math.max(0, monthlyLimit - currentUsage - 1)
        }
      }
    });

  } catch (error: any) {
    console.error('Bundle creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
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
          code: 'BUNDLE_CREATION_ERROR', 
          message: 'Failed to create bundle' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 20,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `bundles-create:${userId}:${ip}`;
  }
})));

/**
 * Create digital bundle with ZIP packaging and marketing materials
 */
async function createDigitalBundle(params: {
  name: string;
  description?: string;
  products: any[];
  pricing: any;
  category: string;
  tags: string[];
  targetAudience?: string;
  marketplaces: string[];
  withAIMaterials: boolean;
  userId: string;
  aiStrategy?: any;
}) {
  const { name, description, products, pricing, category, targetAudience, marketplaces, withAIMaterials, userId, aiStrategy } = params;
  const bundleId = `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create ZIP file
  const zip = new AdmZip();

  // Add product files to ZIP
  products.forEach((product, index) => {
    const productFolder = `${index + 1}_${sanitizeFileName(product.name)}/`;
    
    // Add product content file
    if (product.content) {
      zip.addFile(`${productFolder}${sanitizeFileName(product.name)}.txt`, Buffer.from(product.content, 'utf8'));
    }

    // Add product-specific files
    if (product.files && product.files.length > 0) {
      product.files.forEach((file: { name: string; content: string; type: string }) => {
        try {
          const fileContent = Buffer.from(file.content, 'base64');
          zip.addFile(`${productFolder}${sanitizeFileName(file.name)}`, fileContent);
        } catch (error) {
          console.error(`Error adding file ${file.name}:`, error);
        }
      });
    }

    // Add product information file
    const productInfo = generateProductInfo(product, index + 1);
    zip.addFile(`${productFolder}PRODUCT_INFO.md`, Buffer.from(productInfo, 'utf8'));
  });

  // Add bundle documentation
  const bundleReadme = generateBundleReadme(name, description, products, pricing);
  zip.addFile('README.md', Buffer.from(bundleReadme, 'utf8'));

  // Add license file
  const licenseContent = generateLicenseFile(name);
  zip.addFile('LICENSE.txt', Buffer.from(licenseContent, 'utf8'));

  // Generate marketing materials (optionally AI-enriched)
  let marketingMaterials = generateMarketingMaterials(params);
  if (withAIMaterials && aiStrategy) {
    try {
      const t0 = Date.now();
      // Use AI strategy data for enhanced marketing materials
      marketingMaterials = {
        ...marketingMaterials,
        bundleDescription: aiStrategy.marketing.bundleDescription,
        valueProposition: aiStrategy.marketing.valueProposition,
        headlines: aiStrategy.marketing.headlines,
        bulletPoints: aiStrategy.marketing.bulletPoints,
        pricing: aiStrategy.pricing,
        positioning: aiStrategy.positioning,
        recommendations: aiStrategy.recommendations
      };
      try {
        await logAIRequest({
          userId,
          productId: 'bundle-builder',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { name, category, targetAudience },
          outputData: aiStrategy
        });
      } catch (_) {}
    } catch (_) {}
  }
  
  // Add marketing materials to ZIP
  zip.addFile('MARKETING/product_description.md', Buffer.from(marketingMaterials.productDescription, 'utf8'));
  zip.addFile('MARKETING/sales_copy.md', Buffer.from(marketingMaterials.salesCopy, 'utf8'));
  zip.addFile('MARKETING/email_campaign.md', Buffer.from(marketingMaterials.emailCampaign, 'utf8'));
  zip.addFile('MARKETING/social_media_posts.md', Buffer.from(marketingMaterials.socialMediaPosts, 'utf8'));

  // Generate marketplace listing templates
  const listingTemplates = generateListingTemplates(params, marketingMaterials);
  
  // Add listing templates to ZIP
  marketplaces.forEach(marketplace => {
    if (listingTemplates[marketplace]) {
      zip.addFile(`LISTINGS/${marketplace.toUpperCase()}_listing.md`, 
        Buffer.from(listingTemplates[marketplace], 'utf8'));
    }
  });

  // Generate ZIP buffer
  const zipBuffer = zip.toBuffer();
  const zipSize = zipBuffer.length;

  // In a real implementation, you'd upload this to cloud storage (AWS S3, Google Cloud, etc.)
  // For now, we'll generate a mock download URL
  const downloadUrl = `/api/bundles/download/${bundleId}`;

  // Store ZIP in temporary storage (implement your preferred storage solution)
  // await storeZipFile(bundleId, zipBuffer);

  return {
    bundleId,
    downloadUrl,
    zipSize,
    marketingMaterials,
    listingTemplates
  };
}

/**
 * Generate comprehensive product information
 */
function generateProductInfo(product: any, index: number): string {
  return `# Product ${index}: ${product.name}

## Overview
**Type:** ${product.type}
**Price:** $${product.price}

## Description
${product.content || 'No description provided'}

## Usage Instructions
1. Download and extract all files
2. Review the included documentation
3. Follow any setup instructions specific to this product type
4. Contact support if you need assistance

## License
This product is licensed for personal and commercial use.
Please see the main LICENSE.txt file for full terms.

## Support
For support with this product, please contact:
- Email: support@omnipreneur.com
- Website: https://omnipreneur.com/support

---
Generated by Omnipreneur Bundle Builder™
`;
}

/**
 * Generate bundle README file
 */
function generateBundleReadme(name: string, description: string = '', products: any[], pricing: any): string {
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);
  const savings = totalValue - pricing.bundle;
  
  return `# ${name}

${description}

## Bundle Contents
${products.map((product, index) => 
  `${index + 1}. **${product.name}** - $${product.price} (${product.type})`
).join('\n')}

## Pricing
- **Individual Total:** $${totalValue}
- **Bundle Price:** $${pricing.bundle}
- **You Save:** $${savings} (${Math.round((savings / totalValue) * 100)}% off!)

## Quick Start Guide
1. Extract all files from this bundle
2. Review each product folder for specific instructions
3. Check the MARKETING folder for promotional materials
4. Use the LISTINGS folder for marketplace templates

## What's Included
- ${products.length} premium digital products
- Complete marketing materials
- Marketplace listing templates
- Commercial use license
- Lifetime updates

## Support & Resources
- **Documentation:** Check individual product folders
- **Support:** support@omnipreneur.com
- **Updates:** Watch for email notifications
- **Community:** Join our Discord server

## License
All products in this bundle are licensed for both personal and commercial use.
See LICENSE.txt for complete terms and conditions.

---
**Created with Omnipreneur Bundle Builder™**
*Transform your digital products into profitable bundles*

Visit us at: https://omnipreneur.com
`;
}

/**
 * Generate license file
 */
function generateLicenseFile(bundleName: string): string {
  return `DIGITAL PRODUCT BUNDLE LICENSE

Bundle: ${bundleName}
Generated: ${new Date().toLocaleDateString()}

PERMITTED USES:
✓ Personal use
✓ Commercial use
✓ Modification and customization
✓ Resale with attribution
✓ Distribution to clients

RESTRICTIONS:
✗ Claiming original authorship
✗ Redistribution as standalone products without modification
✗ Reverse engineering for competitive purposes

WARRANTY DISCLAIMER:
These digital products are provided "as is" without warranty of any kind.
The authors disclaim all warranties, express or implied.

For questions about licensing, contact: legal@omnipreneur.com

© ${new Date().getFullYear()} Omnipreneur AI Suite. All rights reserved.
`;
}

/**
 * Generate comprehensive marketing materials
 */
function generateMarketingMaterials(params: any) {
  const { name, description, products, pricing, category, targetAudience } = params;
  const totalValue = products.reduce((sum: number, product: any) => sum + product.price, 0);
  const savings = totalValue - pricing.bundle;
  const discountPercent = Math.round((savings / totalValue) * 100);

  const productDescription = `# ${name} - Complete Digital Bundle

${description || 'Premium digital product bundle designed for modern entrepreneurs and creators.'}

## What You Get
${products.map((product: any, index: number) => 
  `**${index + 1}. ${product.name}** (Worth $${product.price})
${product.content ? product.content.substring(0, 150) + '...' : 'Premium digital product included'}`
).join('\n\n')}

## Bundle Value
- **Total Individual Value:** $${totalValue}
- **Bundle Price:** $${pricing.bundle}
- **Your Savings:** $${savings} (${discountPercent}% OFF!)

Perfect for ${targetAudience || 'entrepreneurs, creators, and business owners'} looking to ${category === 'productivity' ? 'boost productivity' : category === 'marketing' ? 'enhance marketing efforts' : 'grow their business'}.
`;

  const salesCopy = `🚀 EXCLUSIVE BUNDLE ALERT: ${name}

${discountPercent}% OFF - Limited Time Only!

Are you tired of paying full price for individual products? 

This carefully curated bundle gives you EVERYTHING you need for just $${pricing.bundle} (originally $${totalValue}).

✅ ${products.length} Premium Products
✅ Commercial Use License  
✅ Lifetime Access
✅ Instant Download
✅ Money-Back Guarantee

WHAT'S INSIDE:
${products.map((product: any, index: number) => `${index + 1}. ${product.name} ($${product.price} value)`).join('\n')}

🔥 BONUS: Free marketing templates and promotional materials included!

⏰ This deal won't last forever. Get instant access now and start seeing results today!

[DOWNLOAD NOW - $${pricing.bundle}] ← Click here before this offer expires!

Questions? Contact us at support@omnipreneur.com
`;

  const emailCampaign = `Subject: 🎉 Your ${name} Bundle is Ready for Download!

Hi [NAME],

Congratulations on your purchase of the ${name} bundle!

Your download is ready and waiting for you. Here's what you just got:

${products.map((product: any, index: number) => `✓ ${product.name} (Value: $${product.price})`).join('\n')}

TOTAL VALUE: $${totalValue}
YOU PAID: $${pricing.bundle}
YOU SAVED: $${savings} (${discountPercent}% off!)

🎯 QUICK START:
1. Download your bundle using the link below
2. Extract all files to your computer
3. Read the README.md file first
4. Start with Product #1 and work your way through

[DOWNLOAD YOUR BUNDLE HERE]

🎁 BONUS MATERIALS INCLUDED:
- Marketing templates
- Marketplace listings
- Commercial use license
- Step-by-step guides

Need help? Just reply to this email or visit our support center.

To your success,
The Omnipreneur Team

P.S. Keep an eye out for exclusive member-only deals coming your way!
`;

  const socialMediaPosts = `# Social Media Promotion Templates

## Facebook/LinkedIn Post:
🚀 Just launched my new ${name} bundle! 

${products.length} premium products for the price of one. Perfect for anyone in ${category}.

Get ${discountPercent}% off the individual prices - that's a $${savings} savings!

[Link to bundle] #DigitalProducts #${category.charAt(0).toUpperCase() + category.slice(1)} #Entrepreneur

## Twitter/X Post:
🔥 New bundle alert: ${name}

${products.length} products → 1 low price
$${totalValue} value → Just $${pricing.bundle}
${discountPercent}% savings 💰

Perfect for ${targetAudience || 'creators'} 
[Link] #DigitalBundle

## Instagram Caption:
✨ Introducing the ${name} Bundle ✨

Swipe to see what's inside ➡️

🎯 ${products.length} premium products
💰 ${discountPercent}% off individual prices  
📱 Instant download
🔥 Commercial license included

Link in bio to grab yours!

#DigitalProducts #${category} #BundleDeal #Entrepreneur #ProductLaunch

## Pinterest Description:
${name} - Complete Digital Bundle | Save ${discountPercent}% on ${products.length} Premium Products

Get everything you need for ${category} success in one affordable bundle. Includes commercial license and bonus materials. Perfect for entrepreneurs and creators.
`;

  return {
    productDescription,
    salesCopy,
    emailCampaign,
    socialMediaPosts
  };
}

/**
 * Generate marketplace-specific listing templates
 */
function generateListingTemplates(params: any, marketingMaterials: any) {
  const { name, products, pricing, category } = params;
  const templates: { [key: string]: string } = {};

  // Gumroad listing
  templates['gumroad'] = `GUMROAD LISTING TEMPLATE

Title: ${name} - Complete Digital Bundle (${products.length} Products)

Short Description:
Get ${products.length} premium ${category} products for one low price. Save ${Math.round(((products.reduce((sum: number, p: any) => sum + p.price, 0) - pricing.bundle) / products.reduce((sum: number, p: any) => sum + p.price, 0)) * 100)}% when you buy as a bundle!

Full Description:
${marketingMaterials.productDescription}

Tags: digital bundle, ${category}, entrepreneur, business tools, instant download

Price: $${pricing.bundle}

Category: Design & Tech > Software

Content Rating: Everyone

Suggested Keywords: ${category}, digital products, bundle deal, business tools
`;

  // Etsy listing
  templates['etsy'] = `ETSY LISTING TEMPLATE

Title: ${name} | Digital Bundle | ${products.length} ${category.charAt(0).toUpperCase() + category.slice(1)} Products | Instant Download

Category: Craft Supplies & Tools > Digital Materials

Tags (13 max):
- digital download
- ${category} bundle
- business tools
- instant download
- commercial use
- ${category} products
- digital bundle
- entrepreneur
- printable
- templates
- business
- productivity
- digital files

Description:
🎉 INSTANT DOWNLOAD - No waiting!

${marketingMaterials.salesCopy}

📝 WHAT YOU GET:
${products.map((product: any, index: number) => `• ${product.name}`).join('\n')}

💼 COMMERCIAL USE LICENSE INCLUDED

🎯 PERFECT FOR:
${category === 'productivity' ? 'Busy professionals, entrepreneurs, students' : 
  category === 'marketing' ? 'Business owners, marketers, content creators' : 
  'Entrepreneurs, small business owners, freelancers'}

⚡ INSTANT ACCESS - Files delivered immediately after purchase

Price: $${pricing.bundle}

Processing Time: Instant Download (Digital Product)

Shipping: Not applicable (Digital Download)
`;

  return templates;
}

/**
 * Sanitize filename for ZIP creation
 */
function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

async function generateAIMarketing({ name, description, products, pricing, category, targetAudience }: any) {
  const sys = 'You are a direct-response copywriter. Respond ONLY with compact JSON keys: productDescription, salesCopy, emailCampaign, socialMediaPosts.';
  const user = `Create compelling marketing materials for bundle ${name} in category ${category} targeting ${targetAudience || 'general'}.
Bundle price: $${pricing?.bundle}. Total value: $${products.reduce((s: number, p: any) => s + (p.price || 0), 0)}.
Keep it concise and conversion-oriented.`;
  try {
    const openaiRes = await chatComplete({ system: sys, user, temperature: 0.6, maxTokens: 800 });
    const parsed = JSON.parse(openaiRes || '{}');
    if (parsed.productDescription && parsed.salesCopy) return parsed;
  } catch (_) {}
  try {
    const claudeRes = await completeClaude({ prompt: `${sys}\n\n${user}`, temperature: 0.6, maxTokens: 900 });
    const parsed = JSON.parse(claudeRes || '{}');
    if (parsed.productDescription && parsed.salesCopy) return parsed;
  } catch (_) {}
  return {};
}