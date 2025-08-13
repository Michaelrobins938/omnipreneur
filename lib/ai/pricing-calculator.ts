export interface PricingInput {
  individualTotal: number;
  productCount: number;
  goal: 'conversion' | 'aov' | 'retention';
}

export interface PricingSuggestion {
  bundlePrice: number;
  discountPercent: number;
  tiers: Array<{ name: string; price: number; contentsRatio: number }>;
}

export function suggestPricing(input: PricingInput): PricingSuggestion {
  const { individualTotal, productCount, goal } = input;
  const baseRatio = goal === 'conversion' ? 0.45 : goal === 'aov' ? 0.6 : 0.5;
  const bundlePrice = roundTo(individualTotal * baseRatio, 1);
  const discountPercent = Math.max(5, Math.min(90, Math.round((1 - (bundlePrice / individualTotal)) * 100)));
  const tiers = [
    { name: 'Basic', price: roundTo(bundlePrice * 0.7, 1), contentsRatio: 0.6 },
    { name: 'Pro', price: bundlePrice, contentsRatio: 1 },
    { name: 'Ultimate', price: roundTo(bundlePrice * 1.4, 1), contentsRatio: Math.min(1, 1 + (productCount > 5 ? 0.2 : 0.1)) }
  ];
  return { bundlePrice, discountPercent, tiers };
}

function roundTo(value: number, precision = 1): number {
  const p = Math.pow(10, precision);
  return Math.round(value * p) / p;
}

