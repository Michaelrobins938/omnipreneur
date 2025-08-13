export interface TextAnalysis {
  wordCount: number;
  readingTime: number; // minutes
  readabilityScore: number; // 0-100
  sentimentScore: number; // 0-100 (50 neutral)
  keyPhrases: string[];
}

export function analyzeText(content: string): TextAnalysis {
  const text = (content || '').trim();
  const words = text.length ? text.split(/\s+/).filter(Boolean) : [];
  const sentences = text.length ? text.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];

  const wordCount = words.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : wordCount;
  const readabilityScore = Math.max(0, Math.min(100, Math.round(100 - (avgWordsPerSentence * 2))));

  const keyPhrases = extractKeyPhrases(words);
  const sentimentScore = analyzeSentiment(words);

  return { wordCount, readingTime, readabilityScore, sentimentScore, keyPhrases };
}

function extractKeyPhrases(words: string[]): string[] {
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','up','about','into','through','during','before','after','above','below','between','among','this','that','these','those','you','your','yours','me','my','mine','we','our','ours','it','its','they','them','their','theirs'
  ]);
  const counts: Record<string, number> = {};
  for (const raw of words) {
    const w = raw.toLowerCase();
    if (w.length <= 3 || stopWords.has(w)) continue;
    counts[w] = (counts[w] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
}

function analyzeSentiment(words: string[]): number {
  const positive = new Set(['good','great','excellent','amazing','wonderful','fantastic','love','best','success','win','happy','growth']);
  const negative = new Set(['bad','terrible','awful','horrible','hate','worst','disappointing','fail','loss','sad','problem']);
  let score = 50; // neutral
  for (const wRaw of words) {
    const w = wRaw.toLowerCase();
    if (positive.has(w)) score += 5;
    if (negative.has(w)) score -= 5;
  }
  return Math.max(0, Math.min(100, score));
}

