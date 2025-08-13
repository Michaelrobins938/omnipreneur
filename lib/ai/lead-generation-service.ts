import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface LeadGenerationRequest { targetAudience: string; channels: string[]; goalCount?: number }
export interface LeadStrategy { targetChannels: Array<{ channel: string; strategy: string; expectedLeads: number }>; contentSuggestions: string[]; prioritization: Array<{ channel: string; impact: number; effort: number }> }

// Lead Scoring interfaces
export interface LeadScoringRequest {
  leads: Array<{
    id: string;
    email: string;
    name?: string;
    company?: string;
    jobTitle?: string;
    industry?: string;
    source: string;
    behavior: Array<{
      action: string;
      timestamp: string;
      value?: string;
      score?: number;
    }>;
    demographics: {
      location?: string;
      companySize?: string;
      revenue?: string;
      technology?: string[];
    };
    engagement: {
      emailOpens: number;
      emailClicks: number;
      websiteVisits: number;
      pageViews: number;
      timeOnSite: number;
      downloads: number;
    };
  }>;
  scoringCriteria: {
    industryFit: number;
    budgetFit: number;
    authorityLevel: number;
    timeline: number;
    engagement: number;
  };
  conversionGoals: string[];
  targetProfile?: {
    industries: string[];
    companySizes: string[];
    jobTitles: string[];
    technologies: string[];
  };
}

export interface LeadScoringResult {
  leadScores: Array<{
    id: string;
    overallScore: number;
    categoryScores: {
      industryFit: number;
      budgetFit: number;
      authorityLevel: number;
      timeline: number;
      engagement: number;
    };
    priority: 'hot' | 'warm' | 'cold';
    reasoning: string;
    recommendedActions: string[];
    conversionProbability: number;
  }>;
  predictions: {
    expectedConversions: number;
    recommendedFollowUp: string[];
    optimalContactTiming: string;
  };
  insights: {
    topPerformingChannels: string[];
    improvementSuggestions: string[];
    industryBenchmarks: Record<string, number>;
  };
}

export class LeadGenerationService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  
  async process(request: LeadGenerationRequest): Promise<LeadStrategy> {
    const sys = 'You create actionable lead generation strategies with channel-specific tactics. JSON only.';
    const usr = JSON.stringify({ task: 'lead_generation', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }

  async scoreLeads(request: LeadScoringRequest): Promise<LeadScoringResult> {
    const sys = 'You are an AI lead scoring expert. Analyze leads and provide detailed scoring with conversion probability. Return JSON with leadScores, predictions, and insights.';
    const usr = JSON.stringify({ task: 'lead_scoring', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateLeadScoringFallback(request);
    try { return this.processLeadScoringResponse(JSON.parse(resp.content), request); } catch { return this.generateLeadScoringFallback(request); }
  }
  private processAIResponse(parsed: any, req: LeadGenerationRequest): LeadStrategy {
    const channels = Array.isArray(parsed.targetChannels) ? parsed.targetChannels : req.channels.map(c => ({ channel: c, strategy: 'Organic outreach', expectedLeads: 10 }));
    const content = Array.isArray(parsed.contentSuggestions) ? parsed.contentSuggestions : ['Industry insights', 'Case studies', 'How-to guides'];
    const priority = Array.isArray(parsed.prioritization) ? parsed.prioritization : req.channels.map(c => ({ channel: c, impact: 7, effort: 5 }));
    return { targetChannels: channels, contentSuggestions: content, prioritization: priority };
  }
  private generateFallbackResponse(req: LeadGenerationRequest): LeadStrategy {
    return {
      targetChannels: req.channels.map(c => ({ channel: c, strategy: 'Build authority through valuable content', expectedLeads: req.goalCount ? Math.ceil(req.goalCount / req.channels.length) : 15 })),
      contentSuggestions: ['Educational blog posts', 'Industry case studies', 'Free tools/templates', 'Webinars and workshops'],
      prioritization: req.channels.map(c => ({ channel: c, impact: 7, effort: 5 }))
    };
  }

  private processLeadScoringResponse(parsed: any, req: LeadScoringRequest): LeadScoringResult {
    const leadScores = Array.isArray(parsed.leadScores) ? parsed.leadScores : req.leads.map(lead => ({
      id: lead.id,
      overallScore: this.calculateLeadScore(lead, req.scoringCriteria),
      categoryScores: {
        industryFit: req.scoringCriteria.industryFit,
        budgetFit: req.scoringCriteria.budgetFit,
        authorityLevel: req.scoringCriteria.authorityLevel,
        timeline: req.scoringCriteria.timeline,
        engagement: Math.min(100, (lead.engagement.emailOpens * 5 + lead.engagement.emailClicks * 10 + lead.engagement.websiteVisits * 3))
      },
      priority: this.calculateLeadScore(lead, req.scoringCriteria) > 70 ? 'hot' : this.calculateLeadScore(lead, req.scoringCriteria) > 40 ? 'warm' : 'cold',
      reasoning: `Score based on engagement metrics and demographics`,
      recommendedActions: ['Follow up via email', 'Schedule discovery call'],
      conversionProbability: this.calculateLeadScore(lead, req.scoringCriteria) / 100
    }));

    return {
      leadScores,
      predictions: {
        expectedConversions: Math.round(leadScores.reduce((sum: number, lead: any) => sum + lead.conversionProbability, 0)),
        recommendedFollowUp: ['Email sequence', 'Personal outreach', 'Content marketing'],
        optimalContactTiming: 'Business hours 9-11 AM'
      },
      insights: {
        topPerformingChannels: ['email', 'social media', 'direct'],
        improvementSuggestions: ['Increase engagement', 'Better targeting'],
        industryBenchmarks: { 'conversion_rate': 2.5, 'engagement_rate': 15.0 }
      }
    };
  }

  private generateLeadScoringFallback(req: LeadScoringRequest): LeadScoringResult {
    const leadScores = req.leads.map(lead => ({
      id: lead.id,
      overallScore: this.calculateLeadScore(lead, req.scoringCriteria),
      categoryScores: {
        industryFit: req.scoringCriteria.industryFit,
        budgetFit: req.scoringCriteria.budgetFit,
        authorityLevel: req.scoringCriteria.authorityLevel,
        timeline: req.scoringCriteria.timeline,
        engagement: Math.min(100, (lead.engagement.emailOpens * 5 + lead.engagement.emailClicks * 10 + lead.engagement.websiteVisits * 3))
      },
      priority: this.calculateLeadScore(lead, req.scoringCriteria) > 70 ? 'hot' as const : this.calculateLeadScore(lead, req.scoringCriteria) > 40 ? 'warm' as const : 'cold' as const,
      reasoning: `Score based on engagement metrics: ${lead.engagement.emailOpens} opens, ${lead.engagement.emailClicks} clicks, ${lead.engagement.websiteVisits} visits`,
      recommendedActions: ['Follow up via email', 'Schedule discovery call', 'Send relevant case study'],
      conversionProbability: this.calculateLeadScore(lead, req.scoringCriteria) / 100
    }));

    return {
      leadScores,
      predictions: {
        expectedConversions: Math.round(leadScores.reduce((sum, lead) => sum + lead.conversionProbability, 0)),
        recommendedFollowUp: ['Email sequence', 'Personal outreach', 'Content marketing'],
        optimalContactTiming: 'Business hours 9-11 AM'
      },
      insights: {
        topPerformingChannels: ['email', 'social media', 'direct'],
        improvementSuggestions: ['Increase engagement frequency', 'Better demographic targeting'],
        industryBenchmarks: { 'conversion_rate': 2.5, 'engagement_rate': 15.0 }
      }
    };
  }

  private calculateLeadScore(lead: any, criteria: LeadScoringRequest['scoringCriteria']): number {
    const engagementScore = Math.min(100, (lead.engagement.emailOpens * 2 + lead.engagement.emailClicks * 5 + lead.engagement.websiteVisits * 3 + lead.engagement.downloads * 10));
    const behaviorScore = lead.behavior.reduce((sum: number, b: any) => sum + (b.score || 5), 0);
    const baseScore = (engagementScore * 0.4) + (behaviorScore * 0.3) + (criteria.industryFit * 0.3);
    return Math.min(100, Math.max(0, baseScore));
  }
}

export default LeadGenerationService;