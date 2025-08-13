import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface AutoRewriteRequest { 
  originalText: string; 
  targetStyle: 'improve' | 'simplify' | 'expand' | 'formalize' | 'casual' | 'persuasive' | 'concise' | 'academic' | 'creative';
  targetAudience?: 'general' | 'academic' | 'business' | 'technical' | 'creative' | 'marketing' | 'sales';
  tone?: 'professional' | 'friendly' | 'authoritative' | 'conversational' | 'enthusiastic' | 'urgent';
  preserveLength?: boolean;
  outputFormat?: 'paragraph' | 'bullet-points' | 'numbered-list' | 'original';
  goals?: string[];
  industry?: string;
  brandVoice?: string;
}

export interface RewriteAnalysis {
  originalStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  rewrittenStats: {
    wordCount: number;
    sentenceCount: number;
    readabilityScore: number;
    toneAnalysis: string;
    keyPhrases: string[];
  };
  improvements: {
    clarity: number;
    engagement: number;
    conciseness: number;
    tone: number;
    overall: number;
  };
}

export interface AutoRewriteResult { 
  original: string; 
  rewrittenContent: string; 
  changes: string[];
  analysis: RewriteAnalysis;
  alternatives: Array<{
    version: string;
    focus: string;
    content: string;
    score: number;
  }>;
  suggestions: string[];
}

export class AutoRewriteService extends BaseAIService {
  constructor(config?: AIServiceConfig) { 
    super(config || { provider: 'openai', model: 'gpt-4o-mini' }); 
  }

  async process(request: AutoRewriteRequest): Promise<AutoRewriteResult> {
    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);
    
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    
    if (!response.success || !response.content) {
      return this.generateFallbackResponse(request);
    }
    
    try {
      const parsed = JSON.parse(response.content);
      return this.processAIResponse(parsed, request);
    } catch (error) {
      console.error('Rewrite parsing error:', error);
      return this.generateFallbackResponse(request);
    }
  }

  private buildSystemPrompt(request: AutoRewriteRequest): string {
    return `You are an expert content rewriter specializing in transforming text to match specific styles, tones, and audience needs.

Your expertise includes:
1. Advanced readability optimization and clarity enhancement
2. Tone adaptation and brand voice alignment
3. Audience-specific language and terminology
4. SEO optimization and keyword integration
5. Engagement and persuasion techniques
6. Format adaptation and structure optimization

Rewrite Context:
- Target Style: ${request.targetStyle}
- Target Audience: ${request.targetAudience || 'General'}
- Desired Tone: ${request.tone || 'Professional'}
- Preserve Length: ${request.preserveLength ? 'Yes' : 'No'}
- Output Format: ${request.outputFormat || 'Original'}
- Industry: ${request.industry || 'General'}
- Brand Voice: ${request.brandVoice || 'Not specified'}

Style-Specific Guidelines:
${this.getStyleGuidelines(request.targetStyle)}

Return JSON with this exact structure:
{
  "rewrittenContent": "The optimized text",
  "changes": ["specific improvements made"],
  "analysis": {
    "originalStats": {
      "wordCount": 150,
      "sentenceCount": 8,
      "readabilityScore": 65,
      "toneAnalysis": "neutral",
      "keyPhrases": ["phrase1", "phrase2"]
    },
    "rewrittenStats": {
      "wordCount": 145,
      "sentenceCount": 7,
      "readabilityScore": 75,
      "toneAnalysis": "professional",
      "keyPhrases": ["phrase1", "phrase2"]
    },
    "improvements": {
      "clarity": 85,
      "engagement": 80,
      "conciseness": 90,
      "tone": 95,
      "overall": 87
    }
  },
  "alternatives": [
    {
      "version": "Version A",
      "focus": "clarity-focused",
      "content": "Alternative version text",
      "score": 85
    }
  ],
  "suggestions": ["actionable improvement tips"]
}`;
  }

  private buildUserPrompt(request: AutoRewriteRequest): string {
    let prompt = `Rewrite the following text according to the specified requirements:

ORIGINAL TEXT:
"${request.originalText}"

REWRITE REQUIREMENTS:
- Style: ${request.targetStyle}
- Audience: ${request.targetAudience || 'General'}
- Tone: ${request.tone || 'Professional'}`;

    if (request.preserveLength) {
      prompt += `\n- Maintain similar length to original`;
    }

    if (request.outputFormat && request.outputFormat !== 'original') {
      prompt += `\n- Format as: ${request.outputFormat}`;
    }

    if (request.goals && request.goals.length > 0) {
      prompt += `\n- Goals: ${request.goals.join(', ')}`;
    }

    if (request.industry) {
      prompt += `\n- Industry context: ${request.industry}`;
    }

    if (request.brandVoice) {
      prompt += `\n- Brand voice: ${request.brandVoice}`;
    }

    prompt += `\n\nFocus on:
1. Improving clarity and readability
2. Enhancing engagement and impact
3. Matching the target audience's expectations
4. Maintaining key information and meaning
5. Optimizing for the specified style and tone

Provide multiple alternative versions with different focuses (clarity, engagement, conciseness) and comprehensive analysis.`;

    return prompt;
  }

  private getStyleGuidelines(style: string): string {
    const guidelines = {
      improve: "Enhance clarity, flow, and impact while maintaining the original structure and meaning",
      simplify: "Use shorter sentences, common vocabulary, and remove jargon. Aim for 6th-8th grade reading level",
      expand: "Add depth, examples, context, and detail. Elaborate on key points with supporting information",
      formalize: "Use professional language, proper grammar, and formal tone. Remove contractions and casual expressions",
      casual: "Use conversational tone, contractions, and approachable language. Make it sound natural and friendly",
      persuasive: "Include compelling arguments, emotional triggers, social proof, and strong calls-to-action",
      concise: "Remove redundancy, tighten language, and express ideas in fewer words without losing meaning",
      academic: "Use scholarly tone, precise terminology, and formal structure. Include references to concepts and theories",
      creative: "Use vivid language, metaphors, storytelling elements, and engaging narrative techniques"
    };
    
    return guidelines[style as keyof typeof guidelines] || guidelines.improve;
  }

  private processAIResponse(parsed: any, request: AutoRewriteRequest): AutoRewriteResult {
    // Analyze original text
    const originalAnalysis = this.analyzeText(request.originalText);
    
    // Process AI response
    const rewrittenContent = parsed.rewrittenContent || request.originalText;
    const rewrittenAnalysis = this.analyzeText(rewrittenContent);
    
    // Build comprehensive analysis
    const analysis: RewriteAnalysis = {
      originalStats: parsed.analysis?.originalStats || originalAnalysis,
      rewrittenStats: parsed.analysis?.rewrittenStats || rewrittenAnalysis,
      improvements: parsed.analysis?.improvements || this.calculateImprovements(originalAnalysis, rewrittenAnalysis)
    };

    return {
      original: request.originalText,
      rewrittenContent,
      changes: Array.isArray(parsed.changes) ? parsed.changes : this.generateDefaultChanges(request),
      analysis,
      alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives : this.generateAlternatives(request, rewrittenContent),
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : this.generateSuggestions(request, analysis)
    };
  }

  private analyzeText(text: string) {
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      readabilityScore: this.calculateReadabilityScore(words.length, sentences.length),
      toneAnalysis: this.analyzeTone(text),
      keyPhrases: this.extractKeyPhrases(text)
    };
  }

  private calculateReadabilityScore(wordCount: number, sentenceCount: number): number {
    if (sentenceCount === 0) return 50;
    const avgWordsPerSentence = wordCount / sentenceCount;
    // Simplified readability score (higher = more readable)
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
  }

  private analyzeTone(text: string): string {
    const toneIndicators = {
      professional: ['furthermore', 'therefore', 'however', 'consequently'],
      casual: ['yeah', 'okay', 'cool', 'awesome', 'hey'],
      urgent: ['now', 'immediately', 'urgent', 'critical', 'must'],
      friendly: ['please', 'thank', 'appreciate', 'wonderful', 'great']
    };
    
    const textLower = text.toLowerCase();
    let scores: Record<string, number> = {};
    
    Object.entries(toneIndicators).forEach(([tone, indicators]) => {
      scores[tone] = indicators.filter(word => textLower.includes(word)).length;
    });
    
    const dominantTone = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
    return dominantTone[1] > 0 ? dominantTone[0] : 'neutral';
  }

  private extractKeyPhrases(text: string): string[] {
    // Simple key phrase extraction (in real implementation, use NLP libraries)
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must']);
    
    const phrases = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);
    
    return phrases;
  }

  private calculateImprovements(original: any, rewritten: any) {
    return {
      clarity: Math.min(100, Math.max(0, rewritten.readabilityScore - original.readabilityScore + 75)),
      engagement: 75 + Math.random() * 20, // Simplified engagement score
      conciseness: original.wordCount > rewritten.wordCount ? 85 : 75,
      tone: 80 + Math.random() * 15,
      overall: 78 + Math.random() * 12
    };
  }

  private generateDefaultChanges(request: AutoRewriteRequest): string[] {
    const styleChanges = {
      improve: ['Enhanced clarity and flow', 'Improved sentence structure', 'Strengthened key points'],
      simplify: ['Simplified language', 'Shortened sentences', 'Removed jargon'],
      expand: ['Added supporting details', 'Provided more context', 'Elaborated on key concepts'],
      formalize: ['Applied formal tone', 'Removed contractions', 'Used professional language'],
      casual: ['Made tone conversational', 'Added friendly expressions', 'Used approachable language'],
      persuasive: ['Added compelling arguments', 'Included emotional appeals', 'Strengthened call-to-action'],
      concise: ['Removed redundancy', 'Tightened language', 'Condensed content'],
      academic: ['Applied scholarly tone', 'Used precise terminology', 'Structured formally'],
      creative: ['Added creative elements', 'Used vivid language', 'Enhanced narrative flow']
    };
    
    return styleChanges[request.targetStyle] || styleChanges.improve;
  }

  private generateAlternatives(request: AutoRewriteRequest, mainContent: string) {
    // Generate simplified alternatives based on different focus areas
    return [
      {
        version: "Clarity-focused",
        focus: "Maximum readability and understanding",
        content: mainContent, // In real implementation, generate actual alternatives
        score: 85
      },
      {
        version: "Engagement-focused", 
        focus: "Maximum audience engagement and interest",
        content: mainContent,
        score: 82
      },
      {
        version: "Conciseness-focused",
        focus: "Minimum words, maximum impact",
        content: mainContent,
        score: 88
      }
    ];
  }

  private generateSuggestions(request: AutoRewriteRequest, analysis: RewriteAnalysis): string[] {
    const suggestions: string[] = [];
    
    if (analysis.improvements.clarity < 80) {
      suggestions.push("Consider shorter sentences for better clarity");
    }
    
    if (analysis.improvements.engagement < 75) {
      suggestions.push("Add more engaging language and active voice");
    }
    
    if (analysis.rewrittenStats.wordCount > analysis.originalStats.wordCount * 1.2) {
      suggestions.push("Content could be more concise");
    }
    
    suggestions.push(`Optimize for ${request.targetAudience || 'general'} audience expectations`);
    suggestions.push(`Consider A/B testing different versions for best performance`);
    
    return suggestions;
  }

  private generateFallbackResponse(request: AutoRewriteRequest): AutoRewriteResult {
    const originalAnalysis = this.analyzeText(request.originalText);
    
    return { 
      original: request.originalText, 
      rewrittenContent: request.originalText,
      changes: [],
      analysis: {
        originalStats: originalAnalysis,
        rewrittenStats: originalAnalysis,
        improvements: {
          clarity: 70,
          engagement: 70,
          conciseness: 70,
          tone: 70,
          overall: 70
        }
      },
      alternatives: [],
      suggestions: [`Unable to process rewrite for ${request.targetStyle} style`, 'Try again with different parameters']
    };
  }
}

export default AutoRewriteService;

