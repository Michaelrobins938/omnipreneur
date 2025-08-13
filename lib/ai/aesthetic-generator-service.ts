import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface AestheticGeneratorRequest {
  brand: { name: string; colors?: string[]; vibe?: string };
  useCase: 'social'|'landing'|'presentation'|'ad';
}

export interface AestheticGeneratorResult {
  palette: string[];
  typography: { heading: string; body: string };
  layoutIdeas: string[];
  componentStyles: Record<string, any>;
}

export class AestheticGeneratorService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: AestheticGeneratorRequest): Promise<AestheticGeneratorResult> {
    const sys = 'You propose cohesive visual design systems (palette, type, layout, components). Output JSON only.';
    const usr = JSON.stringify({ task: 'aesthetic_system', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any, req: AestheticGeneratorRequest): AestheticGeneratorResult {
    return {
      palette: Array.isArray(parsed.palette) ? parsed.palette.map(String) : (req.brand.colors?.length ? req.brand.colors : ['#0ea5e9','#111827','#e5e7eb']),
      typography: parsed.typography || { heading: 'Inter', body: 'Inter' },
      layoutIdeas: Array.isArray(parsed.layoutIdeas) ? parsed.layoutIdeas.map(String) : ['Hero with glassmorphism', 'Split feature grid', 'Pricing with contrast'],
      componentStyles: parsed.componentStyles || { button: { radius: 12, weight: 'bold' }, card: { blur: 12 } }
    };
  }

  private generateFallbackResponse(req: AestheticGeneratorRequest): AestheticGeneratorResult {
    return {
      palette: req.brand.colors?.length ? req.brand.colors : ['#22d3ee', '#0f172a', '#94a3b8'],
      typography: { heading: 'Inter', body: 'Inter' },
      layoutIdeas: ['Glass hero', 'Feature grid', 'CTA footer'],
      componentStyles: { button: { radius: 12, weight: 'bold' }, card: { blur: 12 } }
    };
  }
}

export default AestheticGeneratorService;

