import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface TimeTrackingRequest {
  activities: Array<{ description: string; durationMinutes: number; category?: string }>;
  goals?: string[];
  workHours?: { start: string; end: string };
}

export interface TimeTrackingInsight {
  category: string;
  totalMinutes: number;
  efficiencyScore: number; // 0-100
  recommendations: string[];
}

export interface TimeTrackingResult {
  totalMinutes: number;
  byCategory: TimeTrackingInsight[];
  peakFocusWindows: Array<{ start: string; end: string; rationale: string }>;
  wastedTimeEstimateMinutes: number;
  recommendations: string[];
}

export class TimeTrackingService extends BaseAIService {
  constructor(config?: AIServiceConfig) {
    super(config || { provider: 'openai', model: 'gpt-4o-mini' });
  }

  async process(request: TimeTrackingRequest): Promise<TimeTrackingResult> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request);

    const response = await this.generateWithAI(userPrompt, systemPrompt);
    if (!response.success || !response.content) {
      return this.generateFallbackResponse(request);
    }

    try {
      const parsed = JSON.parse(response.content);
      return this.processAIResponse(parsed, request);
    } catch {
      return this.generateFallbackResponse(request);
    }
  }

  private buildSystemPrompt(): string {
    return [
      'You are a productivity analyst specializing in time tracking optimization.',
      'Analyze activities, detect patterns, compute category totals and efficiency scores,',
      'and propose concrete schedule improvements. Output valid JSON only.'
    ].join(' ');
  }

  private buildUserPrompt(req: TimeTrackingRequest): string {
    return JSON.stringify({ task: 'time_tracking_analysis', input: req });
  }

  private processAIResponse(parsed: any, _req: TimeTrackingRequest): TimeTrackingResult {
    const byCategory: TimeTrackingInsight[] = Array.isArray(parsed.byCategory)
      ? parsed.byCategory.map((c: any) => ({
          category: String(c.category || 'Uncategorized'),
          totalMinutes: Number(c.totalMinutes || 0),
          efficiencyScore: Number(c.efficiencyScore || 60),
          recommendations: Array.isArray(c.recommendations) ? c.recommendations.map(String) : []
        }))
      : [];

    const totalMinutes = Number(parsed.totalMinutes || byCategory.reduce((s, c) => s + c.totalMinutes, 0));
    const peakFocusWindows = Array.isArray(parsed.peakFocusWindows) ? parsed.peakFocusWindows : [];

    return {
      totalMinutes,
      byCategory,
      peakFocusWindows: peakFocusWindows.map((w: any) => ({
        start: String(w.start || '09:00'),
        end: String(w.end || '11:00'),
        rationale: String(w.rationale || 'Consistent morning focus observed')
      })),
      wastedTimeEstimateMinutes: Number(parsed.wastedTimeEstimateMinutes || Math.round(totalMinutes * 0.1)),
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map(String) : [
        'Batch meetings into a single afternoon block to reduce context switching.',
        'Protect a 90-minute deep work block each morning.'
      ]
    };
  }

  private generateFallbackResponse(req: TimeTrackingRequest): TimeTrackingResult {
    const totals = new Map<string, number>();
    for (const a of req.activities || []) {
      const cat = a.category || 'Uncategorized';
      totals.set(cat, (totals.get(cat) || 0) + a.durationMinutes);
    }
    const total = Array.from(totals.values()).reduce((s, n) => s + n, 0);
    const byCategory: TimeTrackingInsight[] = Array.from(totals.entries()).map(([category, totalMinutes]) => ({
      category,
      totalMinutes,
      efficiencyScore: 65,
      recommendations: [
        'Group similar tasks to minimize context switching.',
        'Use Pomodoro (25/5) for categories with frequent interruptions.'
      ]
    }));

    return {
      totalMinutes: total,
      byCategory,
      peakFocusWindows: [
        { start: '09:00', end: '10:30', rationale: 'Default morning deep work suggestion' },
        { start: '14:00', end: '15:00', rationale: 'Post-lunch focused block' }
      ],
      wastedTimeEstimateMinutes: Math.round(total * 0.12),
      recommendations: [
        'Schedule emails/messages in two fixed windows per day.',
        'Batch admin tasks and protect deep work blocks on calendar.'
      ]
    };
  }
}

export default TimeTrackingService;

