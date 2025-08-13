import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface MedicalAssistantRequest {
  symptoms: string[];
  demographics?: { age?: number; sex?: string };
  history?: string[];
}

export interface MedicalAssistantResult {
  differentialDiagnoses: Array<{ condition: string; likelihoodPct: number; redFlags: string[] }>;
  triageRecommendation: 'self-care' | 'primary-care' | 'urgent-care' | 'emergency';
  nextSteps: string[];
  disclaimer: string;
}

export class MedicalAIAssistantService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: MedicalAssistantRequest): Promise<MedicalAssistantResult> {
    const systemPrompt = 'You are a medical information assistant. Provide educational guidance only with disclaimers. Output JSON.';
    const userPrompt = JSON.stringify({ task: 'medical_triage', input: request });
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(response.content)); } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any): MedicalAssistantResult {
    return {
      differentialDiagnoses: Array.isArray(parsed.differentialDiagnoses) ? parsed.differentialDiagnoses : [],
      triageRecommendation: ['self-care','primary-care','urgent-care','emergency'].includes(parsed.triageRecommendation) ? parsed.triageRecommendation : 'primary-care',
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.map(String) : ['Consult a licensed clinician for diagnosis and treatment.'],
      disclaimer: String(parsed.disclaimer || 'This is not medical advice. For diagnosis and treatment, consult a licensed clinician.')
    };
  }

  private generateFallbackResponse(_req: MedicalAssistantRequest): MedicalAssistantResult {
    return {
      differentialDiagnoses: [],
      triageRecommendation: 'primary-care',
      nextSteps: ['Consult a licensed clinician for diagnosis and treatment.'],
      disclaimer: 'This is not medical advice. For diagnosis and treatment, consult a licensed clinician.'
    };
  }
}

export default MedicalAIAssistantService;

