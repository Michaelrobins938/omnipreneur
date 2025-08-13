import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface PodcastProducerRequest {
  topic: string;
  targetAudience?: string;
  episodeLengthMinutes?: number;
}

export interface PodcastProducerResult {
  outline: string[];
  hookIdeas: string[];
  titleOptions: string[];
  showNotes: string[];
  sponsorReadTemplate: string;
}

export class PodcastProducerService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }

  async process(request: PodcastProducerRequest): Promise<PodcastProducerResult> {
    const systemPrompt = 'You are a podcast producer. Create outlines, hooks, titles, and show notes. JSON only.';
    const userPrompt = JSON.stringify({ task: 'podcast_outline', input: request });
    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(response.content), request); } catch { return this.generateFallbackResponse(request); }
  }

  private processAIResponse(parsed: any, req: PodcastProducerRequest): PodcastProducerResult {
    return {
      outline: Array.isArray(parsed.outline) ? parsed.outline.map(String) : this.defaultOutline(req),
      hookIdeas: Array.isArray(parsed.hookIdeas) ? parsed.hookIdeas.map(String) : [ 'A counterintuitive claim to open the episode' ],
      titleOptions: Array.isArray(parsed.titleOptions) ? parsed.titleOptions.map(String) : [ `${req.topic}: The Playbook` ],
      showNotes: Array.isArray(parsed.showNotes) ? parsed.showNotes.map(String) : [ 'Key points with timestamps', 'Resources and links' ],
      sponsorReadTemplate: String(parsed.sponsorReadTemplate || 'This episode is brought to you by [Sponsor]...')
    };
  }

  private defaultOutline(req: PodcastProducerRequest): string[] {
    return [
      `Intro and hook for ${req.topic}`,
      'Segment 1: Context and key definitions',
      'Segment 2: Deep dive with examples',
      'Segment 3: Actionable takeaways',
      'Outro and CTA'
    ];
  }

  private generateFallbackResponse(req: PodcastProducerRequest): PodcastProducerResult {
    return {
      outline: this.defaultOutline(req),
      hookIdeas: ['Start with a bold promise and a surprising statistic'],
      titleOptions: [`${req.topic} — What No One Tells You`, `The ${req.topic} Blueprint`],
      showNotes: ['Timestamps with segment summaries', 'Links to tools and case studies'],
      sponsorReadTemplate: 'This episode is sponsored by [Sponsor], the easiest way to [benefit]...'
    };
  }
}

export default PodcastProducerService;

