export interface ScheduleInput {
  startDate: string; // ISO
  tasks: Array<{ title: string; estimateHours: number; assignees?: number }>;
  workdayHours?: number; // default 6
}

export interface ScheduleItem {
  title: string;
  start: string;
  end: string;
}

export function buildSchedule(input: ScheduleInput): ScheduleItem[] {
  const workday = Math.max(1, input.workdayHours ?? 6);
  const start = new Date(input.startDate);
  const result: ScheduleItem[] = [];
  let cursor = new Date(start);

  for (const t of input.tasks) {
    const hours = Math.max(1, t.estimateHours);
    const days = Math.ceil(hours / workday);
    const itemStart = new Date(cursor);
    const itemEnd = new Date(cursor);
    itemEnd.setDate(itemEnd.getDate() + days);
    result.push({ title: t.title, start: itemStart.toISOString(), end: itemEnd.toISOString() });
    cursor = new Date(itemEnd);
  }
  return result;
}

