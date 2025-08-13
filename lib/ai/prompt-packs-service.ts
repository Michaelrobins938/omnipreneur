import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface PromptPacksRequest { theme: string; audience?: string; count?: number }
export interface PromptPacksResult { prompts: string[]; categories: Record<string, string[]> }

export class PromptPacksService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: PromptPacksRequest): Promise<PromptPacksResult> {
    const sys = 'You generate curated, high-quality prompt packs by theme and audience. Output JSON only.';
    const usr = JSON.stringify({ task: 'prompt_pack_generate', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }
  private processAIResponse(parsed: any, req: PromptPacksRequest): PromptPacksResult {
    return {
      prompts: Array.isArray(parsed.prompts) ? parsed.prompts.map(String) : this.defaultPrompts(req),
      categories: parsed.categories || {}
    };
  }
  private defaultPrompts(req: PromptPacksRequest): string[] {
    const n = Math.max(1, Math.min(50, req.count || 10));
    return Array.from({ length: n }, (_, i) => `${req.theme} prompt #${i + 1} for ${req.audience || 'general audience'}`);
  }
  private generateFallbackResponse(req: PromptPacksRequest): PromptPacksResult {
    return { prompts: this.defaultPrompts(req), categories: {} };
  }
}

export default PromptPacksService;

