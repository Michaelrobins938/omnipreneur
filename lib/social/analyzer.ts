export interface SocialInsights {
  bestTimes: string[];
  recommendedHashtags: string[];
  contentTips: string[];
}

export function analyzeSocialPerformance(platform: string): SocialInsights {
  const bestTimes = platform === 'instagram' ? ['Tue 11:00', 'Thu 14:00'] : ['Wed 10:00', 'Fri 13:00'];
  const recommendedHashtags = ['#productivity', '#ai', '#growth'];
  const contentTips = [
    'Lead with a strong hook in the first line',
    'Use 1-2 line paragraphs for scannability',
    'Add a clear CTA and one ask per post'
  ];
  return { bestTimes, recommendedHashtags, contentTips };
}

