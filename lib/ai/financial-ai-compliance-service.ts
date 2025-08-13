import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface FinancialComplianceRequest { policyText: string; controls?: string[] }
export interface FinancialIssue { control: string; severity: 'low'|'medium'|'high'; gap: string; remediation: string }
export interface FinancialComplianceResult { riskScore: number; issues: FinancialIssue[]; auditReadiness: 'low'|'medium'|'high' }

export class FinancialAIComplianceService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: FinancialComplianceRequest): Promise<FinancialComplianceResult> {
    const sys = 'You analyze financial/SOX-style control maturity. Output JSON with riskScore, issues, and auditReadiness.';
    const usr = JSON.stringify({ task: 'financial_compliance_audit', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse();
    try { return this.processAIResponse(JSON.parse(resp.content)); } catch { return this.generateFallbackResponse(); }
  }
  private processAIResponse(parsed: any): FinancialComplianceResult {
    return {
      riskScore: Number(parsed.riskScore || 50),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      auditReadiness: ['low','medium','high'].includes(parsed.auditReadiness) ? parsed.auditReadiness : 'medium'
    };
  }
  private generateFallbackResponse(): FinancialComplianceResult {
    return { riskScore: 55, issues: [], auditReadiness: 'medium' };
  }
}

export default FinancialAIComplianceService;

