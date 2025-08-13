import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface InvoiceGeneratorRequest { customerName: string; items: Array<{ name: string; qty: number; price: number }>; taxRate?: number }
export interface InvoiceData { subtotal: number; tax: number; total: number; notes: string }

export class InvoiceGeneratorService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: InvoiceGeneratorRequest): Promise<InvoiceData> {
    const sys = 'You create professional invoice data with accurate calculations. JSON only.';
    const usr = JSON.stringify({ task: 'invoice_generation', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }
  private processAIResponse(parsed: any, req: InvoiceGeneratorRequest): InvoiceData {
    const subtotal = req.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * (req.taxRate || 0.1);
    const total = subtotal + tax;
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      notes: parsed.notes || 'Payment due in 14 days. Thank you!'
    };
  }
  private generateFallbackResponse(req: InvoiceGeneratorRequest): InvoiceData {
    const subtotal = req.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * (req.taxRate || 0.1);
    const total = subtotal + tax;
    return { subtotal, tax, total, notes: 'Payment due in 14 days. Thank you!' };
  }
}

export default InvoiceGeneratorService;