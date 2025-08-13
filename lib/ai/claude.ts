import { Anthropic } from '@anthropic-ai/sdk';
import { config } from '@/lib/config';

let client: Anthropic | null = null;

export function getClaude(): Anthropic {
  if (client) return client;
  if (!config.ai.anthropicKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  client = new Anthropic({ apiKey: config.ai.anthropicKey });
  return client;
}

export async function completeClaude(params: {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const api = getClaude();
  const response = await (api as any).messages.create({
    model: params.model || 'claude-3-5-sonnet-20241022',
    max_tokens: params.maxTokens ?? config.ai.maxTokens,
    temperature: params.temperature ?? config.ai.temperature,
    messages: [{ role: 'user', content: params.prompt }]
  });
  return response.content?.[0]?.text || '';
}

