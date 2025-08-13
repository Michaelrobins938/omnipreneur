import { BaseAIService, AIServiceConfig } from './base-ai-service';

export interface ProjectManagementRequest { tasks: Array<{ title: string; estimateHours?: number; risk?: 'low'|'medium'|'high' }>; deadlineDays?: number }
export interface ProjectManagementPlan { prioritization: Array<{ title: string; priority: 'low'|'medium'|'high' }>; riskMitigations: string[]; timeline: Array<{ day: number; focus: string }> }

export class ProjectManagementService extends BaseAIService {
  constructor(config?: AIServiceConfig) { super(config || { provider: 'openai', model: 'gpt-4o-mini' }); }
  async process(request: ProjectManagementRequest): Promise<ProjectManagementPlan> {
    const sys = 'You produce a pragmatic project execution plan with priorities, risk mitigations, and a timeline. JSON only.';
    const usr = JSON.stringify({ task: 'project_plan', input: request });
    const resp = await this.generateWithAI(usr, sys);
    if (!resp.success || !resp.content) return this.generateFallbackResponse(request);
    try { return this.processAIResponse(JSON.parse(resp.content), request); } catch { return this.generateFallbackResponse(request); }
  }
  private processAIResponse(parsed: any, req: ProjectManagementRequest): ProjectManagementPlan {
    const prioritization = Array.isArray(parsed.prioritization) ? parsed.prioritization : req.tasks.map(t => ({ title: t.title, priority: 'medium' as const }));
    const riskMitigations = Array.isArray(parsed.riskMitigations) ? parsed.riskMitigations.map(String) : ['Add buffer for unknowns', 'Tackle high-risk tasks first'];
    const timeline = Array.isArray(parsed.timeline) ? parsed.timeline : [ { day: 1, focus: 'Kickoff and high-level planning' } ];
    return { prioritization, riskMitigations, timeline };
  }
  private generateFallbackResponse(req: ProjectManagementRequest): ProjectManagementPlan {
    const timeline: Array<{ day: number; focus: string }> = [];
    const days = req.deadlineDays ?? Math.max(5, Math.ceil((req.tasks.length || 5) / 2));
    for (let d = 1; d <= days; d++) timeline.push({ day: d, focus: d === 1 ? 'Plan & setup' : 'Execute high-impact tasks' });
    return {
      prioritization: req.tasks.map(t => ({ title: t.title, priority: t.risk === 'high' ? 'high' : 'medium' })),
      riskMitigations: ['Resolve blockers early', 'Daily status updates', 'Reserve buffer days'],
      timeline
    };
  }
}

export default ProjectManagementService;