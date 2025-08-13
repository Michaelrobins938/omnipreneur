export interface ValidationSignals {
  searchVolume: number; // 0..100k
  competition: number; // 0..100
  cpc: number; // $ per click
}

export function validateOpportunity(signals: ValidationSignals) {
  const volumeScore = Math.min(100, Math.round((signals.searchVolume / 1000)));
  const competitionPenalty = Math.round(signals.competition * 0.5);
  const cpcBoost = Math.min(20, Math.round(signals.cpc));
  const score = Math.max(0, Math.min(100, volumeScore - competitionPenalty + cpcBoost));
  const recommendation = score >= 70 ? 'Strong opportunity' : score >= 50 ? 'Promising with differentiation' : 'Consider niche pivot';
  return { score, recommendation };
}

