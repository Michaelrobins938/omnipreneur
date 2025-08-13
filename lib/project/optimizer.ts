export interface TaskInput {
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimateHours?: number;
  dependencies?: number; // number of prerequisites
}

export interface OptimizationSuggestion {
  order: number;
  title: string;
  reason: string;
}

export function optimizeTaskOrder(tasks: TaskInput[]): OptimizationSuggestion[] {
  const scored = tasks.map((t, idx) => {
    const priorityScore = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 }[t.priority];
    const effort = (t.estimateHours ?? 4);
    const depPenalty = Math.min(2, (t.dependencies ?? 0) * 0.5);
    const score = priorityScore * 3 - depPenalty - (effort > 8 ? 1 : 0);
    return { idx, title: t.title, score, reason: `priority=${t.priority} effort=${effort}h deps=${t.dependencies ?? 0}` };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s, i) => ({ order: i + 1, title: s.title, reason: s.reason }));
}

