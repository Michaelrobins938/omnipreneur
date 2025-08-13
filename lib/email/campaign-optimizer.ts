export interface OptimizedEmail {
  subject: string;
  content: string;
  optimizations: string[];
}

export function optimizeSubject(subject: string): string {
  const trimmed = subject.trim();
  if (!/[!?🚀🔥⭐]/.test(trimmed)) return `${trimmed} 🚀`;
  return trimmed;
}

export function optimizeBody(content: string): string {
  let updated = content;
  updated = updated.replace(/Click here/gi, 'Discover more');
  if (!/\bCTA\b|Call to Action/i.test(updated)) {
    updated += '\n\n— Clear Call to Action: Get started today →';
  }
  return updated;
}

export function optimizeEmail(subject: string, content: string): OptimizedEmail {
  const newSubject = optimizeSubject(subject);
  const newContent = optimizeBody(content);
  const optimizations: string[] = [];
  if (newSubject !== subject) optimizations.push('Subject line enhanced for urgency/novelty');
  if (newContent !== content) optimizations.push('Body copy refined for clarity and stronger CTA');
  optimizations.push('Personalization tokens recommended (e.g., {{first_name}})');
  return { subject: newSubject, content: newContent, optimizations };
}

