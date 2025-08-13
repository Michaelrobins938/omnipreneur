/**
 * AI Prompt Optimizer
 * 
 * Based on testing results from Week 1 & 2, these optimized prompts
 * provide better accuracy, consistency, and performance for each AI service.
 */

export interface PromptTemplate {
  system: string;
  user: string;
  constraints: string[];
  examples?: Array<{
    input: any;
    output: any;
  }>;
  outputFormat: string;
  fallbackInstructions: string;
}

export class PromptOptimizer {
  
  /**
   * Optimized Content Generation Prompts
   */
  static getContentGenerationPrompt(
    contentType: string,
    platform: string,
    niche: string,
    tone: string,
    targetAudience: string
  ): PromptTemplate {
    
    const platformConstraints = {
      twitter: "Stay under 280 characters. Use 1-2 hashtags maximum. Create urgency.",
      linkedin: "Professional tone. 1-3 paragraphs. Use industry keywords. Include CTA.",
      instagram: "Visual-focused. Use 5-10 hashtags. Emoji friendly. Tell a story.",
      facebook: "Conversational. Encourage engagement. Ask questions. Use emotions.",
      tiktok: "Trendy language. Hook in first 3 seconds. Use trending sounds/hashtags.",
      youtube: "Attention-grabbing title. SEO optimized. Include timestamps if relevant.",
      general: "Adaptable format. Clear structure. Platform-agnostic content."
    };

    const toneGuidelines = {
      professional: "Authoritative, knowledgeable, industry-appropriate language",
      casual: "Friendly, conversational, relatable, approachable tone",
      humorous: "Light-hearted, witty, entertaining while staying on-topic",
      inspirational: "Motivational, uplifting, encouraging, aspirational language",
      urgent: "Time-sensitive, action-oriented, compelling, direct language",
      friendly: "Warm, welcoming, supportive, personable communication"
    };

    return {
      system: `You are a world-class content strategist and viral marketing expert specializing in ${platform} content for ${niche}.

Your expertise includes:
- Platform algorithm optimization and trending content patterns
- Viral content psychology and engagement triggers
- Audience-specific messaging for ${targetAudience}
- ${toneGuidelines[tone as keyof typeof toneGuidelines]}
- SEO optimization and keyword integration
- Call-to-action optimization for maximum conversions

Platform-Specific Requirements for ${platform}:
${platformConstraints[platform as keyof typeof platformConstraints]}

Content Type Focus: ${contentType}
Target Audience: ${targetAudience}
Niche: ${niche}
Tone: ${tone}`,

      user: `Create high-performing ${contentType} content for ${platform} in the ${niche} niche.

Requirements:
- Target audience: ${targetAudience}
- Tone: ${tone}
- Platform: ${platform}
- Optimize for viral potential and engagement
- Include platform-specific hashtags and optimization tips
- Generate compelling hooks and clear CTAs
- Ensure content aligns with current platform algorithms`,

      constraints: [
        `Follow ${platform} best practices and character limits`,
        `Use ${tone} tone consistently throughout`,
        `Target specifically ${targetAudience} demographics`,
        `Include relevant hashtags for ${platform}`,
        `Optimize for ${platform} algorithm preferences`,
        `Include measurable engagement triggers`,
        `Provide clear value proposition`,
        `Include actionable next steps`
      ],

      outputFormat: `Return JSON with this exact structure:
{
  "content": [
    {
      "text": "Main content text",
      "hashtags": ["#relevant", "#hashtags"],
      "engagementScore": 0.85,
      "viralScore": 0.78,
      "hook": "Attention-grabbing opening",
      "callToAction": "Clear next step",
      "seoKeywords": ["keyword1", "keyword2"],
      "platformOptimizations": {
        "characterCount": "${platform} specific guidance",
        "bestTimeToPost": "Optimal posting time",
        "algorithmTips": "Platform algorithm advice"
      }
    }
  ],
  "metrics": {
    "totalGenerated": 5,
    "avgViralScore": 0.82,
    "avgEngagementScore": 0.78,
    "platformOptimization": 0.91
  },
  "suggestions": ["Improvement suggestion 1", "Improvement suggestion 2"],
  "hashtags": ["#trending", "#${niche}"]
}`,

      fallbackInstructions: "If unable to generate optimal content, provide basic ${contentType} content with standard hashtags and general optimization tips."
    };
  }

  /**
   * Optimized Auto-Rewrite Prompts
   */
  static getAutoRewritePrompt(
    originalText: string,
    targetStyle: string,
    targetAudience: string,
    tone: string
  ): PromptTemplate {

    const styleGuidelines = {
      improve: "Enhance clarity, flow, and impact while maintaining core message",
      simplify: "Reduce complexity, use simpler words, improve readability",
      expand: "Add depth, examples, context, and comprehensive details",
      formalize: "Professional language, formal structure, business-appropriate",
      casual: "Conversational tone, informal language, approachable style",
      persuasive: "Compelling arguments, emotional appeals, strong CTAs",
      concise: "Eliminate redundancy, streamline message, maximum impact per word",
      academic: "Scholarly tone, research-backed, formal citations if relevant",
      creative: "Imaginative language, metaphors, engaging storytelling"
    };

    return {
      system: `You are an expert writing coach and content strategist specializing in text optimization and enhancement.

Your expertise includes:
- Advanced linguistic analysis and improvement techniques
- Audience-specific writing optimization for ${targetAudience}
- ${styleGuidelines[targetStyle as keyof typeof styleGuidelines]}
- Readability assessment and enhancement
- Tone analysis and adjustment to ${tone}
- Content structure and flow optimization
- Engagement and conversion optimization

Style Focus: ${targetStyle}
Target Audience: ${targetAudience}
Desired Tone: ${tone}`,

      user: `Rewrite and enhance the following text using ${targetStyle} style for ${targetAudience} audience with ${tone} tone.

Original Text: "${originalText}"

Focus on:
- ${styleGuidelines[targetStyle as keyof typeof styleGuidelines]}
- Optimize for ${targetAudience} reading level and preferences
- Maintain ${tone} tone throughout
- Improve readability and engagement
- Preserve core message and intent
- Generate meaningful alternatives and improvements`,

      constraints: [
        `Apply ${targetStyle} style consistently`,
        `Target ${targetAudience} comprehension level`,
        `Maintain ${tone} tone throughout`,
        `Preserve original meaning and intent`,
        `Improve clarity and readability`,
        `Enhance engagement and impact`,
        `Provide measurable improvements`,
        `Generate viable alternatives`
      ],

      outputFormat: `Return JSON with this exact structure:
{
  "original": "${originalText}",
  "rewrittenContent": "Enhanced version of the text",
  "changes": ["Specific improvement 1", "Specific improvement 2"],
  "analysis": {
    "originalStats": {
      "wordCount": 45,
      "sentenceCount": 3,
      "readabilityScore": 65,
      "toneAnalysis": "neutral",
      "keyPhrases": ["phrase1", "phrase2"]
    },
    "rewrittenStats": {
      "wordCount": 42,
      "sentenceCount": 3,
      "readabilityScore": 82,
      "toneAnalysis": "${tone}",
      "keyPhrases": ["improved phrase1", "enhanced phrase2"]
    },
    "improvements": {
      "clarity": 85,
      "engagement": 78,
      "conciseness": 90,
      "tone": 88,
      "overall": 85
    }
  },
  "alternatives": [
    {
      "version": "Clarity-focused",
      "focus": "Maximum readability",
      "content": "Alternative version focusing on clarity",
      "score": 89
    }
  ],
  "suggestions": ["Further improvement suggestion 1", "Enhancement tip 2"]
}`,

      fallbackInstructions: "If unable to perform optimal rewrite, provide basic text improvements with readability enhancements."
    };
  }

  /**
   * Optimized Bundle Builder Prompts
   */
  static getBundleBuilderPrompt(
    products: any[],
    targetAudience: string,
    category: string,
    priceStrategy: string
  ): PromptTemplate {

    const strategyGuidelines = {
      premium: "High-value positioning, luxury branding, exclusive benefits",
      value: "Maximum value perception, cost savings emphasis, practical benefits",
      competitive: "Market-competitive pricing, feature comparison, advantage focus",
      penetration: "Market entry pricing, accessibility focus, growth-oriented"
    };

    return {
      system: `You are a strategic product bundling expert and marketing strategist specializing in ${category} products for ${targetAudience}.

Your expertise includes:
- Advanced product complementarity analysis and synergy optimization
- ${strategyGuidelines[priceStrategy as keyof typeof strategyGuidelines]}
- Psychology-based pricing strategies and value perception
- Target audience analysis and positioning for ${targetAudience}
- Comprehensive marketing material creation and campaign development
- Launch strategy development and channel optimization
- Conversion optimization and sales psychology

Category Focus: ${category}
Target Audience: ${targetAudience}
Pricing Strategy: ${priceStrategy}
Products to Bundle: ${products.length} items`,

      user: `Create a comprehensive bundle strategy for ${products.length} ${category} products targeting ${targetAudience} using ${priceStrategy} pricing strategy.

Products to analyze:
${products.map((p, i) => `${i + 1}. ${p.name} (${p.type}) - $${p.price}`).join('\n')}

Analyze and create:
- Product complementarity and synergy scoring
- Optimized pricing strategy with psychological anchoring
- Complete marketing materials and positioning
- Launch strategy and timeline
- Performance recommendations and optimization tips`,

      constraints: [
        `Optimize for ${targetAudience} preferences and purchasing behavior`,
        `Apply ${priceStrategy} pricing methodology`,
        `Maximize product synergy and complementarity`,
        `Create compelling value propositions`,
        `Generate professional marketing materials`,
        `Provide actionable launch strategies`,
        `Include measurable success metrics`,
        `Optimize for conversion and sales`
      ],

      outputFormat: `Return JSON with this exact structure:
{
  "bundleName": "Compelling bundle name",
  "products": [...], // Original products array
  "analysis": {
    "complementarity": 85,
    "priceSpread": 78,
    "targetAlignmentScore": 91,
    "competitiveAdvantage": 82,
    "synergyScore": 84
  },
  "pricing": {
    "individualTotal": 197,
    "recommendedPrice": 138,
    "discountPercentage": 30,
    "priceAnchoring": {
      "highValue": 295,
      "perceivedSavings": 157
    },
    "tieringOptions": [...]
  },
  "marketing": {
    "bundleDescription": "Compelling description",
    "valueProposition": "Clear value prop",
    "headlines": ["Headline 1", "Headline 2"],
    "bulletPoints": ["Benefit 1", "Benefit 2"],
    "socialProof": ["Testimonial style"],
    "guarantees": ["Guarantee text"],
    "urgencyTriggers": ["Limited time offer"],
    "ctaButtons": ["Get Bundle Now"]
  },
  "launchStrategy": {
    "timeline": ["Week 1: Prep", "Week 2: Launch"],
    "channels": ["Email", "Social"],
    "messaging": {"email": "Message", "social": "Post"},
    "kpis": ["Conversion rate", "Revenue"]
  },
  "recommendations": ["Strategy tip 1", "Optimization tip 2"]
}`,

      fallbackInstructions: "If unable to generate complete strategy, provide basic bundle analysis with standard pricing and marketing recommendations."
    };
  }

  /**
   * Optimized Niche Discovery Prompts
   */
  static getNicheDiscoveryPrompt(
    keyword: string,
    platform: string,
    targetAudience: string,
    analysisDepth: string
  ): PromptTemplate {

    const platformInsights = {
      kdp: "Amazon KDP publishing platform, book market analysis, royalty optimization",
      etsy: "Handmade marketplace, craft trends, seasonal patterns, creative niches",
      amazon: "E-commerce marketplace, product demand, competitive landscape",
      shopify: "Direct-to-consumer e-commerce, brand building, customer acquisition",
      general: "Cross-platform digital market analysis, broad opportunity assessment"
    };

    const depthGuidelines = {
      quick: "Rapid market assessment with essential metrics and basic insights",
      standard: "Comprehensive analysis with detailed metrics and strategic recommendations",
      comprehensive: "Deep market intelligence with advanced analytics and predictive insights"
    };

    return {
      system: `You are a senior market research analyst and business intelligence expert specializing in ${platform} marketplace dynamics.

Your expertise includes:
- ${platformInsights[platform as keyof typeof platformInsights]}
- Advanced market opportunity assessment and competitive analysis
- Consumer behavior analysis for ${targetAudience}
- ${depthGuidelines[analysisDepth as keyof typeof depthGuidelines]}
- Trend forecasting and market prediction algorithms
- Monetization strategy development and revenue optimization
- Strategic action planning and implementation roadmaps

Platform Focus: ${platform}
Target Audience: ${targetAudience}
Analysis Depth: ${analysisDepth}
Keyword Research: ${keyword}`,

      user: `Conduct ${analysisDepth} market analysis for "${keyword}" niche on ${platform} platform targeting ${targetAudience}.

Research Requirements:
- Comprehensive demand and competition analysis
- Market size estimation and growth potential
- Competitor landscape and gap identification
- Monetization opportunities and pricing strategies
- Customer segment analysis and behavior patterns
- Strategic recommendations and action planning
- Keyword opportunities and SEO insights
- Risk assessment and market barriers`,

      constraints: [
        `Focus on ${platform} platform specifics and requirements`,
        `Target ${targetAudience} market segment analysis`,
        `Provide ${analysisDepth} level of detail and insights`,
        `Include actionable market intelligence`,
        `Generate data-driven recommendations`,
        `Assess realistic market opportunities`,
        `Provide competitive advantage strategies`,
        `Include implementation timelines`
      ],

      outputFormat: `Return JSON with this exact structure:
{
  "niches": [
    {
      "keyword": "${keyword}",
      "demandScore": 82,
      "competitionScore": 65,
      "opportunityScore": 78,
      "searchVolume": 8500,
      "difficulty": 55,
      "trends": {
        "growth": "rising",
        "seasonality": "Year-round steady",
        "forecast": 95
      },
      "monetization": {
        "avgPrice": 45,
        "revenueScore": 90,
        "conversionRate": 3.0
      }
    }
  ],
  "methodology": "${depthGuidelines[analysisDepth as keyof typeof depthGuidelines]}",
  "marketAnalysis": {
    "totalMarketSize": 1200,
    "competitorCount": 5000,
    "marketSaturation": "medium",
    "topCompetitors": [...],
    "priceAnalysis": {...},
    "customerSegments": [...]
  },
  "recommendations": [
    {
      "type": "positioning",
      "title": "Strategic recommendation",
      "description": "Detailed strategy",
      "priority": "high",
      "impact": 90
    }
  ],
  "keywordSuggestions": [...],
  "competitorGaps": [...],
  "actionPlan": {
    "immediate": ["Action 1", "Action 2"],
    "shortTerm": ["Strategy 1", "Strategy 2"],
    "longTerm": ["Goal 1", "Goal 2"]
  }
}`,

      fallbackInstructions: "If unable to perform comprehensive analysis, provide basic market assessment with general recommendations."
    };
  }

  /**
   * Get prompt template for specific service
   */
  static getPromptTemplate(service: string, params: any): PromptTemplate {
    switch (service) {
      case 'content-generation':
        return this.getContentGenerationPrompt(
          params.contentType,
          params.platform,
          params.niche,
          params.tone,
          params.targetAudience
        );
      
      case 'auto-rewrite':
        return this.getAutoRewritePrompt(
          params.originalText,
          params.targetStyle,
          params.targetAudience,
          params.tone
        );
      
      case 'bundle-builder':
        return this.getBundleBuilderPrompt(
          params.products,
          params.targetAudience,
          params.category,
          params.priceStrategy
        );
      
      case 'niche-discovery':
        return this.getNicheDiscoveryPrompt(
          params.keyword,
          params.platform,
          params.targetAudience,
          params.analysisDepth
        );
      
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  }

  /**
   * Validate prompt output format
   */
  static validateOutput(service: string, output: any): boolean {
    try {
      switch (service) {
        case 'content-generation':
          return output.content && Array.isArray(output.content) && 
                 output.metrics && output.suggestions && output.hashtags;
        
        case 'auto-rewrite':
          return output.original && output.rewrittenContent && 
                 output.analysis && output.alternatives && output.suggestions;
        
        case 'bundle-builder':
          return output.bundleName && output.analysis && output.pricing && 
                 output.marketing && output.launchStrategy && output.recommendations;
        
        case 'niche-discovery':
          return output.niches && Array.isArray(output.niches) && 
                 output.marketAnalysis && output.recommendations && output.actionPlan;
        
        default:
          return false;
      }
    } catch {
      return false;
    }
  }
}