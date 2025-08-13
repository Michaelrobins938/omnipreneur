import OpenAI from 'openai';
import { config } from '@/lib/config';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (client) return client;
  if (!config.ai.openaiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  client = new OpenAI({ apiKey: config.ai.openaiKey });
  return client;
}

export async function chatComplete(params: {
  system?: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const api = getOpenAI();
  const response = await api.chat.completions.create({
    model: params.model || config.ai.defaultModel,
    temperature: params.temperature ?? config.ai.temperature,
    max_tokens: params.maxTokens ?? config.ai.maxTokens,
    messages: [
      ...(params.system ? [{ role: 'system' as const, content: params.system }] : []),
      { role: 'user' as const, content: params.user }
    ]
  });
  return response.choices?.[0]?.message?.content || '';
}

