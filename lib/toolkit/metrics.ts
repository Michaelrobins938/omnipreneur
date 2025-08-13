export function calculateReadability(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const avgSentenceLength = words.length / sentences.length;
  const complexWords = words.filter(word => word.length > 6).length;
  const complexWordRatio = complexWords / words.length;
  
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * complexWordRatio);
  return Math.max(0, Math.min(100, score));
}

export function calculateStructure(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const lineBreaks = (text.match(/\n/g) || []).length;
  const bulletPoints = (text.match(/[-*•]/g) || []).length;
  const numberedLists = (text.match(/\d+\./g) || []).length;
  const sections = (text.match(/^[#*]+\s+/gm) || []).length;
  
  let score = 0;
  score += Math.min(30, lineBreaks * 5);
  score += Math.min(20, bulletPoints * 4);
  score += Math.min(20, numberedLists * 4);
  score += Math.min(30, sections * 10);
  
  return Math.min(100, score);
}

export function calculateSafety(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const safetyKeywords = [
    'ethical', 'bias', 'inclusive', 'respectful', 'accurate', 
    'evidence', 'verified', 'reliable', 'harmful', 'unsafe',
    'appropriate', 'consent', 'privacy', 'confidential'
  ];
  
  const matches = safetyKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(text)
  ).length;
  
  return Math.min(100, matches * 10);
}

export function calculateTokenCount(text: string): number {
  if (!text || text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}

export function calculateTokenDeltaPct(original: string, result: string): number {
  const originalTokens = calculateTokenCount(original);
  const resultTokens = calculateTokenCount(result);
  
  if (originalTokens === 0) return 0;
  
  return ((resultTokens - originalTokens) / originalTokens) * 100;
}

export function calculateCoverage(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  
  const lowerText = text.toLowerCase();
  const matchedKeywords = keywords.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  return (matchedKeywords.length / keywords.length) * 100;
}

export function calculateCompliance(text: string): number {
  const compliancePatterns = [
    /\b(must|required|mandatory|shall)\b/gi,
    /\b(guideline|regulation|standard|policy)\b/gi,
    /\b(compliant|accordance|conform)\b/gi
  ];
  
  let score = 0;
  compliancePatterns.forEach(pattern => {
    const matches = (text.match(pattern) || []).length;
    score += Math.min(25, matches * 5);
  });
  
  return Math.min(100, score);
}

export function calculateSentimentScore(text: string): number {
  if (!text || text.length === 0) return 50; // Neutral baseline
  
  const positiveWords = [
    'excellent', 'amazing', 'fantastic', 'great', 'wonderful', 'outstanding',
    'brilliant', 'superb', 'perfect', 'awesome', 'incredible', 'marvelous',
    'love', 'enjoy', 'happy', 'excited', 'thrilled', 'delighted', 'pleased',
    'satisfied', 'success', 'achievement', 'victory', 'triumph', 'benefit',
    'advantage', 'opportunity', 'valuable', 'helpful', 'useful', 'effective'
  ];
  
  const negativeWords = [
    'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing',
    'frustrating', 'annoying', 'difficult', 'impossible', 'failure',
    'problem', 'issue', 'concern', 'worry', 'fear', 'hate', 'dislike',
    'angry', 'upset', 'sad', 'depressed', 'confused', 'lost', 'stuck',
    'broken', 'wrong', 'error', 'mistake', 'disadvantage', 'useless'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
    if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) return 50; // Neutral
  
  const sentiment = (positiveCount / totalSentimentWords) * 100;
  return Math.max(0, Math.min(100, sentiment));
}

export function calculateSEOScore(text: string, keywords: string[] = []): number {
  if (!text || text.length === 0) return 0;
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Title optimization (H1 tags)
  const h1Count = (text.match(/^#\s/gm) || []).length;
  if (h1Count === 1) score += 20;
  else if (h1Count > 1) score += 10;
  
  // Header structure (H2, H3 tags)
  const h2Count = (text.match(/^##\s/gm) || []).length;
  const h3Count = (text.match(/^###\s/gm) || []).length;
  if (h2Count > 0) score += 15;
  if (h3Count > 0) score += 10;
  
  // Content length (optimal 300-2000 words)
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 300 && wordCount <= 2000) score += 20;
  else if (wordCount > 2000) score += 15;
  else if (wordCount >= 150) score += 10;
  
  // Keyword optimization
  if (keywords.length > 0) {
    const keywordDensity = calculateKeywordDensity(text, keywords);
    if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
    else if (keywordDensity > 0) score += 10;
  }
  
  // Internal structure
  const bulletPoints = (text.match(/[-*•]/g) || []).length;
  const numberedLists = (text.match(/\d+\./g) || []).length;
  if (bulletPoints > 0 || numberedLists > 0) score += 15;
  
  return Math.min(100, score);
}

export function calculateKeywordDensity(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  let keywordCount = 0;
  
  keywords.forEach(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    if (keywordWords.length === 1) {
      keywordCount += words.filter(word => word.includes(keywordWords[0])).length;
    } else {
      // Multi-word keyword search
      const keywordPhrase = keywordWords.join(' ');
      const textStr = words.join(' ');
      const matches = (textStr.match(new RegExp(keywordPhrase, 'g')) || []).length;
      keywordCount += matches;
    }
  });
  
  return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
}

export function calculateGrammarScore(text: string): number {
  if (!text || text.length === 0) return 0;
  
  let score = 100;
  
  // Check for common grammar issues
  const grammarIssues = [
    /\b(their|there|they're)\s+(are|is)\b/gi, // Common their/there/they're errors
    /\b(your|you're)\s+(are|is)\b/gi,         // Your/you're errors
    /\b(its|it's)\s+(a|an|the)\b/gi,         // Its/it's errors
    /[.!?]\s*[a-z]/g,                         // Sentences not starting with capital
    /\s{2,}/g,                                // Multiple spaces
    /[,;:]\s*[A-Z]/g,                         // Improper capitalization after punctuation
  ];
  
  grammarIssues.forEach(pattern => {
    const matches = (text.match(pattern) || []).length;
    score -= matches * 5; // Deduct 5 points per issue
  });
  
  // Check sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(/\s+/).length, 0) / sentences.length;
  
  if (avgSentenceLength > 30) score -= 10; // Very long sentences
  if (avgSentenceLength < 5) score -= 10;  // Very short sentences
  
  return Math.max(0, Math.min(100, score));
}

export function calculateEngagementPrediction(text: string, platform: string = 'general'): number {
  if (!text || text.length === 0) return 0;
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Engagement triggers
  const engagementTriggers = [
    'how to', 'why', 'what', 'when', 'where', 'tips', 'secrets', 'guide',
    'tutorial', 'step by step', 'beginner', 'expert', 'professional',
    'ultimate', 'complete', 'comprehensive', 'essential', 'must-know'
  ];
  
  engagementTriggers.forEach(trigger => {
    if (lowerText.includes(trigger)) score += 5;
  });
  
  // Emotional hooks
  const emotionalHooks = [
    'amazing', 'incredible', 'shocking', 'surprising', 'unbelievable',
    'life-changing', 'game-changing', 'revolutionary', 'breakthrough'
  ];
  
  emotionalHooks.forEach(hook => {
    if (lowerText.includes(hook)) score += 8;
  });
  
  // Platform-specific optimization
  switch (platform) {
    case 'instagram':
      if (text.includes('#')) score += 10;
      if (text.length <= 2200) score += 15; // Optimal Instagram length
      break;
    case 'twitter':
      if (text.length <= 280) score += 20; // Twitter character limit
      if (text.includes('@') || text.includes('#')) score += 10;
      break;
    case 'linkedin':
      if (text.length >= 1000 && text.length <= 3000) score += 15;
      if (lowerText.includes('professional') || lowerText.includes('business')) score += 10;
      break;
    case 'tiktok':
      if (text.includes('#')) score += 15;
      if (lowerText.includes('trending') || lowerText.includes('viral')) score += 10;
      break;
    case 'youtube':
      if (text.includes('subscribe') || text.includes('like')) score += 10;
      if (text.length >= 1000) score += 15; // Longer descriptions perform better
      break;
  }
  
  // Call-to-action presence
  const ctaWords = ['click', 'subscribe', 'follow', 'share', 'comment', 'like', 'buy', 'get', 'download'];
  if (ctaWords.some(cta => lowerText.includes(cta))) score += 15;
  
  return Math.min(100, score);
}

export function calculateViralPotential(text: string): number {
  if (!text || text.length === 0) return 0;
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Viral content characteristics
  const viralTriggers = [
    'breaking', 'exclusive', 'first time', 'never seen', 'leaked',
    'behind the scenes', 'secret', 'hidden', 'exposed', 'revealed',
    'shocking', 'unbelievable', 'insane', 'mind-blowing', 'crazy'
  ];
  
  viralTriggers.forEach(trigger => {
    if (lowerText.includes(trigger)) score += 10;
  });
  
  // Trending topics indicators
  const trendingIndicators = [
    'trending', 'viral', 'hot', 'popular', 'everyone is talking',
    'latest', 'new', 'just dropped', 'now', 'today'
  ];
  
  trendingIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) score += 8;
  });
  
  // Shareability factors
  const shareabilityFactors = [
    'share', 'tell your friends', 'spread the word', 'pass it on',
    'you have to see this', 'check this out', 'omg', 'wow'
  ];
  
  shareabilityFactors.forEach(factor => {
    if (lowerText.includes(factor)) score += 12;
  });
  
  // Content structure for virality
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const questionCount = (text.match(/\?/g) || []).length;
  const exclamationCount = (text.match(/!/g) || []).length;
  
  if (questionCount > 0) score += 5; // Questions engage
  if (exclamationCount > 1) score += 10; // Excitement
  if (sentences.length >= 3 && sentences.length <= 10) score += 15; // Optimal length
  
  return Math.min(100, score);
}