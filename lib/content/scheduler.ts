export interface ContentItem {
  title: string;
  platform: string;
}

export interface ScheduledContent extends ContentItem {
  scheduledAt: string; // ISO
}

export function scheduleContent(items: ContentItem[], startDate: string, cadenceDays = 2): ScheduledContent[] {
  const start = new Date(startDate);
  return items.map((it, idx) => {
    const d = new Date(start);
    d.setDate(d.getDate() + idx * cadenceDays);
    return { ...it, scheduledAt: d.toISOString() };
  });
}

