import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface SocialMediaRequest {
  topic: string;
  platforms: Array<'twitter'|'instagram'|'linkedin'|'tiktok'|'facebook'>;
  tone?: 'professional'|'casual'|'witty'|'authoritative';
}

export interface SocialMediaPost {
  platform: string;
  caption: string;
  hashtags?: string[];
  postTimeSuggestion?: string;
}

export interface SocialMediaResult {
  posts: SocialMediaPost[];
  calendarSlots: Array<{ platform: string; isoTime: string; rationale: string }>;
}

export class SocialMediaService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: SocialMediaRequest): Promise<SocialMediaResult> {
    const systemPrompt = 'You craft platform-optimized social posts with scheduling suggestions. Output JSON only.';
    const userPrompt = JSON.stringify({ task: 'social_posts', input: request });
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(response.content), request); } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any, req: SocialMediaRequest): SocialMediaResult {
    const posts: SocialMediaPost[] = Array.isArray(parsed.posts) ? parsed.posts.map((p: any) => ({
      platform: String(p.platform), caption: String(p.caption || ''), hashtags: Array.isArray(p.hashtags) ? p.hashtags.map(String) : [], postTimeSuggestion: p.postTimeSuggestion
    })) : [];
    const slots = Array.isArray(parsed.calendarSlots) ? parsed.calendarSlots : [];
    return { posts, calendarSlots: slots.map((s: any) => ({ platform: String(s.platform || req.platforms[0] || 'twitter'), isoTime: String(s.isoTime || new Date().toISOString()), rationale: String(s.rationale || 'Platform peak engagement window') })) };
  }

  private generateFallbackResponse(req: SocialMediaRequest): SocialMediaResult {
    const posts: SocialMediaPost[] = req.platforms.map(p => ({
      platform: p,
      caption: `${req.topic} — 3 key takeaways you can apply today.`,
      hashtags: ['#AI', '#Productivity', '#Growth'],
      postTimeSuggestion: '09:30 local time'
    }));
    return { posts, calendarSlots: posts.map(p => ({ platform: p.platform, isoTime: new Date().toISOString(), rationale: 'Morning slot for higher CTR' })) };
  }
}

export default SocialMediaService;

