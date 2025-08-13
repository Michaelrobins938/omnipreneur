import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface EcommerceOptimizerRequest {
  products: Array<{ id: string; title: string; price: number; category?: string; description?: string; conversionRate?: number }>;
  goals?: { targetConversionRate?: number; revenueTarget?: number };
}

export interface EcommerceOptimization {
  productId: string;
  newPrice?: number;
  messagingTweaks: string[];
  crossSellIds: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface EcommerceOptimizerResult {
  recommendations: EcommerceOptimization[];
  projectedRevenueLiftPct: number;
  copySuggestions: Record<string, string[]>; // productId -> suggestions
}

export class EcommerceOptimizerService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: EcommerceOptimizerRequest): Promise<EcommerceOptimizerResult> {
    const systemPrompt = 'You optimize e-commerce listings: pricing, copy, cross-sell pairs. Output JSON.';
    const userPrompt = JSON.stringify({ task: 'ecommerce_optimize', input: request });
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try {
      const parsed = JSON.parse(response.content);
      return this.processAIResponse(parsed, request);
    } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any, req: EcommerceOptimizerRequest): EcommerceOptimizerResult {
    const map = new Set(req.products.map(p => p.id));
    const recs: EcommerceOptimization[] = Array.isArray(parsed.recommendations) ? parsed.recommendations
      .filter((r: any) => map.has(String(r.productId)))
      .map((r: any) => ({
        productId: String(r.productId),
        newPrice: r.newPrice != null ? Number(r.newPrice) : undefined,
        messagingTweaks: Array.isArray(r.messagingTweaks) ? r.messagingTweaks.map(String) : [],
        crossSellIds: Array.isArray(r.crossSellIds) ? r.crossSellIds.map(String) : [],
        priority: (['low','medium','high'].includes(String(r.priority))) ? r.priority : 'medium'
      })) : [];

    const copy: Record<string, string[]> = parsed.copySuggestions || {};

    return {
      recommendations: recs,
      projectedRevenueLiftPct: Number(parsed.projectedRevenueLiftPct || 8),
      copySuggestions: copy
    };
  }

  private generateFallbackResponse(req: EcommerceOptimizerRequest): EcommerceOptimizerResult {
    const recs: EcommerceOptimization[] = req.products.slice(0, 5).map(p => ({
      productId: p.id,
      newPrice: Math.max(1, Math.round(p.price * 1.05 * 100) / 100),
      messagingTweaks: ['Add social proof above the fold', 'Clarify key benefit in first sentence'],
      crossSellIds: req.products.filter(x => x.id !== p.id).slice(0, 2).map(x => x.id),
      priority: 'medium'
    }));
    return { recommendations: recs, projectedRevenueLiftPct: 6, copySuggestions: {} };
  }
}

export default EcommerceOptimizerService;

