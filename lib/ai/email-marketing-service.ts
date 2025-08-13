import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface EmailCampaignRequest {
  campaignType: 'welcome' | 'promotional' | 'newsletter' | 'abandoned-cart' | 'win-back' | 'transactional';
  subject?: string;
  audience: {
    segment?: string;
    interests?: string[];
    demographics?: {
      age?: string;
      location?: string;
      gender?: string;
    };
  };
  product?: string;
  tone: 'professional' | 'casual' | 'friendly' | 'urgent' | 'exclusive';
  goal: 'sales' | 'engagement' | 'retention' | 'education' | 'awareness';
  personalization?: {
    firstName?: boolean;
    companyName?: boolean;
    customFields?: string[];
  };
  emailCount?: number;
}

export interface EmailContent {
  subject: string;
  preheader: string;
  body: {
    html: string;
    text: string;
  };
  cta: {
    text: string;
    position: 'top' | 'middle' | 'bottom';
  };
  personalizationTokens: string[];
  estimatedReadTime: number;
  spamScore: number;
}

export interface EmailSequence {
  emails: EmailContent[];
  timing: Array<{
    emailIndex: number;
    sendAfter: string; // e.g., "immediately", "1 day", "3 days"
    condition?: string;
  }>;
  performance: {
    expectedOpenRate: number;
    expectedClickRate: number;
    expectedConversionRate: number;
  };
}

export class EmailMarketingService extends BaseAIService {
  constructor(config?: AIServiceConfig) {
    super(config || { provider: 'openai', model: 'gpt-4-turbo-preview' });
  }

  async process(request: EmailCampaignRequest): Promise<{
    sequence: EmailSequence;
    analytics: {
      subjectLineScore: number;
      readabilityScore: number;
      engagementScore: number;
      mobileOptimization: number;
    };
    recommendations: string[];
    abTestSuggestions: Array<{
      element: string;
      variations: string[];
      expectedImpact: string;
    }>;
  }> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);
    
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    
    if (!response.success || !response.content) {
      // Fallback to template-based generation
      return this.generateTemplateBasedEmails(request);
    }
    
    try {
      const parsed = JSON.parse(response.content);
      const sequence = this.processAIResponse(parsed, request);
      
      return {
        sequence,
        analytics: this.analyzeEmailQuality(sequence),
        recommendations: this.generateRecommendations(sequence, request),
        abTestSuggestions: this.generateABTestSuggestions(sequence, request)
      };
    } catch (error) {
      return this.generateTemplateBasedEmails(request);
    }
  }

  private buildSystemPrompt(request: EmailCampaignRequest): string {
    return `You are an expert email marketing strategist specializing in high-converting email campaigns.

Your expertise includes:
1. Writing compelling subject lines with high open rates
2. Creating engaging email copy that drives action
3. Personalization and segmentation strategies
4. A/B testing and optimization
5. Compliance with email marketing laws (CAN-SPAM, GDPR)
6. Mobile optimization and responsive design

Campaign Context:
- Campaign Type: ${request.campaignType}
- Target Audience: ${request.audience.segment || 'General subscribers'}
- Goal: ${request.goal}
- Tone: ${request.tone}

Email Best Practices:
- Subject lines: 30-50 characters for mobile optimization
- Preheader text: 40-100 characters to complement subject
- Clear, single CTA above the fold
- Scannable content with short paragraphs
- Mobile-first design approach
- Personalization beyond just name

For each email, provide:
1. Compelling subject line (with 2 alternatives for A/B testing)
2. Preheader text
3. Email body (both HTML structure and plain text)
4. Clear call-to-action
5. Personalization tokens used

Return as JSON with structure matching the email sequence format.`;
  }

  private buildUserPrompt(request: EmailCampaignRequest): string {
    let prompt = `Create a ${request.campaignType} email campaign with ${request.emailCount || 1} email(s).\n\n`;
    
    prompt += `Campaign Details:\n`;
    prompt += `- Goal: ${request.goal}\n`;
    prompt += `- Tone: ${request.tone}\n`;
    
    if (request.product) {
      prompt += `- Product/Service: ${request.product}\n`;
    }
    
    if (request.audience.segment) {
      prompt += `- Audience Segment: ${request.audience.segment}\n`;
    }
    
    if (request.audience.interests && request.audience.interests.length > 0) {
      prompt += `- Interests: ${request.audience.interests.join(', ')}\n`;
    }
    
    if (request.subject) {
      prompt += `- Suggested Subject: ${request.subject}\n`;
    }
    
    prompt += `\nCreate compelling emails that drive ${request.goal} with clear CTAs and strong value propositions.`;
    
    return prompt;
  }

  private processAIResponse(parsed: any, request: EmailCampaignRequest): EmailSequence {
    const emails: EmailContent[] = [];
    
    if (parsed.emails && Array.isArray(parsed.emails)) {
      parsed.emails.forEach((email: any) => {
        emails.push({
          subject: email.subject || this.generateSubjectLine(request),
          preheader: email.preheader || this.generatePreheader(email.subject || '', request),
          body: {
            html: email.html || this.generateHTMLBody(email.body || '', request),
            text: email.text || this.stripHTML(email.body || '')
          },
          cta: {
            text: email.cta?.text || this.generateCTA(request),
            position: email.cta?.position || 'middle'
          },
          personalizationTokens: this.extractPersonalizationTokens(email.body || ''),
          estimatedReadTime: this.calculateReadTime(email.body || ''),
          spamScore: this.calculateSpamScore(email.subject || '', email.body || '')
        });
      });
    }
    
    // If no emails from AI, generate based on campaign type
    if (emails.length === 0) {
      const emailCount = request.emailCount || this.getDefaultEmailCount(request.campaignType);
      for (let i = 0; i < emailCount; i++) {
        emails.push(this.generateEmail(request, i));
      }
    }
    
    return {
      emails,
      timing: this.generateTiming(request.campaignType, emails.length),
      performance: this.estimatePerformance(request)
    };
  }

  private generateTemplateBasedEmails(request: EmailCampaignRequest) {
    const emailCount = request.emailCount || this.getDefaultEmailCount(request.campaignType);
    const emails: EmailContent[] = [];
    
    for (let i = 0; i < emailCount; i++) {
      emails.push(this.generateEmail(request, i));
    }
    
    const sequence: EmailSequence = {
      emails,
      timing: this.generateTiming(request.campaignType, emails.length),
      performance: this.estimatePerformance(request)
    };
    
    return {
      sequence,
      analytics: this.analyzeEmailQuality(sequence),
      recommendations: this.generateRecommendations(sequence, request),
      abTestSuggestions: this.generateABTestSuggestions(sequence, request)
    };
  }

  private generateEmail(request: EmailCampaignRequest, index: number): EmailContent {
    const templates = this.getEmailTemplates(request.campaignType);
    const template = templates[Math.min(index, templates.length - 1)];
    
    const subject = this.generateSubjectLine(request);
    const body = this.personalizeTemplate(template?.body || '', request);
    
    return {
      subject,
      preheader: this.generatePreheader(subject, request),
      body: {
        html: this.generateHTMLBody(body, request),
        text: this.stripHTML(body)
      },
      cta: {
        text: this.generateCTA(request),
        position: 'middle'
      },
      personalizationTokens: this.extractPersonalizationTokens(body),
      estimatedReadTime: this.calculateReadTime(body),
      spamScore: this.calculateSpamScore(subject, body)
    };
  }

  private generateSubjectLine(request: EmailCampaignRequest): string {
    const subjectTemplates: Record<string, string[]> = {
      welcome: [
        'Welcome to {{company}}! Here\'s your exclusive gift 🎁',
        '{{firstName}}, you\'re in! Let\'s get started',
        'Welcome aboard! Your journey begins now',
        'Thanks for joining us, {{firstName}}!'
      ],
      promotional: [
        '⏰ Last chance: {{discount}}% off ends tonight',
        '{{firstName}}, your exclusive offer inside',
        'Flash Sale: Save {{discount}}% on {{product}}',
        'Don\'t miss out - {{offer}} expires soon'
      ],
      newsletter: [
        'Your {{month}} digest: Top stories & updates',
        '{{company}} Newsletter: {{topic}} insights',
        'This week\'s must-reads for {{audience}}',
        '5 things you need to know this {{day}}'
      ],
      'abandoned-cart': [
        '{{firstName}}, you left something behind',
        'Your cart is waiting ({{discount}}% off inside)',
        'Complete your order & save {{amount}}',
        'Still thinking? Here\'s 10% off to help decide'
      ],
      'win-back': [
        'We miss you, {{firstName}} (special offer inside)',
        'It\'s been a while - here\'s {{discount}}% off',
        'Come back to {{company}} - exclusive deal for you',
        '{{firstName}}, let\'s reconnect (gift inside)'
      ],
      transactional: [
        'Your order #{{orderNumber}} confirmation',
        'Important: Action required for your account',
        'Password reset requested',
        'Your {{product}} is on its way!'
      ]
    };
    
    const templates = subjectTemplates[request.campaignType] || subjectTemplates['promotional'];
    let subject = templates?.[Math.floor(Math.random() * (templates?.length || 1))] || 'Newsletter Update';
    
    // Replace placeholders
    subject = (subject || '')
      .replace('{{firstName}}', request.personalization?.firstName ? '{{firstName}}' : 'Friend')
      .replace('{{company}}', '{{company}}')
      .replace('{{discount}}', String(Math.floor(Math.random() * 30) + 10))
      .replace('{{product}}', request.product || 'our products')
      .replace('{{month}}', new Date().toLocaleString('default', { month: 'long' }))
      .replace('{{day}}', new Date().toLocaleString('default', { weekday: 'long' }));
    
    return subject;
  }

  private generatePreheader(subject: string, request: EmailCampaignRequest): string {
    const preheaderTemplates = [
      'Plus: {{benefit}} when you act today',
      'Exclusive for our {{segment}} subscribers',
      'Limited time only - {{urgency}}',
      'See what\'s inside →',
      'You won\'t want to miss this'
    ];
    
    let preheader = preheaderTemplates[Math.floor(Math.random() * preheaderTemplates.length)];
    
    preheader = (preheader || '')
      .replace('{{benefit}}', 'free shipping')
      .replace('{{segment}}', request.audience.segment || 'valued')
      .replace('{{urgency}}', '24 hours left');
    
    return preheader;
  }

  private generateHTMLBody(content: string, request: EmailCampaignRequest): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px 0; }
    .cta-button { 
      display: inline-block; 
      padding: 12px 30px; 
      background: #007bff; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px;
      font-weight: bold;
    }
    .footer { 
      margin-top: 40px; 
      padding-top: 20px; 
      border-top: 1px solid #ddd; 
      font-size: 12px; 
      color: #666; 
    }
    @media only screen and (max-width: 600px) {
      .container { padding: 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #333;">{{company}}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© {{year}} {{company}}. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a> | <a href="{{preferences_link}}">Update Preferences</a></p>
    </div>
  </div>
</body>
</html>`;
  }

  private generateCTA(request: EmailCampaignRequest): string {
    const ctaTemplates: Record<string, string[]> = {
      sales: ['Shop Now', 'Get {{discount}}% Off', 'Claim Your Discount', 'Buy Now'],
      engagement: ['Read More', 'Learn More', 'Explore Now', 'Discover More'],
      retention: ['Come Back', 'Rejoin Us', 'Reactivate Account', 'See What\'s New'],
      education: ['Start Learning', 'Watch Tutorial', 'Download Guide', 'Get Started'],
      awareness: ['Find Out More', 'See Details', 'Learn Why', 'Discover How']
    };
    
    const templates = ctaTemplates[request.goal] || ctaTemplates['engagement'];
    let cta = templates?.[Math.floor(Math.random() * (templates?.length || 1))] || 'Learn More';
    
    cta = (cta || '').replace('{{discount}}', String(Math.floor(Math.random() * 30) + 10));
    
    return cta;
  }

  private getEmailTemplates(campaignType: string): Array<{ subject: string; body: string }> {
    const templates: Record<string, Array<{ subject: string; body: string }>> = {
      welcome: [
        {
          subject: 'Welcome!',
          body: `<h2>Welcome to {{company}}, {{firstName}}!</h2>
<p>We're thrilled to have you join our community of {{audience}}.</p>
<p>As a welcome gift, here's <strong>15% off</strong> your first purchase:</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{cta_link}}" class="cta-button">Shop Now with 15% Off</a>
</p>
<p>Over the next few days, we'll send you tips to get the most out of {{product}}.</p>
<p>If you have any questions, just reply to this email!</p>`
        }
      ],
      promotional: [
        {
          subject: 'Special Offer',
          body: `<h2>Exclusive Offer for {{firstName}}</h2>
<p>For the next 48 hours only, get <strong>{{discount}}% off</strong> everything!</p>
<p>This special discount is our way of saying thank you for being a valued customer.</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{cta_link}}" class="cta-button">Shop with {{discount}}% Off</a>
</p>
<p>No code needed - discount automatically applied at checkout.</p>`
        }
      ],
      newsletter: [
        {
          subject: 'Newsletter',
          body: `<h2>Your {{month}} Update</h2>
<p>Here's what's new this month:</p>
<ul>
  <li><strong>New Feature:</strong> {{feature_announcement}}</li>
  <li><strong>Success Story:</strong> How {{customer}} achieved {{result}}</li>
  <li><strong>Pro Tip:</strong> {{tip}}</li>
</ul>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{cta_link}}" class="cta-button">Read Full Newsletter</a>
</p>`
        }
      ]
    };
    
    return templates[campaignType] || templates['promotional'] || [];
  }

  private personalizeTemplate(template: string, request: EmailCampaignRequest): string {
    let personalized = template;
    
    if (request.personalization?.firstName) {
      personalized = personalized.replace(/\{\{firstName\}\}/g, '{{firstName}}');
    } else {
      personalized = personalized.replace(/\{\{firstName\}\}/g, 'there');
    }
    
    if (request.personalization?.companyName) {
      personalized = personalized.replace(/\{\{company\}\}/g, '{{company}}');
    }
    
    personalized = personalized
      .replace(/\{\{product\}\}/g, request.product || 'our services')
      .replace(/\{\{audience\}\}/g, request.audience.segment || 'customers')
      .replace(/\{\{month\}\}/g, new Date().toLocaleString('default', { month: 'long' }))
      .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
    
    return personalized;
  }

  private stripHTML(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractPersonalizationTokens(content: string): string[] {
    const tokens = content.match(/\{\{[^}]+\}\}/g) || [];
    return [...new Set(tokens)];
  }

  private calculateReadTime(content: string): number {
    const words = this.stripHTML(content).split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed
  }

  private calculateSpamScore(subject: string, body: string): number {
    let score = 0;
    const content = (subject + ' ' + body).toLowerCase();
    
    // Spam trigger words
    const spamWords = ['free', 'guarantee', 'winner', 'cash', 'urgent', 'act now', 'limited time', 'click here', 'buy now', 'discount'];
    spamWords.forEach(word => {
      if (content.includes(word)) score += 10;
    });
    
    // Excessive caps
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.3) score += 20;
    
    // Excessive punctuation
    if (content.includes('!!!') || content.includes('$$$')) score += 15;
    
    return Math.min(100, score);
  }

  private getDefaultEmailCount(campaignType: string): number {
    const counts: Record<string, number> = {
      welcome: 3,
      promotional: 1,
      newsletter: 1,
      'abandoned-cart': 3,
      'win-back': 2,
      transactional: 1
    };
    return counts[campaignType] || 1;
  }

  private generateTiming(campaignType: string, emailCount: number): Array<{
    emailIndex: number;
    sendAfter: string;
    condition?: string;
  }> {
    const timingTemplates: Record<string, Array<{ emailIndex: number; sendAfter: string; condition?: string }>> = {
      welcome: [
        { emailIndex: 0, sendAfter: 'immediately' },
        { emailIndex: 1, sendAfter: '1 day' },
        { emailIndex: 2, sendAfter: '3 days' }
      ],
      'abandoned-cart': [
        { emailIndex: 0, sendAfter: '1 hour' },
        { emailIndex: 1, sendAfter: '24 hours', condition: 'not_purchased' },
        { emailIndex: 2, sendAfter: '72 hours', condition: 'not_purchased' }
      ],
      'win-back': [
        { emailIndex: 0, sendAfter: '30 days inactive' },
        { emailIndex: 1, sendAfter: '45 days inactive', condition: 'not_reactivated' }
      ]
    };
    
    const template = timingTemplates[campaignType];
    if (template) return template.slice(0, emailCount);
    
    // Default timing
    return Array.from({ length: emailCount }, (_, i) => ({
      emailIndex: i,
      sendAfter: i === 0 ? 'immediately' : `${i} day${i > 1 ? 's' : ''}`
    }));
  }

  private estimatePerformance(request: EmailCampaignRequest): {
    expectedOpenRate: number;
    expectedClickRate: number;
    expectedConversionRate: number;
  } {
    // Industry averages with adjustments
    let openRate = 20;
    let clickRate = 2.5;
    let conversionRate = 1;
    
    // Campaign type adjustments
    const campaignMultipliers: Record<string, { open: number; click: number; conversion: number }> = {
      welcome: { open: 1.5, click: 2, conversion: 1.5 },
      promotional: { open: 0.9, click: 1.2, conversion: 1.3 },
      newsletter: { open: 1.1, click: 0.8, conversion: 0.7 },
      'abandoned-cart': { open: 1.3, click: 1.5, conversion: 2 },
      'win-back': { open: 0.8, click: 1.1, conversion: 1.2 },
      transactional: { open: 2, click: 1.5, conversion: 0.5 }
    };
    
    const multipliers = campaignMultipliers[request.campaignType] || { open: 1, click: 1, conversion: 1 };
    
    openRate *= multipliers.open;
    clickRate *= multipliers.click;
    conversionRate *= multipliers.conversion;
    
    // Personalization boost
    if (request.personalization?.firstName) {
      openRate *= 1.2;
    }
    
    // Audience segment adjustments
    if (request.audience.segment?.includes('engaged') || request.audience.segment?.includes('loyal')) {
      openRate *= 1.3;
      clickRate *= 1.5;
    }
    
    return {
      expectedOpenRate: Math.min(50, openRate),
      expectedClickRate: Math.min(10, clickRate),
      expectedConversionRate: Math.min(5, conversionRate)
    };
  }

  private analyzeEmailQuality(sequence: EmailSequence): {
    subjectLineScore: number;
    readabilityScore: number;
    engagementScore: number;
    mobileOptimization: number;
  } {
    let subjectLineScore = 0;
    let readabilityScore = 0;
    let engagementScore = 0;
    let mobileOptimization = 0;
    
    sequence.emails.forEach(email => {
      // Subject line scoring
      if (email.subject.length >= 30 && email.subject.length <= 50) subjectLineScore += 20;
      if (email.subject.includes('{{firstName}}')) subjectLineScore += 10;
      if (!/[A-Z]{3,}/.test(email.subject)) subjectLineScore += 10; // No excessive caps
      
      // Readability
      const avgSentenceLength = email.body.text.split('.').filter(s => s.trim()).map(s => s.split(' ').length);
      const avgWords = avgSentenceLength.reduce((a, b) => a + b, 0) / avgSentenceLength.length;
      if (avgWords < 20) readabilityScore += 20;
      
      // Engagement
      if (email.cta.text) engagementScore += 20;
      if (email.personalizationTokens.length > 1) engagementScore += 10;
      
      // Mobile optimization
      if (email.subject.length <= 40) mobileOptimization += 20;
      if (email.preheader.length <= 100) mobileOptimization += 10;
    });
    
    const emailCount = sequence.emails.length;
    
    return {
      subjectLineScore: Math.min(100, subjectLineScore / emailCount),
      readabilityScore: Math.min(100, readabilityScore / emailCount),
      engagementScore: Math.min(100, engagementScore / emailCount),
      mobileOptimization: Math.min(100, mobileOptimization / emailCount)
    };
  }

  private generateRecommendations(sequence: EmailSequence, request: EmailCampaignRequest): string[] {
    const recommendations: string[] = [];
    
    // Analyze current emails
    sequence.emails.forEach((email, index) => {
      if (email.spamScore > 30) {
        recommendations.push(`Email ${index + 1}: Reduce spam trigger words to improve deliverability`);
      }
      
      if (email.subject.length > 60) {
        recommendations.push(`Email ${index + 1}: Shorten subject line for better mobile display`);
      }
      
      if (email.personalizationTokens.length < 2) {
        recommendations.push(`Email ${index + 1}: Add more personalization beyond just name`);
      }
    });
    
    // General recommendations
    if (request.campaignType === 'welcome' && sequence.emails.length < 3) {
      recommendations.push('Consider a 3-email welcome series for better engagement');
    }
    
    if (!request.personalization?.firstName) {
      recommendations.push('Enable first name personalization to increase open rates by 20%');
    }
    
    recommendations.push('Test sending times - Tuesday/Thursday 10am often perform best');
    recommendations.push('Include social proof (testimonials, reviews) to build trust');
    recommendations.push('Add urgency or scarcity to promotional emails');
    recommendations.push('Segment your list further for more targeted messaging');
    
    return recommendations.slice(0, 5);
  }

  private generateABTestSuggestions(sequence: EmailSequence, request: EmailCampaignRequest): Array<{
    element: string;
    variations: string[];
    expectedImpact: string;
  }> {
    const suggestions: Array<{
      element: string;
      variations: string[];
      expectedImpact: string;
    }> = [];
    
    // Subject line variations
    if (sequence.emails.length > 0) {
      const originalSubject = sequence?.emails?.[0]?.subject || '';
      suggestions.push({
        element: 'Subject Line',
        variations: [
          originalSubject,
          `🎯 ${originalSubject}`,
          originalSubject.replace('{{firstName}}', 'Friend'),
          `[Urgent] ${originalSubject}`
        ],
        expectedImpact: '15-25% open rate improvement'
      });
    }
    
    // CTA variations
    suggestions.push({
      element: 'Call-to-Action',
      variations: [
        'Shop Now',
        'Get Started →',
        'Claim Your Discount',
        'Yes, I Want This!'
      ],
      expectedImpact: '10-20% click rate improvement'
    });
    
    // Send time variations
    suggestions.push({
      element: 'Send Time',
      variations: [
        '9 AM recipient time',
        '12 PM recipient time',
        '5 PM recipient time',
        '8 PM recipient time'
      ],
      expectedImpact: '10-15% open rate improvement'
    });
    
    // From name variations
    suggestions.push({
      element: 'From Name',
      variations: [
        'Company Name',
        'CEO Name',
        'Customer Success Team',
        'Company Name Team'
      ],
      expectedImpact: '5-10% open rate improvement'
    });
    
    return suggestions;
  }
}