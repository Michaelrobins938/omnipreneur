export interface PlanRequest {
  niche: string;
  month: string; // e.g., 2025-08
  count: number;
}

export interface PlannedItem {
  title: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'blog';
  angle: string;
}

export function planContent(req: PlanRequest): PlannedItem[] {
  const platforms: PlannedItem['platform'][] = ['instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'blog'];
  const ideas = [
    'How-to Guide',
    'Myth vs Fact',
    'Beginner Mistakes',
    'Case Study',
    'Checklist',
    'Tool Roundup',
    'Trends ' + req.month,
  ];
  const items: PlannedItem[] = [];
  for (let i = 0; i < req.count; i++) {
    const p = platforms[i % platforms.length];
    const title = `${req.niche}: ${ideas[i % ideas.length]}`;
    const angle = i % 2 === 0 ? 'Educational' : 'Actionable';
    if (p) { items.push({ title, platform: p, angle }); }
  }
  return items;
}

