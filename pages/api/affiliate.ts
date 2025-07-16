import { NextApiRequest, NextApiResponse } from 'next';
import { auth, checkUsageLimit, updateUsage } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(req);
    if (!rateLimitResult.success) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Authentication
    const user = await auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      action,
      productUrl,
      campaignName,
      commissionRate = 20,
      materials = []
    } = req.body;

    if (!action || !productUrl) {
      return res.status(400).json({ error: 'Action and product URL are required' });
    }

    // Check usage limits
    const canGenerate = await checkUsageLimit(user, 'affiliateLinks');
    if (!canGenerate) {
      return res.status(403).json({ 
        error: 'Usage limit exceeded',
        limit: 'affiliateLinks',
        current: user.usage.affiliateLinks
      });
    }

    let result;

    switch (action) {
      case 'generate_link':
        result = await generateAffiliateLink({
          userId: user.id,
          productUrl,
          campaignName,
          commissionRate
        });
        break;

      case 'generate_materials':
        result = await generateMarketingMaterials({
          productUrl,
          campaignName,
          commissionRate,
          materials
        });
        break;

      case 'track_click':
        result = await trackAffiliateClick({
          userId: user.id,
          linkId: req.body.linkId,
          referrer: req.body.referrer
        });
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Update usage
    await updateUsage(user.id, 'affiliateLinks');

    // Analytics tracking
    await trackEvent({
      userId: user.id,
      event: `affiliate_${action}`,
      metadata: {
        action,
        productUrl,
        commissionRate,
        materialsCount: materials.length
      }
    });

    return res.status(200).json({
      success: true,
      result,
      metadata: {
        action,
        generated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Affiliate API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process affiliate request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

interface AffiliateLinkParams {
  userId: string;
  productUrl: string;
  campaignName?: string;
  commissionRate: number;
}

async function generateAffiliateLink(params: AffiliateLinkParams) {
  const { userId, productUrl, campaignName, commissionRate } = params;

  // Generate unique affiliate link
  const linkId = generateLinkId();
  const affiliateUrl = `${productUrl}?ref=${linkId}&campaign=${campaignName || 'default'}`;

  // Use Claude to optimize the affiliate link
  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: `You are an affiliate marketing specialist.

Analyze the product URL and create:
1. Optimized affiliate link with tracking parameters
2. UTM parameters for analytics
3. Link variations for different platforms
4. Click-through rate optimization suggestions`
        },
        {
          role: 'user',
          content: `Product URL: ${productUrl}
Campaign: ${campaignName || 'Default Campaign'}
Commission Rate: ${commissionRate}%

Create optimized affiliate link and tracking setup.`
        }
      ]
    })
  });

  if (!claudeResponse.ok) {
    throw new Error('Claude API request failed');
  }

  const claudeData = await claudeResponse.json();
  const optimizationData = claudeData.content[0].text;

  // Save affiliate link to database
  await saveAffiliateLink({
    userId,
    linkId,
    originalUrl: productUrl,
    affiliateUrl,
    campaignName,
    commissionRate,
    optimizationData,
    timestamp: new Date()
  });

  return {
    linkId,
    originalUrl: productUrl,
    affiliateUrl,
    campaignName,
    commissionRate,
    optimization: optimizationData,
    trackingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/affiliate/track?link=${linkId}`
  };
}

interface MarketingMaterialsParams {
  productUrl: string;
  campaignName?: string;
  commissionRate: number;
  materials: string[];
}

async function generateMarketingMaterials(params: MarketingMaterialsParams) {
  const { productUrl, campaignName, commissionRate, materials } = params;

  // Use GPT-4 to generate marketing materials
  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      max_tokens: 3000,
      temperature: 0.8,
      messages: [
        {
          role: 'system',
          content: `You are a conversion copywriter specializing in affiliate marketing.

Generate high-converting marketing materials for affiliate products:
- Social media posts (Instagram, Twitter, LinkedIn, Facebook)
- Email sequences
- Banner ad copy
- Video scripts
- Blog post templates
- Influencer outreach templates

Focus on value proposition, social proof, and clear CTAs.`
        },
        {
          role: 'user',
          content: `Product URL: ${productUrl}
Campaign: ${campaignName || 'Affiliate Campaign'}
Commission: ${commissionRate}%
Materials needed: ${materials.join(', ')}

Create compelling marketing materials that drive clicks and conversions.`
        }
      ]
    })
  });

  if (!gptResponse.ok) {
    throw new Error('GPT-4 API request failed');
  }

  const gptData = await gptResponse.json();
  const marketingMaterials = gptData.choices[0].message.content;

  return {
    materials: parseMarketingMaterials(marketingMaterials),
    campaignName,
    commissionRate
  };
}

interface ClickTrackingParams {
  userId: string;
  linkId: string;
  referrer?: string;
}

async function trackAffiliateClick(params: ClickTrackingParams) {
  const { userId, linkId, referrer } = params;

  // Save click tracking data
  await saveClickTracking({
    userId,
    linkId,
    referrer,
    timestamp: new Date(),
    ip: 'tracked_ip', // In production, extract from request
    userAgent: 'tracked_ua' // In production, extract from request
  });

  return {
    success: true,
    linkId,
    tracked: new Date().toISOString()
  };
}

function generateLinkId(): string {
  return `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function parseMarketingMaterials(materials: string) {
  const sections = materials.split('\n\n');
  const parsed: any = {
    socialPosts: [],
    emailSequences: [],
    adCopy: [],
    videoScripts: [],
    blogTemplates: [],
    influencerOutreach: []
  };

  sections.forEach(section => {
    if (section.includes('Social') || section.includes('Instagram') || section.includes('Twitter')) {
      parsed.socialPosts.push(section);
    } else if (section.includes('Email')) {
      parsed.emailSequences.push(section);
    } else if (section.includes('Ad') || section.includes('Banner')) {
      parsed.adCopy.push(section);
    } else if (section.includes('Video') || section.includes('Script')) {
      parsed.videoScripts.push(section);
    } else if (section.includes('Blog') || section.includes('Post')) {
      parsed.blogTemplates.push(section);
    } else if (section.includes('Influencer') || section.includes('Outreach')) {
      parsed.influencerOutreach.push(section);
    }
  });

  return parsed;
}

async function saveAffiliateLink(data: any) {
  // Database integration - placeholder for now
  // Logging removed for production
}

async function saveClickTracking(data: any) {
  // Database integration - placeholder for now
  // Logging removed for production
}

async function trackEvent(data: any) {
  // Analytics integration - placeholder for now
  // Event tracking removed for production
} 