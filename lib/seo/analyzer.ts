export interface SeoIssue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  category: 'technical' | 'content' | 'onpage' | 'performance';
  title: string;
  detail: string;
  recommendation: string;
}

export interface SeoAuditResult {
  overallScore: number; // 0-100
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  issues: SeoIssue[];
}

export function auditHtml(html: string): SeoAuditResult {
  const issues: SeoIssue[] = [];
  let technical = 90;
  let content = 80;
  let performance = 85;

  if (!/<title>.*?<\/title>/i.test(html)) {
    issues.push({
      id: 'missing_title',
      severity: 'high',
      category: 'onpage',
      title: 'Missing <title> tag',
      detail: 'No <title> tag found in the document head.',
      recommendation: 'Add a concise, keyword-rich <title> (50–60 chars).'
    });
    content -= 20;
  }
  const metaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i);
  if (!metaDesc) {
    issues.push({
      id: 'missing_meta_description',
      severity: 'medium',
      category: 'onpage',
      title: 'Missing meta description',
      detail: 'No meta description found.',
      recommendation: 'Add a compelling meta description (140–160 chars).'
    });
    content -= 10;
  } else if ((metaDesc[1] || '').length < 80) {
    issues.push({
      id: 'short_meta_description',
      severity: 'low',
      category: 'onpage',
      title: 'Short meta description',
      detail: 'Meta description appears too short.',
      recommendation: 'Expand to 140–160 characters for better CTR.'
    });
    content -= 5;
  }

  const h1s = html.match(/<h1[^>]*>/gi) || [];
  if (h1s.length !== 1) {
    issues.push({
      id: 'h1_count',
      severity: h1s.length === 0 ? 'high' : 'medium',
      category: 'content',
      title: 'H1 heading issues',
      detail: `Found ${h1s.length} <h1> tags; expected exactly 1.`,
      recommendation: 'Use exactly one <h1> summarizing the page topic.'
    });
    content -= 10;
  }

  if (!/alt="[^"]+"/i.test(html)) {
    issues.push({
      id: 'missing_alt',
      severity: 'medium',
      category: 'content',
      title: 'Images missing alt attributes',
      detail: 'Some images may not have alt text.',
      recommendation: 'Provide descriptive alt text for all images.'
    });
    content -= 5;
  }

  if (/<script[^>]*>[^<]*eval\(/i.test(html)) {
    issues.push({
      id: 'eval_usage',
      severity: 'low',
      category: 'technical',
      title: 'Use of eval in scripts',
      detail: 'eval() can harm performance and security.',
      recommendation: 'Avoid eval; use safer alternatives.'
    });
    technical -= 5;
  }

  // Rough performance proxy: inline CSS or large HTML length
  if (html.length > 500_000) {
    issues.push({
      id: 'large_html',
      severity: 'medium',
      category: 'performance',
      title: 'Large HTML document',
      detail: `HTML size is ${(html.length / 1024).toFixed(1)} KB.`,
      recommendation: 'Minify HTML, split content, or load progressively.'
    });
    performance -= 10;
  }

  const overall = Math.max(0, Math.min(100, Math.round((technical * 0.35 + content * 0.45 + performance * 0.2))));
  return {
    overallScore: overall,
    technicalScore: Math.max(0, technical),
    contentScore: Math.max(0, content),
    performanceScore: Math.max(0, performance),
    issues
  };
}

