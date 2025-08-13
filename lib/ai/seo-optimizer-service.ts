import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface SEOOptimizerRequest { url?: string; content?: string; targetKeywords?: string[] }
export interface SEOIssue { area: string; severity: 'low'|'medium'|'high'; fix: string }
export interface SEOOptimizerResult { overallScore: number; issues: SEOIssue[]; recommendations: string[] }

export class SEOOptimizerService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: SEOOptimizerRequest): Promise<SEOOptimizerResult> {
    const sys = 'You run a practical SEO audit across technical/content/on-page and return JSON.';
    const usr = JSON.stringify({ task: 'seo_audit', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse();
    try { return this.processAIResponse(JSON.parse(resp.content)); } catch { return this.generateFallbackResponse(); }
  }
  private processAIResponse(parsed: any): SEOOptimizerResult {
    return {
      overallScore: Number(parsed.overallScore || 70),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : ['Improve metadata', 'Add internal links']
    };
  }
  private generateFallbackResponse(): SEOOptimizerResult {
    return { overallScore: 72, issues: [], recommendations: ['Compress images', 'Improve H1/H2 structure'] };
  }
}

export default SEOOptimizerService;