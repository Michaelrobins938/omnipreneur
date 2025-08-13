export function dynamicPricing(basePrice: number, competitorPrice?: number) {
  let suggested = basePrice;
  if (competitorPrice && competitorPrice > 0) {
    suggested = Math.max(0, Math.round((competitorPrice * 0.98) * 100) / 100);
  }
  const strategy = competitorPrice ? 'Competitive undercut (2%)' : 'Value-based pricing';
  return { suggested, strategy };
}

