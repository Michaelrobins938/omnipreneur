export function summarizeTime(byCategory: Record<string, number>) {
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0);
  const breakdown = Object.entries(byCategory).map(([k, v]) => ({ category: k, seconds: v, percent: total ? Math.round((v / total) * 1000) / 10 : 0 }));
  const recommendation = breakdown.find(b => b.category === 'MEETINGS' && b.percent > 25)
    ? 'Reduce meeting time below 25% to improve productivity'
    : 'Time allocation looks healthy';
  return { totalSeconds: total, breakdown, recommendation };
}

