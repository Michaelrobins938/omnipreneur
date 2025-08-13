export interface NicheInsight {
  opportunityScore: number; // 0-100
  competitionLevel: 'low' | 'medium' | 'high';
  growthTrend: 'rising' | 'stable' | 'declining';
  keywords: string[];
}

export function analyzeMarket(niche: string): NicheInsight {
  const base = niche.length % 3;
  const opportunity = 60 + (10 - niche.length % 10);
  const competitionLevel = base === 0 ? 'low' : base === 1 ? 'medium' : 'high';
  const growthTrend = opportunity > 65 ? 'rising' : 'stable';
  const keywords = [niche, `${niche} tools`, `${niche} guide`, `${niche} tips`];
  return { opportunityScore: Math.max(0, Math.min(100, opportunity)), competitionLevel, growthTrend, keywords };
}

