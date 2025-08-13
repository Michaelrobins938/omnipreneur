import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface EducationComplianceRequest {
  policyText: string;
  dataTypes: string[];
  studentAgeRange?: string;
}

export interface ComplianceIssue { section: string; severity: 'low'|'medium'|'high'; recommendation: string; }

export interface EducationComplianceResult {
  riskScore: number; // 0-100
  issues: ComplianceIssue[];
  remediationChecklist: string[];
}

export class EducationAIComplianceService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: EducationComplianceRequest): Promise<EducationComplianceResult> {
    const sys = 'You analyze educational data privacy policies (FERPA/COPPA orientation). Output JSON with risk score and issues.';
    const usr = JSON.stringify({ task: 'edu_compliance_audit', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse();
    try { return this.processAIResponse(JSON.parse(resp.content)); } catch { return this.generateFallbackResponse(); }
  }

  private processAIResponse(parsed: any): EducationComplianceResult {
    return {
      riskScore: Number(parsed.riskScore || 45),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      remediationChecklist: Array.isArray(parsed.remediationChecklist) ? parsed.remediationChecklist.map(String) : [
        'Define data retention limits', 'Clarify parental consent mechanisms'
      ]
    };
  }

  private generateFallbackResponse(): EducationComplianceResult {
    return { riskScore: 50, issues: [], remediationChecklist: ['Publish data retention policy', 'Add consent verification flow'] };
  }
}

export default EducationAIComplianceService;

