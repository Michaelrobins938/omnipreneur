import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface VideoEditorRequest {
  script: string;
  platform?: 'youtube' | 'tiktok' | 'instagram' | 'linkedin';
  durationSeconds?: number;
}

export interface VideoEditPlan {
  brollIdeas: string[];
  cutBeats: Array<{ atSecond: number; action: string }>;
  captionStyle: string;
  hookScript: string;
}

export class VideoEditorService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: VideoEditorRequest): Promise<VideoEditPlan> {
    const systemPrompt = 'You are a video edit director. Produce a concise edit plan with b-roll, cut beats, captions, and hook. JSON only.';
    const userPrompt = JSON.stringify({ task: 'video_edit_plan', input: request });
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(response.content), request); } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any, _req: VideoEditorRequest): VideoEditPlan {
    return {
      brollIdeas: Array.isArray(parsed.brollIdeas) ? parsed.brollIdeas.map(String) : ['Product close-ups', 'Customer reactions', 'Screen recordings'],
      cutBeats: Array.isArray(parsed.cutBeats) ? parsed.cutBeats : [ { atSecond: 0, action: 'Hook on face cam' }, { atSecond: 5, action: 'Cut to b-roll' } ],
      captionStyle: String(parsed.captionStyle || 'Bold keyword highlights with emojis where appropriate'),
      hookScript: String(parsed.hookScript || 'If you struggle with X, here is how to Y in under 60 seconds...')
    };
  }

  private generateFallbackResponse(_req: VideoEditorRequest): VideoEditPlan {
    return {
      brollIdeas: ['Problem visuals', 'Solution demo', 'Outcome showcase'],
      cutBeats: [ { atSecond: 0, action: 'Pattern interrupt' }, { atSecond: 3, action: 'Value statement' }, { atSecond: 8, action: 'CTA overlay' } ],
      captionStyle: 'High-contrast, uppercase keywords, 2-line max, dynamic emojis',
      hookScript: 'Stop scrolling—here are 3 ways to fix X without spending a dime.'
    };
  }
}

export default VideoEditorService;

