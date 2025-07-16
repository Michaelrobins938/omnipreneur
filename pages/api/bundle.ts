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
      name, 
      price, 
      bundleType, 
      targetAudience,
      description,
      products = [],
      pricingStrategy = 'value_based'
    } = req.body;

    if (!name || !price || !bundleType || !targetAudience) {
      return res.status(400).json({ error: 'Name, price, bundle type, and target audience are required' });
    }

    // Check usage limits
    const canGenerate = await checkUsageLimit(user, 'bundles');
    if (!canGenerate) {
      return res.status(403).json({ 
        error: 'Usage limit exceeded',
        limit: 'bundles',
        current: user.usage.bundles
      });
    }

    // Generate bundle with AI optimization
    const bundle = await generateBundle({
      name,
      price: parseFloat(price),
      bundleType,
      targetAudience,
      description,
      products,
      pricingStrategy
    });

    // Save to database
    await saveBundle({
      userId: user.id,
      bundle,
      timestamp: new Date()
    });

    // Update usage
    await updateUsage(user.id, 'bundles');

    // Analytics tracking
    await trackEvent({
      userId: user.id,
      event: 'bundle_creation',
      metadata: {
        bundleType,
        price: parseFloat(price),
        targetAudience,
        productsCount: products.length
      }
    });

    return res.status(200).json({
      success: true,
      bundle,
      metadata: {
        generated: new Date().toISOString(),
        bundleType,
        targetAudience,
        pricingStrategy
      }
    });

  } catch (error) {
    console.error('Bundle API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate bundle',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

interface BundleGenerationParams {
  name: string;
  price: number;
  bundleType: 'course' | 'template' | 'toolkit' | 'masterclass' | 'software';
  targetAudience: string;
  description?: string;
  products: string[];
  pricingStrategy: 'value_based' | 'competitor_based' | 'premium_positioning';
}

async function generateBundle(params: BundleGenerationParams) {
  const { name, price, bundleType, targetAudience, description, products, pricingStrategy } = params;

  // Use Claude for bundle optimization
  const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: `You are a high-ticket product strategist specializing in digital product bundles.

TASK: Create a premium ${bundleType} bundle for ${targetAudience} at $${price} price point.

REQUIREMENTS:
- Optimize pricing strategy: ${pricingStrategy}
- Create compelling value proposition
- Generate sales copy and marketing materials
- Design bundle structure and contents
- Include upsell opportunities
- Maximize perceived value

OUTPUT FORMAT:
{
  "bundle": {
    "name": "Optimized bundle name",
    "price": ${price},
    "originalPrice": "Higher original price for perceived value",
    "description": "Compelling description",
    "valueProposition": "Clear value statement",
    "contents": ["Item 1", "Item 2", "Item 3"],
    "bonuses": ["Bonus 1", "Bonus 2"],
    "guarantee": "Risk-free guarantee",
    "urgency": "Limited time offer"
  },
  "salesCopy": {
    "headline": "Main headline",
    "subheadline": "Supporting headline",
    "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "features": ["Feature 1", "Feature 2", "Feature 3"],
    "testimonials": ["Testimonial 1", "Testimonial 2"],
    "cta": "Call to action"
  },
  "pricing": {
    "strategy": "${pricingStrategy}",
    "valueMultiplier": "Perceived value multiplier",
    "paymentOptions": ["Full payment", "Payment plan"],
    "upsells": ["Upsell 1", "Upsell 2"]
  }
}`
        },
        {
          role: 'user',
          content: `Create a ${bundleType} bundle called "${name}" for ${targetAudience} at $${price}.

Description: ${description || 'High-value digital products for maximum results'}

Products: ${products.join(', ')}

Use ${pricingStrategy} pricing strategy to maximize conversions and perceived value.`
        }
      ]
    })
  });

  if (!claudeResponse.ok) {
    throw new Error('Claude API request failed');
  }

  const claudeData = await claudeResponse.json();
  const bundleData = JSON.parse(claudeData.content[0].text);

  // Generate additional marketing materials with GPT-4
  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are a conversion copywriter specializing in high-ticket digital products.

Create additional marketing materials for the bundle:
- Email sequences
- Social media posts
- Ad copy variations
- FAQ section
- Risk reversal copy`
        },
        {
          role: 'user',
          content: `Bundle: ${JSON.stringify(bundleData)}

Create additional marketing materials to maximize conversions.`
        }
      ]
    })
  });

  if (gptResponse.ok) {
    const gptData = await gptResponse.json();
    const additionalMaterials = gptData.choices[0].message.content;
    
    return {
      ...bundleData,
      additionalMaterials: parseAdditionalMaterials(additionalMaterials)
    };
  }

  return bundleData;
}

function parseAdditionalMaterials(materials: string) {
  // Parse the additional marketing materials
  const sections = materials.split('\n\n');
  const parsed: {
    emailSequences: string[];
    socialPosts: string[];
    adCopy: string[];
    faq: string[];
    riskReversal: string;
  } = {
    emailSequences: [],
    socialPosts: [],
    adCopy: [],
    faq: [],
    riskReversal: ''
  };

  sections.forEach(section => {
    if (section.includes('Email')) {
      parsed.emailSequences.push(section);
    } else if (section.includes('Social')) {
      parsed.socialPosts.push(section);
    } else if (section.includes('Ad')) {
      parsed.adCopy.push(section);
    } else if (section.includes('FAQ')) {
      parsed.faq.push(section);
    } else if (section.includes('Risk')) {
      parsed.riskReversal = section;
    }
  });

  return parsed;
}

async function saveBundle(data: any) {
  // Database integration - placeholder for now
      // Logging removed for production
}

async function trackEvent(data: any) {
  // Event tracking removed for production
} 