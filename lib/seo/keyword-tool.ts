export interface KeywordSuggestion {
  keyword: string;
  difficulty: number; // 0-100
  volume: number; // searches/mo
  opportunity: number; // 0-100 composite
}

export function suggestKeywords(seed: string, count = 10): KeywordSuggestion[] {
  const base = seed.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const words = base.split(' ').filter(Boolean);
  const root = words[0] || 'ai';
  const variants = [
    `${root} tools`, `${root} guide`, `${root} tutorial`, `${root} best practices`, `${root} checklist`,
    `${root} for beginners`, `${root} advanced`, `${root} course`, `${root} examples`, `${root} ideas`
  ];
  return variants.slice(0, count).map((kw, i) => {
    const volume = 500 + i * 120 + Math.floor(Math.random() * 200);
    const difficulty = Math.min(100, 30 + i * 5 + Math.floor(Math.random() * 10));
    const opportunity = Math.max(0, Math.min(100, Math.round((volume / (difficulty + 20)) * 10)));
    return { keyword: kw, difficulty, volume, opportunity };
  });
}

