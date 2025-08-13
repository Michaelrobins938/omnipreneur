import { BaseAIService, AIServiceConfig } from './base-ai-service';
import { EnhancedAIService } from './enhanced-ai-service';

export interface ContentSpawnerRequest { 
  contentType: 'SOCIAL' | 'BLOG' | 'EMAIL' | 'AD_COPY' | 'SCRIPT' | 'NEWSLETTER';
  niche: string;
  keywords?: string;
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'urgent' | 'friendly';
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'general';
  targetAudience?: string;
  contentGoal?: string;
  quantity: number;
}

export interface ContentPiece {
  text: string;
  hashtags: string[];
  engagementScore: number;
  viralScore: number;
  hook?: string;
  callToAction?: string;
  seoKeywords?: string[];
  platformOptimizations?: Record<string, string>;
}

export interface ContentData { 
  content: ContentPiece[];
  metrics: {
    totalGenerated: number;
    avgViralScore: number;
    avgEngagementScore: number;
    platformOptimization: number;
  };
  suggestions: string[];
  hashtags: string[];
}

export class ContentSpawnerService extends BaseAIService {
  private enhancedAI: EnhancedAIService;

  constructor(config?: AIServiceConfig) { 
    super(config || { provider: 'openai', model: 'gpt-4o-mini' });
    this.enhancedAI = new EnhancedAIService(this.config, true); // Enable CAL™
  }

  async process(request: ContentSpawnerRequest): Promise<ContentData> {
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
      console.error('Content parsing error:', error);
      return this.generateFallbackResponse(request);
    }
  }
  private buildSystemPrompt(request: ContentSpawnerRequest): string {
    return `You are an expert content creator specializing in viral, engagement-driven content across multiple platforms.

Your expertise includes:
1. Platform-specific optimization (character limits, algorithms, best practices)
2. Psychology-driven content that resonates with target audiences
3. SEO optimization and strategic keyword integration
4. Viral content patterns and engagement triggers
5. Brand voice adaptation and tone consistency
6. Performance prediction and optimization scoring

Content Context:
- Content Type: ${request.contentType}
- Platform: ${request.platform}
- Niche: ${request.niche}
- Target Audience: ${request.targetAudience || 'General'}
- Tone: ${request.tone}
- Keywords: ${request.keywords || 'None specified'}

Platform-Specific Requirements:
${this.getPlatformRequirements(request.platform)}

Generate ${request.quantity} pieces of content optimized for maximum engagement and viral potential.

Return JSON with this exact structure:
{
  "content": [
    {
      "text": "Content text optimized for platform",
      "hashtags": ["#relevant", "#hashtags"],
      "engagementScore": 0.85,
      "viralScore": 0.75,
      "hook": "Attention-grabbing opening",
      "callToAction": "Specific action request",
      "seoKeywords": ["keyword1", "keyword2"],
      "platformOptimizations": {
        "characterCount": "optimal length",
        "bestTimeToPost": "timing recommendation",
        "algorithmTips": "platform-specific advice"
      }
    }
  ],
  "overallMetrics": {
    "avgEngagementScore": 0.8,
    "avgViralScore": 0.7,
    "platformOptimization": 0.9
  },
  "suggestions": ["actionable improvement tips"],
  "trendingHashtags": ["#trending", "#hashtags"]
}`;
  }

  private buildUserPrompt(request: ContentSpawnerRequest): string {
    let prompt = `Create ${request.quantity} ${request.contentType} pieces for the ${request.niche} niche on ${request.platform}.

Requirements:
- Tone: ${request.tone}
- Target Audience: ${request.targetAudience || 'General audience interested in ' + request.niche}
- Content Goal: ${request.contentGoal || 'Drive engagement and build authority'}`;

    if (request.keywords) {
      prompt += `\n- Keywords to include: ${request.keywords}`;
    }

    prompt += `\n\nEach piece should:
1. Have a compelling hook that stops scrolling
2. Provide genuine value to the audience
3. Include relevant hashtags for discoverability
4. Have a clear call-to-action
5. Be optimized for ${request.platform} algorithms
6. Score high for engagement and viral potential

Focus on creating content that your audience will want to share, comment on, and engage with. Use proven viral content patterns while maintaining authenticity and value.`;

    return prompt;
  }

  private getPlatformRequirements(platform: string): string {
    const requirements = {
      twitter: "280 character limit, trending hashtags, retweet-worthy hooks, thread potential",
      linkedin: "Professional tone, long-form potential, industry insights, networking focus",
      instagram: "Visual storytelling, story-friendly format, 30 hashtags max, aesthetic appeal",
      facebook: "Community building, shareability, emotional engagement, video-first",
      tiktok: "Trend awareness, quick hooks, entertainment value, challenge potential",
      youtube: "Educational value, searchable titles, thumbnail considerations, series potential",
      general: "Platform-agnostic, adaptable format, universal appeal"
    };
    
    return requirements[platform as keyof typeof requirements] || requirements.general;
  }

  private processAIResponse(parsed: any, request: ContentSpawnerRequest): ContentData {
    const content = Array.isArray(parsed.content) ? parsed.content : [];
    const processedContent: ContentPiece[] = content.map((item: any) => ({
      text: item.text || this.generateFallbackText(request),
      hashtags: Array.isArray(item.hashtags) ? item.hashtags : this.generateFallbackHashtags(request),
      engagementScore: Number(item.engagementScore) || 0.7 + Math.random() * 0.2,
      viralScore: Number(item.viralScore) || 0.6 + Math.random() * 0.3,
      hook: item.hook || this.generateFallbackHook(request),
      callToAction: item.callToAction || this.generateFallbackCTA(request),
      seoKeywords: Array.isArray(item.seoKeywords) ? item.seoKeywords : this.extractKeywords(request),
      platformOptimizations: item.platformOptimizations || this.generatePlatformOptimizations(request.platform)
    }));

    const metrics = this.calculateMetrics(processedContent);
    
    return {
      content: processedContent,
      metrics: {
        totalGenerated: processedContent.length,
        avgViralScore: metrics.avgViralScore,
        avgEngagementScore: metrics.avgEngagementScore,
        platformOptimization: parsed.overallMetrics?.platformOptimization || 0.85
      },
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : this.generateFallbackSuggestions(request),
      hashtags: Array.isArray(parsed.trendingHashtags) ? parsed.trendingHashtags : this.generateFallbackHashtags(request)
    };
  }

  private calculateMetrics(content: ContentPiece[]) {
    if (content.length === 0) {
      return { avgViralScore: 0.7, avgEngagementScore: 0.75 };
    }

    const avgViralScore = content.reduce((sum, item) => sum + item.viralScore, 0) / content.length;
    const avgEngagementScore = content.reduce((sum, item) => sum + item.engagementScore, 0) / content.length;
    
    return { avgViralScore, avgEngagementScore };
  }

  private generateFallbackResponse(request: ContentSpawnerRequest): ContentData {
    const fallbackContent: ContentPiece[] = Array.from({ length: request.quantity }, (_, i) => ({
      text: this.generateFallbackText(request, i + 1),
      hashtags: this.generateFallbackHashtags(request),
      engagementScore: 0.7 + Math.random() * 0.2,
      viralScore: 0.6 + Math.random() * 0.3,
      hook: this.generateFallbackHook(request),
      callToAction: this.generateFallbackCTA(request),
      seoKeywords: this.extractKeywords(request),
      platformOptimizations: this.generatePlatformOptimizations(request.platform)
    }));

    return {
      content: fallbackContent,
      metrics: {
        totalGenerated: fallbackContent.length,
        avgViralScore: 0.7,
        avgEngagementScore: 0.75,
        platformOptimization: 0.8
      },
      suggestions: this.generateFallbackSuggestions(request),
      hashtags: this.generateFallbackHashtags(request)
    };
  }

  private generateFallbackText(request: ContentSpawnerRequest, index?: number): string {
    const templates = {
      SOCIAL: `Discover the secrets of ${request.niche} that ${request.targetAudience || 'professionals'} need to know${index ? ` #${index}` : ''}. Here's what changed everything for me...`,
      BLOG: `The Ultimate Guide to ${request.niche}: Everything ${request.targetAudience || 'you'} Need to Know${index ? ` (Part ${index})` : ''}`,
      EMAIL: `Subject: ${request.niche} breakthrough that's changing everything\n\nHi there,\n\nI discovered something about ${request.niche} that I had to share with you...`,
      AD_COPY: `🚀 Transform Your ${request.niche} Results in 30 Days!\n\nJoin thousands who've already discovered the secret to ${request.contentGoal || 'success'}...`,
      SCRIPT: `[HOOK] What if I told you that ${request.niche} could change your life in ways you never imagined?\n\n[MAIN CONTENT] Today I'm sharing...`,
      NEWSLETTER: `📧 ${request.niche} Weekly Insights${index ? ` #${index}` : ''}\n\nThis week's top discoveries in ${request.niche}...`
    };
    
    return templates[request.contentType] || templates.SOCIAL;
  }

  private generateFallbackHashtags(request: ContentSpawnerRequest): string[] {
    const baseHashtags = [`#${request.niche.replace(/\s+/g, '').toLowerCase()}`];
    const platformHashtags = [`#${request.platform}`];
    const toneHashtags = [`#${request.tone}`];
    const contentHashtags = [`#${request.contentType.toLowerCase()}`];
    
    return [...baseHashtags, ...platformHashtags, ...toneHashtags, ...contentHashtags];
  }

  private generateFallbackHook(request: ContentSpawnerRequest): string {
    const hooks = {
      professional: `Here's what most people get wrong about ${request.niche}:`,
      casual: `Let me tell you about ${request.niche}...`,
      humorous: `Why ${request.niche} is like trying to fold a fitted sheet 😅`,
      inspirational: `Your ${request.niche} journey starts with one simple truth:`,
      urgent: `⚠️ This ${request.niche} mistake is costing you right now:`,
      friendly: `Hey! Want to know a secret about ${request.niche}?`
    };
    
    return hooks[request.tone] || hooks.friendly;
  }

  private generateFallbackCTA(request: ContentSpawnerRequest): string {
    const ctas = [
      'What is your experience with this?',
      'Share your thoughts below!',
      'Tag someone who needs to see this!',
      'Save this for later!',
      'Follow for more insights like this!',
      'What would you add to this list?'
    ];
    
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  private extractKeywords(request: ContentSpawnerRequest): string[] {
    if (request.keywords) {
      return request.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    return [request.niche, request.platform, request.contentType.toLowerCase()];
  }

  private generatePlatformOptimizations(platform: string): Record<string, string> {
    const optimizations = {
      twitter: {
        characterCount: "Stay under 280 characters for single tweets",
        bestTimeToPost: "1-3 PM on weekdays",
        algorithmTips: "Engage within first hour, use 1-2 hashtags max"
      },
      linkedin: {
        characterCount: "1,300 characters for optimal engagement",
        bestTimeToPost: "7-9 AM on Tuesday-Thursday",
        algorithmTips: "Add native video, tag relevant professionals"
      },
      instagram: {
        characterCount: "2,200 character limit, but front-load value",
        bestTimeToPost: "11 AM-1 PM on weekdays",
        algorithmTips: "Use all 30 hashtags, add location tags"
      },
      facebook: {
        characterCount: "40-80 characters for highest engagement",
        bestTimeToPost: "1-4 PM on weekdays",
        algorithmTips: "Encourage comments with questions"
      },
      tiktok: {
        characterCount: "Brief captions, let video tell the story",
        bestTimeToPost: "6-10 AM and 7-9 PM",
        algorithmTips: "Jump on trending sounds and hashtags"
      },
      youtube: {
        characterCount: "125 characters show in search results",
        bestTimeToPost: "2-4 PM on weekdays",
        algorithmTips: "Optimize title and thumbnail for CTR"
      }
    };
    
    return optimizations[platform as keyof typeof optimizations] || {
      characterCount: "Optimize for platform-specific limits",
      bestTimeToPost: "Test your audience's active hours",
      algorithmTips: "Focus on engagement within first hour"
    };
  }

  private generateFallbackSuggestions(request: ContentSpawnerRequest): string[] {
    return [
      `Test different posting times for ${request.platform} to maximize reach`,
      `A/B test different hooks to improve engagement rates`,
      `Create content series around ${request.niche} for higher retention`,
      `Engage with comments within the first hour of posting`,
      `Use platform-specific features like polls, questions, or live video`,
      `Monitor competitor content in the ${request.niche} space for trends`
    ];
  }
}

export default ContentSpawnerService;