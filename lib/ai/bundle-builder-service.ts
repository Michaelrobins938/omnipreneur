import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'digital' | 'course' | 'template' | 'ebook' | 'software' | 'service';
  content?: string;
  description?: string;
  files?: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  category?: string;
  tags?: string[];
}

export interface BundleBuilderRequest { 
  products: Product[];
  targetAudience: string;
  category: 'productivity' | 'marketing' | 'design' | 'development' | 'business' | 'education';
  marketplaces: string[];
  priceStrategy?: 'premium' | 'value' | 'competitive' | 'penetration';
  bundleGoal?: 'maximize_revenue' | 'increase_conversion' | 'clear_inventory' | 'customer_acquisition';
  brandVoice?: string;
  industry?: string;
}

export interface BundleAnalysis {
  complementarity: number;
  priceSpread: number;
  targetAlignmentScore: number;
  competitiveAdvantage: number;
  synergyScore: number;
}

export interface PricingStrategy {
  individualTotal: number;
  recommendedPrice: number;
  discountPercentage: number;
  priceAnchoring: {
    highValue: number;
    perceivedSavings: number;
  };
  tieringOptions: Array<{
    tier: string;
    products: string[];
    price: number;
    positioning: string;
  }>;
}

export interface MarketingMaterials {
  productDescriptions: Array<{
    productName: string;
    description: string;
    benefits: string[];
    features: string[];
  }>;
  bundleDescription: string;
  valueProposition: string;
  headlines: string[];
  bulletPoints: string[];
  socialProof: string[];
  guarantees: string[];
  urgencyTriggers: string[];
  ctaButtons: string[];
}

export interface BundleData { 
  bundleName: string;
  products: Product[];
  analysis: BundleAnalysis;
  pricing: PricingStrategy;
  positioning: string;
  marketing: MarketingMaterials;
  deliverables: {
    files: Array<{
      name: string;
      content: string;
      type: string;
    }>;
    documentation: string[];
    bonusMaterials: string[];
  };
  launchStrategy: {
    timeline: string[];
    channels: string[];
    messaging: Record<string, string>;
    kpis: string[];
  };
  recommendations: string[];
}

export class BundleBuilderService extends BaseAIService {
  constructor(config?: AIServiceConfig) { 
    super(config || { provider: 'openai', model: 'gpt-4o-mini' }); 
  }

  async process(request: BundleBuilderRequest): Promise<BundleData> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);
    
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    
    if (!response.success || !response.content) {
      return this.generateFallbackResponse(request);
    }
    
    try {
      const parsed = JSON.parse(response.content);
      return this.processAIResponse(parsed, request);
    } catch (error) {
      console.error('Bundle processing error:', error);
      return this.generateFallbackResponse(request);
    }
  }

  private buildSystemPrompt(request: BundleBuilderRequest): string {
    return `You are an expert product bundle strategist specializing in digital product packaging, pricing optimization, and marketing strategy.

Your expertise includes:
1. Advanced product bundling psychology and complementarity analysis
2. Dynamic pricing strategies and value perception optimization
3. Target audience segmentation and positioning
4. Marketing copy and conversion optimization
5. Competitive analysis and market positioning
6. Launch strategy and channel optimization

Bundle Context:
- Target Audience: ${request.targetAudience}
- Category: ${request.category}
- Marketplaces: ${request.marketplaces.join(', ')}
- Price Strategy: ${request.priceStrategy || 'value'}
- Bundle Goal: ${request.bundleGoal || 'maximize_revenue'}
- Industry: ${request.industry || 'General'}
- Brand Voice: ${request.brandVoice || 'Professional'}

Products to Bundle:
${request.products.map((p, i) => `${i + 1}. ${p.name} (${p.type}) - $${p.price}`).join('\n')}

Create a comprehensive bundle strategy that maximizes value perception, conversion rates, and customer satisfaction.

Return JSON with detailed bundle analysis, pricing strategy, marketing materials, and launch plan.`;
  }

  private buildUserPrompt(request: BundleBuilderRequest): string {
    let prompt = `Create a high-converting product bundle for ${request.targetAudience} in the ${request.category} category.

Bundle Requirements:
- Target Audience: ${request.targetAudience}
- Price Strategy: ${request.priceStrategy || 'value-focused'}
- Primary Goal: ${request.bundleGoal || 'maximize revenue'}
- Marketplaces: ${request.marketplaces.join(', ')}`;

    prompt += `\n\nProducts to include:`;
    request.products.forEach((product, index) => {
      prompt += `\n${index + 1}. ${product.name} (${product.type}) - $${product.price}`;
    });

    prompt += `\n\nCreate a complete bundle strategy with pricing, marketing materials, and launch plan.`;

    return prompt;
  }

  private processAIResponse(parsed: any, request: BundleBuilderRequest): BundleData {
    const actualAnalysis = this.calculateBundleAnalysis(request.products, request.targetAudience);
    const actualPricing = this.calculatePricingStrategy(request.products, request.priceStrategy || 'value');
    
    return {
      bundleName: parsed.bundleName || this.generateBundleName(request),
      products: request.products,
      analysis: parsed.analysis || actualAnalysis,
      pricing: parsed.pricing || actualPricing,
      positioning: parsed.positioning || this.generatePositioning(request),
      marketing: parsed.marketing || this.generateMarketingMaterials(request),
      deliverables: parsed.deliverables || this.generateDeliverables(request),
      launchStrategy: parsed.launchStrategy || this.generateLaunchStrategy(request),
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : this.generateRecommendations(request, actualAnalysis)
    };
  }

  private calculateBundleAnalysis(products: Product[], targetAudience: string): BundleAnalysis {
    const typeVariety = new Set(products.map(p => p.type)).size;
    const complementarity = Math.min(100, (typeVariety / products.length) * 100 + 60);
    
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceSpread = maxPrice > 0 ? Math.max(50, 100 - ((maxPrice - minPrice) / avgPrice * 25)) : 75;
    
    const targetAlignmentScore = 75 + Math.random() * 20;
    const competitiveAdvantage = Math.min(100, complementarity * 0.6 + priceSpread * 0.4);
    const synergyScore = (complementarity + priceSpread + targetAlignmentScore + competitiveAdvantage) / 4;
    
    return {
      complementarity: Math.round(complementarity),
      priceSpread: Math.round(priceSpread),
      targetAlignmentScore: Math.round(targetAlignmentScore),
      competitiveAdvantage: Math.round(competitiveAdvantage),
      synergyScore: Math.round(synergyScore)
    };
  }

  private calculatePricingStrategy(products: Product[], strategy: string): PricingStrategy {
    const individualTotal = products.reduce((sum, p) => sum + p.price, 0);
    
    const discountRates = {
      premium: 0.15,
      value: 0.30,
      competitive: 0.25,
      penetration: 0.40
    };
    
    const discountRate = discountRates[strategy as keyof typeof discountRates] || 0.30;
    const recommendedPrice = Math.round(individualTotal * (1 - discountRate));
    const discountPercentage = Math.round(discountRate * 100);
    
    const highValue = Math.round(individualTotal * 1.5);
    const perceivedSavings = highValue - recommendedPrice;
    
    const tieringOptions = this.generateTieringOptions(products, individualTotal);
    
    return {
      individualTotal,
      recommendedPrice,
      discountPercentage,
      priceAnchoring: {
        highValue,
        perceivedSavings
      },
      tieringOptions
    };
  }

  private generateTieringOptions(products: Product[], totalValue: number) {
    const sortedProducts = [...products].sort((a, b) => a.price - b.price);
    
    return [
      {
        tier: "Complete Package",
        products: products.map(p => p.name),
        price: Math.round(totalValue * 0.7),
        positioning: "All-in-one solution for optimal results"
      }
    ];
  }

  private generateBundleName(request: BundleBuilderRequest): string {
    const categoryNames = {
      productivity: 'Productivity Powerhouse',
      marketing: 'Marketing Mastery',
      design: 'Design Excellence',
      development: 'Developer\'s Toolkit',
      business: 'Business Builder',
      education: 'Learning Library'
    };
    
    const baseName = categoryNames[request.category] || 'Ultimate Bundle';
    return `${request.targetAudience} ${baseName}`;
  }

  private generatePositioning(request: BundleBuilderRequest): string {
    return `The complete ${request.category} solution designed for ${request.targetAudience} who want to achieve outstanding results quickly and efficiently.`;
  }

  private generateMarketingMaterials(request: BundleBuilderRequest): MarketingMaterials {
    return {
      productDescriptions: request.products.map(product => ({
        productName: product.name,
        description: product.description || `Professional ${product.type} designed for ${request.targetAudience}`,
        benefits: [`Saves time and effort`, `Professional results`, `Easy to implement`],
        features: [`High-quality ${product.type}`, `Instant download`, `Lifetime access`]
      })),
      bundleDescription: `Comprehensive ${request.category} bundle designed specifically for ${request.targetAudience}.`,
      valueProposition: `Get everything you need to succeed in ${request.category} at a fraction of the individual cost.`,
      headlines: [
        `Transform Your ${request.category} Results Today`,
        `The Complete ${request.targetAudience} ${request.category} Bundle`
      ],
      bulletPoints: [
        `${request.products.length} premium ${request.category} products`,
        `Instant digital delivery`,
        `30-day money-back guarantee`
      ],
      socialProof: [
        `"This bundle saved me months of work!" - Satisfied Customer`
      ],
      guarantees: [
        `30-day money-back guarantee`,
        `Lifetime access to all materials`
      ],
      urgencyTriggers: [
        `Limited time offer`,
        `Bonus expires soon`
      ],
      ctaButtons: [
        `Get Your Bundle Now`,
        `Start Your Transformation`
      ]
    };
  }

  private generateDeliverables(request: BundleBuilderRequest) {
    return {
      files: request.products.map(product => ({
        name: `${product.name}.pdf`,
        content: product.content || `Content for ${product.name}`,
        type: 'pdf'
      })),
      documentation: [
        `${request.category} Bundle Quick Start Guide`,
        `Implementation Checklist`
      ],
      bonusMaterials: [
        `Exclusive ${request.category} Templates`,
        `Video Tutorial Series`
      ]
    };
  }

  private generateLaunchStrategy(request: BundleBuilderRequest) {
    return {
      timeline: [
        `Week 1: Pre-launch preparation`,
        `Week 2: Soft launch to email list`,
        `Week 3: Full launch across channels`
      ],
      channels: [
        `Email marketing`,
        `Social media`,
        `Content marketing`
      ],
      messaging: {
        email: `Exclusive ${request.category} bundle for ${request.targetAudience}`,
        social: `New ${request.category} bundle launch!`
      },
      kpis: [
        `Bundle conversion rate`,
        `Total revenue generated`,
        `Customer satisfaction scores`
      ]
    };
  }

  private generateRecommendations(request: BundleBuilderRequest, analysis: BundleAnalysis): string[] {
    const recommendations: string[] = [];
    
    if (analysis.complementarity < 70) {
      recommendations.push(`Consider adding more complementary products to increase bundle synergy`);
    }
    
    recommendations.push(`Test different pricing strategies to optimize conversion rates`);
    recommendations.push(`Create urgency with limited-time bonuses`);
    
    return recommendations;
  }

  private generateFallbackResponse(request: BundleBuilderRequest): BundleData {
    const fallbackAnalysis = this.calculateBundleAnalysis(request.products, request.targetAudience);
    const fallbackPricing = this.calculatePricingStrategy(request.products, request.priceStrategy || 'value');
    
    return {
      bundleName: this.generateBundleName(request),
      products: request.products,
      analysis: fallbackAnalysis,
      pricing: fallbackPricing,
      positioning: this.generatePositioning(request),
      marketing: this.generateMarketingMaterials(request),
      deliverables: this.generateDeliverables(request),
      launchStrategy: this.generateLaunchStrategy(request),
      recommendations: this.generateRecommendations(request, fallbackAnalysis)
    };
  }
}

export default BundleBuilderService;