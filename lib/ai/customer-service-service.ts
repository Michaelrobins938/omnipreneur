import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface CustomerServiceRequest {
  tickets: Array<{ id: string; subject: string; body: string; sentiment?: string; priority?: 'low'|'medium'|'high'|'urgent' }>;
  slaHours?: number;
}

export interface RoutingRecommendation {
  ticketId: string;
  suggestedQueue: string;
  urgencyScore: number; // 0-100
  autoReply?: string;
}

export interface CustomerServiceResult {
  overallBacklog: number;
  sentimentBreakdown: Record<string, number>;
  routing: RoutingRecommendation[];
  macrosSuggested: string[];
  kpiForecast: { expectedResolutionHours: number; escalationRiskPct: number };
}

export class CustomerServiceService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: CustomerServiceRequest): Promise<CustomerServiceResult> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request);
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try {
      const parsed = JSON.parse(response.content);
      return this.processAIResponse(parsed, request);
    } catch {
      return this.generateFallbackResponse(request);
    }
  }

  private buildSystemPrompt(): string {
    return 'You are a customer support triage assistant. Analyze tickets, sentiment, priority, and suggest routing queues, urgency scores (0-100), optional auto replies, and macros. Output JSON only.';
  }

  private buildUserPrompt(req: CustomerServiceRequest): string {
    return JSON.stringify({ task: 'support_routing', input: req });
  }

  private processAIResponse(parsed: any, req: CustomerServiceRequest): CustomerServiceResult {
    const sentimentBreakdown: Record<string, number> = parsed.sentimentBreakdown || {};
    const routing: RoutingRecommendation[] = Array.isArray(parsed.routing) ? parsed.routing.map((r: any) => ({
      ticketId: String(r.ticketId),
      suggestedQueue: String(r.suggestedQueue || 'general'),
      urgencyScore: Number(r.urgencyScore || 50),
      autoReply: typeof r.autoReply === 'string' ? r.autoReply : undefined
    })) : [];

    return {
      overallBacklog: req.tickets.length,
      sentimentBreakdown,
      routing,
      macrosSuggested: Array.isArray(parsed.macrosSuggested) ? parsed.macrosSuggested.map(String) : [
        'Order status update',
        'Refund policy explanation'
      ],
      kpiForecast: {
        expectedResolutionHours: Number(parsed.kpiForecast?.expectedResolutionHours || 24),
        escalationRiskPct: Number(parsed.kpiForecast?.escalationRiskPct || 12)
      }
    };
  }

  private generateFallbackResponse(req: CustomerServiceRequest): CustomerServiceResult {
    const sentiment: Record<string, number> = {};
    for (const t of req.tickets) {
      const s = (t.sentiment || 'neutral').toLowerCase();
      sentiment[s] = (sentiment[s] || 0) + 1;
    }
    const routing: RoutingRecommendation[] = req.tickets.map(t => ({
      ticketId: t.id,
      suggestedQueue: (t.priority === 'urgent' || t.priority === 'high') ? 'priority' : 'general',
      urgencyScore: (t.priority === 'urgent') ? 90 : (t.priority === 'high') ? 75 : 50,
      autoReply: 'Thanks for reaching out—your ticket is in our queue. We will respond within 24 hours.'
    }));

    return {
      overallBacklog: req.tickets.length,
      sentimentBreakdown: sentiment,
      routing,
      macrosSuggested: ['Order status update', 'Return instructions', 'Password reset guidance'],
      kpiForecast: { expectedResolutionHours: 24, escalationRiskPct: 10 }
    };
  }
}

export default CustomerServiceService;

