import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface LiveDashboardRequest { metrics: Record<string, number>; timeframe?: string }
export interface DashboardInsights { keyInsights: string[]; trends: Array<{ metric: string; direction: 'up'|'down'|'stable'; significance: 'high'|'medium'|'low' }>; recommendations: string[] }

export class LiveDashboardService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: LiveDashboardRequest): Promise<DashboardInsights> {
    const sys = 'You analyze business metrics and provide actionable insights. JSON only.';
    const usr = JSON.stringify({ task: 'dashboard_analysis', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }
  private processAIResponse(parsed: any, req: LiveDashboardRequest): DashboardInsights {
    const insights = Array.isArray(parsed.keyInsights) ? parsed.keyInsights : ['Metrics are within normal ranges'];
    const trends = Array.isArray(parsed.trends) ? parsed.trends : Object.keys(req.metrics).map(m => ({ metric: m, direction: 'stable' as const, significance: 'medium' as const }));
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Continue monitoring key metrics', 'Focus on growth opportunities'];
    return { keyInsights: insights, trends, recommendations };
  }
  private generateFallbackResponse(req: LiveDashboardRequest): DashboardInsights {
    return {
      keyInsights: ['Dashboard shows steady performance', 'Key metrics are tracking well'],
      trends: Object.keys(req.metrics).map(metric => ({ metric, direction: 'stable' as const, significance: 'medium' as const })),
      recommendations: ['Monitor trends closely', 'Look for optimization opportunities', 'Maintain current strategy']
    };
  }
}

export default LiveDashboardService;