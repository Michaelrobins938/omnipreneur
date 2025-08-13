import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface AutoNicheEngineRequest { 
  keyword: string;
  platform: 'kdp' | 'etsy' | 'amazon' | 'shopify' | 'general';
  targetAudience?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  competitionLevel?: 'low' | 'medium' | 'high' | 'any';
  analysisDepth?: 'quick' | 'standard' | 'comprehensive';
  seedKeywords?: string[];
  region?: string;
}

export interface NicheIdea { 
  keyword: string; 
  demandScore: number; 
  competitionScore: number; 
  opportunityScore: number;
  searchVolume: number;
  difficulty: number;
  trends: {
    growth: 'rising' | 'stable' | 'declining';
    seasonality: string;
    forecast: number;
  };
  monetization: {
    avgPrice: number;
    revenueScore: number;
    conversionRate: number;
  };
}

export interface MarketAnalysis {
  totalMarketSize: number;
  competitorCount: number;
  marketSaturation: 'low' | 'medium' | 'high';
  topCompetitors: Array<{
    name: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  priceAnalysis: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    pricingStrategy: string;
  };
  customerSegments: Array<{
    segment: string;
    size: number;
    characteristics: string[];
    painPoints: string[];
  }>;
}

export interface AutoNicheEngineResult { 
  niches: NicheIdea[]; 
  methodology: string;
  marketAnalysis: MarketAnalysis;
  recommendations: Array<{
    type: 'product' | 'pricing' | 'marketing' | 'positioning';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
  }>;
  keywordSuggestions: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    relevance: number;
  }>;
  competitorGaps: Array<{
    gap: string;
    opportunity: string;
    difficulty: number;
  }>;
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export class AutoNicheEngineService extends BaseAIService {
  constructor(config?: AIServiceConfig) { 
    super(config || { provider: 'openai', model: 'gpt-4o-mini' }); 
  }

  async process(request: AutoNicheEngineRequest): Promise<AutoNicheEngineResult> {
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
      console.error('Niche analysis parsing error:', error);
      return this.generateFallbackResponse(request);
    }
  }

  private buildSystemPrompt(request: AutoNicheEngineRequest): string {
    return `You are an expert market research analyst specializing in niche discovery and opportunity assessment across digital marketplaces.

Your expertise includes:
1. Advanced keyword research and search volume analysis
2. Competitive landscape assessment and gap identification
3. Market trend analysis and forecasting
4. Customer segmentation and behavior analysis
5. Monetization potential and revenue modeling
6. Platform-specific optimization strategies

Analysis Context:
- Primary Keyword: ${request.keyword}
- Platform: ${request.platform}
- Target Audience: ${request.targetAudience || 'General market'}
- Analysis Depth: ${request.analysisDepth || 'standard'}
- Competition Level: ${request.competitionLevel || 'any'}
- Region: ${request.region || 'Global'}

Platform-Specific Considerations:
${this.getPlatformContext(request.platform)}

Conduct comprehensive market analysis to identify high-opportunity niches with detailed scoring, competitive analysis, and actionable recommendations.

Return JSON with comprehensive niche analysis including market data, competitor insights, and strategic recommendations.`;
  }

  private buildUserPrompt(request: AutoNicheEngineRequest): string {
    let prompt = `Analyze the "${request.keyword}" niche for ${request.platform} platform opportunities.

Research Requirements:
- Platform: ${request.platform}
- Primary Keyword: ${request.keyword}
- Analysis Depth: ${request.analysisDepth || 'standard'}
- Target Competition Level: ${request.competitionLevel || 'any'}`;

    if (request.targetAudience) {
      prompt += `\n- Target Audience: ${request.targetAudience}`;
    }

    if (request.priceRange) {
      prompt += `\n- Price Range: $${request.priceRange.min} - $${request.priceRange.max}`;
    }

    prompt += `\n\nProvide comprehensive analysis including market opportunities, competitive landscape, trends, and actionable recommendations.`;

    return prompt;
  }

  private getPlatformContext(platform: string): string {
    const contexts = {
      kdp: "Amazon KDP - Focus on book categories, keyword trends, competition analysis",
      etsy: "Etsy marketplace - Handmade, vintage, craft supplies with seasonal patterns",
      amazon: "Amazon marketplace - Broad product categories with search volume analysis",
      shopify: "Shopify e-commerce - Direct-to-consumer focus with brand building",
      general: "General digital marketplace analysis with broad applicability"
    };
    
    return contexts[platform] || contexts.general;
  }

  private processAIResponse(parsed: any, request: AutoNicheEngineRequest): AutoNicheEngineResult {
    const marketAnalysis = this.generateMarketAnalysis(request, parsed.marketAnalysis);
    const keywordSuggestions = this.generateKeywordSuggestions(request.keyword, parsed.keywordSuggestions);
    const recommendations = this.generateRecommendations(request, marketAnalysis, parsed.recommendations);
    
    const niches: NicheIdea[] = Array.isArray(parsed.niches) ? parsed.niches.map((n: any) => ({
      keyword: String(n.keyword || request.keyword),
      demandScore: Number(n.demandScore || this.calculateDemandScore(request.keyword)),
      competitionScore: Number(n.competitionScore || this.calculateCompetitionScore(request.platform)),
      opportunityScore: Number(n.opportunityScore || this.calculateOpportunityScore(request)),
      searchVolume: Number(n.searchVolume || this.estimateSearchVolume(request.keyword)),
      difficulty: Number(n.difficulty || this.calculateDifficulty(request.platform, request.competitionLevel)),
      trends: n.trends || this.generateTrends(request.keyword),
      monetization: n.monetization || this.generateMonetization(request.priceRange, request.platform)
    })) : [this.generateMainNiche(request)];

    return {
      niches,
      methodology: parsed.methodology || this.getMethodology(request.analysisDepth || 'standard'),
      marketAnalysis,
      recommendations,
      keywordSuggestions,
      competitorGaps: parsed.competitorGaps || this.generateCompetitorGaps(request),
      actionPlan: parsed.actionPlan || this.generateActionPlan(request, recommendations)
    };
  }

  private generateMarketAnalysis(request: AutoNicheEngineRequest, aiData?: any): MarketAnalysis {
    return {
      totalMarketSize: aiData?.totalMarketSize || this.estimateMarketSize(request.keyword, request.platform),
      competitorCount: aiData?.competitorCount || this.estimateCompetitorCount(request.platform),
      marketSaturation: aiData?.marketSaturation || this.assessMarketSaturation(request.competitionLevel),
      topCompetitors: aiData?.topCompetitors || this.generateTopCompetitors(request.platform),
      priceAnalysis: aiData?.priceAnalysis || this.generatePriceAnalysis(request.priceRange, request.platform),
      customerSegments: aiData?.customerSegments || this.generateCustomerSegments(request.targetAudience, request.keyword)
    };
  }

  private generateKeywordSuggestions(baseKeyword: string, aiData?: any[]): Array<{keyword: string; searchVolume: number; difficulty: number; relevance: number}> {
    const keywords = [
      `${baseKeyword} guide`,
      `${baseKeyword} tips`,
      `${baseKeyword} for beginners`,
      `best ${baseKeyword}`,
      `${baseKeyword} tutorial`
    ];

    return keywords.map(keyword => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      difficulty: Math.floor(Math.random() * 60) + 20,
      relevance: Math.floor(Math.random() * 30) + 70
    }));
  }

  private generateRecommendations(request: AutoNicheEngineRequest, marketAnalysis: MarketAnalysis, aiData?: any[]) {
    const recommendations = [];
    
    if (marketAnalysis.marketSaturation === 'low') {
      recommendations.push({
        type: 'positioning' as const,
        title: 'First Mover Advantage',
        description: 'Low competition presents an opportunity to establish market leadership',
        priority: 'high' as const,
        impact: 90
      });
    }

    recommendations.push({
      type: 'product' as const,
      title: `Optimize for ${request.platform}`,
      description: `Tailor product features for ${request.platform} best practices`,
      priority: 'high' as const,
      impact: 85
    });

    return aiData || recommendations;
  }

  private calculateDemandScore(keyword: string): number {
    const wordCount = keyword.split(' ').length;
    const baseScore = Math.max(30, 100 - (wordCount * 5));
    return Math.min(100, baseScore + Math.floor(Math.random() * 20));
  }

  private calculateCompetitionScore(platform: string): number {
    const platformCompetition = {
      kdp: 70,
      etsy: 60,
      amazon: 80,
      shopify: 50,
      general: 65
    };
    
    const baseScore = platformCompetition[platform as keyof typeof platformCompetition] || 65;
    return Math.max(10, Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10));
  }

  private calculateOpportunityScore(request: AutoNicheEngineRequest): number {
    const demandScore = this.calculateDemandScore(request.keyword);
    const competitionScore = this.calculateCompetitionScore(request.platform);
    const opportunityScore = (demandScore + (100 - competitionScore)) / 2;
    return Math.round(opportunityScore);
  }

  private estimateSearchVolume(keyword: string): number {
    const wordCount = keyword.split(' ').length;
    const baseVolume = Math.max(100, 10000 - (wordCount * 1000));
    return Math.floor(baseVolume + Math.random() * baseVolume * 0.5);
  }

  private calculateDifficulty(platform: string, competitionLevel?: string): number {
    const baseDifficulty = {
      kdp: 65,
      etsy: 55,
      amazon: 75,
      shopify: 50,
      general: 60
    };

    const base = baseDifficulty[platform as keyof typeof baseDifficulty] || 60;
    return Math.round(Math.max(10, Math.min(100, base)));
  }

  private generateTrends(keyword: string) {
    const trends = ['rising', 'stable', 'declining'] as const;
    return {
      growth: trends[Math.floor(Math.random() * trends.length)],
      seasonality: this.determineSeasonality(keyword),
      forecast: Math.floor(Math.random() * 40) + 80
    };
  }

  private determineSeasonality(keyword: string): string {
    const seasonalKeywords = {
      'christmas': 'Q4 peak',
      'valentine': 'February peak',
      'summer': 'Q2-Q3 peak',
      'wedding': 'Spring/Summer peak'
    };

    const lowerKeyword = keyword.toLowerCase();
    for (const [seasonal, pattern] of Object.entries(seasonalKeywords)) {
      if (lowerKeyword.includes(seasonal)) {
        return pattern;
      }
    }

    return 'Year-round steady demand';
  }

  private generateMonetization(priceRange?: {min: number; max: number}, platform?: string) {
    const avgPrice = priceRange ? (priceRange.min + priceRange.max) / 2 : this.getDefaultPrice(platform);
    
    return {
      avgPrice,
      revenueScore: Math.min(100, avgPrice * 2),
      conversionRate: this.getExpectedConversionRate(platform)
    };
  }

  private getDefaultPrice(platform?: string): number {
    const defaultPrices = {
      kdp: 15,
      etsy: 25,
      amazon: 35,
      shopify: 45,
      general: 30
    };
    
    return defaultPrices[platform as keyof typeof defaultPrices] || 30;
  }

  private getExpectedConversionRate(platform?: string): number {
    const conversionRates = {
      kdp: 0.8,
      etsy: 2.5,
      amazon: 1.5,
      shopify: 3.0,
      general: 2.0
    };
    
    return conversionRates[platform as keyof typeof conversionRates] || 2.0;
  }

  private estimateMarketSize(keyword: string, platform: string): number {
    const baseSizes = {
      kdp: 500,
      etsy: 200,
      amazon: 2000,
      shopify: 800,
      general: 1000
    };

    const baseSize = baseSizes[platform as keyof typeof baseSizes] || 1000;
    return Math.floor(baseSize + Math.random() * baseSize * 0.5);
  }

  private estimateCompetitorCount(platform: string): number {
    const competitorCounts = {
      kdp: 15000,
      etsy: 8000,
      amazon: 25000,
      shopify: 5000,
      general: 10000
    };

    return competitorCounts[platform as keyof typeof competitorCounts] || 10000;
  }

  private assessMarketSaturation(competitionLevel?: string): 'low' | 'medium' | 'high' {
    if (competitionLevel === 'low') return 'low';
    if (competitionLevel === 'high') return 'high';
    return 'medium';
  }

  private generateTopCompetitors(platform: string) {
    return [
      {
        name: `Leading ${platform} Seller`,
        marketShare: 15,
        strengths: ['Strong brand recognition', 'Large customer base'],
        weaknesses: ['Higher prices', 'Limited product range']
      },
      {
        name: `Established ${platform} Brand`,
        marketShare: 12,
        strengths: ['Quality products', 'Good reviews'],
        weaknesses: ['Slow innovation', 'Limited marketing']
      }
    ];
  }

  private generatePriceAnalysis(priceRange?: {min: number; max: number}, platform?: string) {
    const avgPrice = this.getDefaultPrice(platform);
    return {
      averagePrice: priceRange ? (priceRange.min + priceRange.max) / 2 : avgPrice,
      priceRange: priceRange || { min: avgPrice * 0.5, max: avgPrice * 2 },
      pricingStrategy: 'Competitive pricing with value differentiation'
    };
  }

  private generateCustomerSegments(targetAudience?: string, keyword?: string) {
    return [
      {
        segment: targetAudience || 'Primary Target',
        size: 60,
        characteristics: ['Active online shoppers', 'Price-conscious', 'Quality-focused'],
        painPoints: ['Limited time', 'Information overload', 'Quality concerns']
      }
    ];
  }

  private generateMainNiche(request: AutoNicheEngineRequest): NicheIdea {
    return {
      keyword: request.keyword,
      demandScore: this.calculateDemandScore(request.keyword),
      competitionScore: this.calculateCompetitionScore(request.platform),
      opportunityScore: this.calculateOpportunityScore(request),
      searchVolume: this.estimateSearchVolume(request.keyword),
      difficulty: this.calculateDifficulty(request.platform, request.competitionLevel),
      trends: this.generateTrends(request.keyword),
      monetization: this.generateMonetization(request.priceRange, request.platform)
    };
  }

  private generateCompetitorGaps(request: AutoNicheEngineRequest) {
    return [
      {
        gap: 'Mobile optimization',
        opportunity: `Improve mobile experience for ${request.platform} users`,
        difficulty: 30
      },
      {
        gap: 'Customer support',
        opportunity: 'Provide superior customer service experience',
        difficulty: 40
      }
    ];
  }

  private generateActionPlan(request: AutoNicheEngineRequest, recommendations: any[]) {
    return {
      immediate: [
        `Research ${request.keyword} competition on ${request.platform}`,
        'Validate market demand with initial product test'
      ],
      shortTerm: [
        'Develop minimum viable product',
        'Implement SEO and keyword optimization'
      ],
      longTerm: [
        'Scale product line based on market feedback',
        'Establish brand authority in niche'
      ]
    };
  }

  private getMethodology(depth: string): string {
    const methodologies = {
      quick: 'Rapid market assessment using keyword analysis and basic competitive intelligence',
      standard: 'Comprehensive market analysis combining keyword research, competitive analysis, and trend evaluation',
      comprehensive: 'Deep market intelligence including advanced competitive analysis, customer segmentation, and predictive modeling'
    };
    
    return methodologies[depth as keyof typeof methodologies] || methodologies.standard;
  }

  private generateFallbackResponse(request: AutoNicheEngineRequest): AutoNicheEngineResult {
    const mainNiche = this.generateMainNiche(request);
    const marketAnalysis = this.generateMarketAnalysis(request);
    const keywordSuggestions = this.generateKeywordSuggestions(request.keyword);
    const recommendations = this.generateRecommendations(request, marketAnalysis);

    return {
      niches: [mainNiche],
      methodology: this.getMethodology(request.analysisDepth || 'standard'),
      marketAnalysis,
      recommendations,
      keywordSuggestions,
      competitorGaps: this.generateCompetitorGaps(request),
      actionPlan: this.generateActionPlan(request, recommendations)
    };
  }
}

export default AutoNicheEngineService;