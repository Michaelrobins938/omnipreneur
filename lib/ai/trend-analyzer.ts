import { chatComplete } from '@/lib/ai/openai';

export interface TrendData {
  topics: string[];
  hashtags: string[];
  sentiment: 'rising' | 'falling' | 'stable';
  confidence: number; // 0-1
}

export async function analyzeTrends(niche: string, platform: string = 'general'): Promise<TrendData> {
  // Best-effort AI enrichment; fallback to local heuristic
  try {
    const completion = await chatComplete({
      system: 'You are a trend analyst. Respond ONLY with valid JSON for keys topics[], hashtags[], sentiment, confidence (0-1).',
      user: `Provide trending topics and hashtags for the niche "${niche}" on platform "${platform}".`,
      temperature: 0.3,
      maxTokens: 400
    });
    const parsed = JSON.parse(completion || '{}');
    if (Array.isArray(parsed.topics) && Array.isArray(parsed.hashtags)) {
      return normalize(parsed);
    }
  } catch (_) {}
  return localHeuristic(niche, platform);
}

function normalize(data: any): TrendData {
  const sentiment = ['rising', 'falling', 'stable'].includes(String(data.sentiment)) ? data.sentiment : 'rising';
  const confidence = Math.max(0, Math.min(1, Number(data.confidence ?? 0.7)));
  return {
    topics: (data.topics || []).slice(0, 10).map((t: any) => String(t)).filter(Boolean),
    hashtags: (data.hashtags || []).slice(0, 15).map((h: any) => String(h).startsWith('#') ? String(h) : `#${String(h)}`).filter(Boolean),
    sentiment,
    confidence
  };
}

function localHeuristic(niche: string, platform: string): TrendData {
  const base = niche.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const words = base.split(' ').filter(Boolean);
  const root = words[0] || 'trend';
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();
  const topics = [
    `${root} tips ${month} ${year}`,
    `${root} tools ${year}`,
    `${root} beginner mistakes`,
    `${root} growth strategies`,
    `${root} myths vs facts`,
    `how to start with ${root}`,
    `${root} trends ${year}`
  ];
  const hashtags = [
    `#${root}`, `#${root}tips`, `#${root}${year}`, `#${platform}`, '#howto', '#guide', '#strategy', '#growth'
  ];
  return { topics, hashtags, sentiment: 'rising', confidence: 0.6 };
}

