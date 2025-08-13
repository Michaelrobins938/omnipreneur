import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface LegalComplianceRequest { policyText: string; dataFlows?: string[]; }
export interface LegalIssue { section: string; severity: 'low'|'medium'|'high'; law: string; recommendation: string; }
export interface LegalComplianceResult { riskScore: number; issues: LegalIssue[]; remediationChecklist: string[]; }

export class LegalAIComplianceService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: LegalComplianceRequest): Promise<LegalComplianceResult> {
    const sys = 'You are a legal compliance analyst (GDPR/CCPA perspective). Provide JSON with risk score, issues, and remediation.';
    const usr = JSON.stringify({ task: 'legal_compliance_audit', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse();
    try { return this.processAIResponse(JSON.parse(resp.content)); } catch { return this.generateFallbackResponse(); }
  }
  private processAIResponse(parsed: any): LegalComplianceResult {
    return {
      riskScore: Number(parsed.riskScore || 55),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      remediationChecklist: Array.isArray(parsed.remediationChecklist) ? parsed.remediationChecklist.map(String) : [
        'Document lawful basis for processing', 'Add DSAR workflow'
      ]
    };
  }
  private generateFallbackResponse(): LegalComplianceResult {
    return { riskScore: 60, issues: [], remediationChecklist: ['Map personal data flows', 'Implement DSAR handling SOP'] };
  }
}

export default LegalAIComplianceService;

