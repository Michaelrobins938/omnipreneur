import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface HealthcareComplianceRequest { policyText: string; phiDataFlows?: string[] }
export interface HealthcareIssue { section: string; severity: 'low'|'medium'|'high'; hipaaRule: string; remediation: string }
export interface HealthcareComplianceResult { riskScore: number; issues: HealthcareIssue[]; safeguards: string[] }

export class HealthcareAIComplianceService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: HealthcareComplianceRequest): Promise<HealthcareComplianceResult> {
    const sys = 'You analyze HIPAA-aligned safeguards (administrative/physical/technical). Output JSON.';
    const usr = JSON.stringify({ task: 'hipaa_compliance_audit', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse();
    try { return this.processAIResponse(JSON.parse(resp.content)); } catch { return this.generateFallbackResponse(); }
  }
  private processAIResponse(parsed: any): HealthcareComplianceResult {
    return {
      riskScore: Number(parsed.riskScore || 48),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      safeguards: Array.isArray(parsed.safeguards) ? parsed.safeguards.map(String) : ['Access controls', 'Audit logs']
    };
  }
  private generateFallbackResponse(): HealthcareComplianceResult {
    return { riskScore: 50, issues: [], safeguards: ['Risk analysis', 'Access control policy', 'Audit logging'] };
  }
}

export default HealthcareAIComplianceService;

