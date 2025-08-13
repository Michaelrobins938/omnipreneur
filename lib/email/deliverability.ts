export interface DeliverabilityCheck {
  spamScore: number; // 0..1, lower is better
  issues: string[];
  recommendations: string[];
}

export function checkDeliverability(subject: string, content: string): DeliverabilityCheck {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let spamScore = 0.1;

  if ((subject.match(/FREE|WIN|GUARANTEED/gi) || []).length > 0) {
    issues.push('Subject contains spam trigger words');
    spamScore += 0.2;
    recommendations.push('Avoid all-caps and spammy terms in subject');
  }
  if (content.length > 5000) {
    issues.push('Email body is very long');
    spamScore += 0.1;
    recommendations.push('Keep content concise for better deliverability');
  }
  if (!/unsubscribe|opt[- ]?out/i.test(content)) {
    issues.push('Missing unsubscribe language');
    spamScore += 0.2;
    recommendations.push('Add unsubscribe/opt-out instructions');
  }

  spamScore = Math.min(1, Math.max(0, spamScore));
  return { spamScore, issues, recommendations };
}

