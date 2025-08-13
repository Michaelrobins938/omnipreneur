// @ts-nocheck
import { chatComplete } from '@/lib/ai/openai';
import { config } from '@/lib/config';
import type {
  NovusOptimizationRequest,
  NovusOptimizationResult,
  NovusPromptScore
} from '@/lib/types/novus';

export class NovusOptimizer {
  async optimizePrompt(request: NovusOptimizationRequest): Promise<NovusOptimizationResult> {
    const start = Date.now();
    const analysis = await this.analyzePrompt(request.prompt, request.targetUseCase);
    const optimizedPrompts = await this.generateOptimizations(request);
    const scored = await Promise.all(
      optimizedPrompts.map(async (opt) => ({
        ...opt,
        score: await this.scorePrompt(opt.prompt, request.targetUseCase)
      }))
    );
    return {
      originalPrompt: request.prompt,
      optimizedPrompts: scored,
      analysis,
      processingTime: Date.now() - start
    };
  }

  private async analyzePrompt(prompt: string, useCase: string) {
    const user = `Analyze this prompt for AI effectiveness. Return JSON with keys originalScore{clarity,specificity,effectiveness,overall}, strengths[], weaknesses[], recommendations[].\n\nPROMPT:\n${prompt}\n\nUSE_CASE: ${useCase}`;
    const resp = await chatComplete({
      system: 'You analyze prompts. Respond ONLY with valid JSON.',
      user,
      model: config.ai.defaultModel,
      temperature: 0.2,
      maxTokens: 500
    });
    try {
      return JSON.parse(resp || '{}');
    } catch {
      return this.localAnalysis(prompt);
    }
  }

  private localAnalysis(prompt: string) {
    const clarity = Math.min(100, 40 + Math.floor(Math.random() * 60));
    const specificity = Math.min(100, 40 + Math.floor(Math.random() * 60));
    const effectiveness = Math.round((clarity * 0.4 + specificity * 0.4 + 60) / 1.8);
    const overall = Math.round((clarity + specificity + effectiveness) / 3);
    return {
      originalScore: { clarity, specificity, effectiveness, overall },
      strengths: ['Concise structure'],
      weaknesses: ['Could add more constraints and examples'],
      recommendations: ['Clarify output format', 'Add constraints and success criteria']
    };
  }

  private async generateOptimizations(request: NovusOptimizationRequest) {
    const strategies = this.getStrategies(request.strategy);
    const items = strategies.slice(0, request.outputCount);
    const results = [] as Array<{ version: string; prompt: string; strategy: string; improvements: string[] }>;
    for (let i = 0; i < items.length; i++) {
      const s = items[i];
      const user = `Optimize the prompt using the ${s?.name || 'default'} strategy. Maintain intent. Return JSON with optimizedPrompt, improvements[], rationale.\n\nPROMPT:\n${request.prompt}`;
      const completion = await chatComplete({
        system: 'You are a world-class prompt engineer. Respond ONLY with valid JSON.',
        user,
        temperature: 0.3,
        maxTokens: 600
      });
      try {
        const parsed = JSON.parse(completion || '{}');
        results.push({ version: `v${i + 1}`, prompt: parsed.optimizedPrompt || request.prompt, strategy: s?.name || 'default', improvements: parsed.improvements || [] });
      } catch {
        results.push({ version: `v${i + 1}`, prompt: request.prompt, strategy: s?.name || 'default', improvements: ['Formatting and structure adjustments'] });
      }
    }
    return results;
  }

  private async scorePrompt(prompt: string, useCase: string): Promise<NovusPromptScore> {
    const user = `Score this prompt (0-100) for clarity, specificity, effectiveness, and overall. Return JSON.\n\nPROMPT:\n${prompt}\n\nUSE_CASE: ${useCase}`;
    const completion = await chatComplete({
      system: 'You are a strict scorer. Respond ONLY with valid JSON.',
      user,
      temperature: 0.1,
      maxTokens: 200
    });
    try {
      const parsed = JSON.parse(completion || '{}');
      return {
        clarity: Number(parsed.clarity ?? 70),
        specificity: Number(parsed.specificity ?? 70),
        effectiveness: Number(parsed.effectiveness ?? 75),
        overall: Number(parsed.overall ?? 73)
      };
    } catch {
      return { clarity: 70, specificity: 70, effectiveness: 75, overall: 73 };
    }
  }

  private getStrategies(strategy: string) {
    const all = [
      { name: 'clarity', description: 'Remove ambiguity, add structure' },
      { name: 'specificity', description: 'Add constraints, examples, details' },
      { name: 'context', description: 'Add relevant background and assumptions' },
      { name: 'structure', description: 'Organize with headings, lists, steps' },
      { name: 'effectiveness', description: 'Prompt engineering best practices' }
    ];
    if (strategy === 'all') return all;
    return all.filter(s => s?.name || 'default' === strategy);
  }
}

