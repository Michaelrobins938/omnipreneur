export interface TimeSession {
  id: string;
  userId: string;
  projectId?: string;
  category: 'DEVELOPMENT' | 'DESIGN' | 'MARKETING' | 'MEETINGS' | 'RESEARCH' | 'ADMIN';
  description: string;
  startTime: string;
  endTime?: string;
}

export function analyzeProductivity(sessions: TimeSession[]) {
  const totalSeconds = sessions.reduce((s, ses) => s + (durationSeconds(ses) || 0), 0);
  const byCategory = sessions.reduce((acc, ses) => {
    const d = durationSeconds(ses) || 0;
    acc[ses.category] = (acc[ses.category] || 0) + d;
    return acc;
  }, {} as Record<string, number>);
  const focusScore = Math.max(0, Math.min(100, Math.round((byCategory['DEVELOPMENT'] || 0) / (totalSeconds || 1) * 100)));
  return { totalSeconds, byCategory, focusScore };
}

function durationSeconds(s: TimeSession) {
  if (!s.endTime) return 0;
  return Math.max(0, (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 1000);
}

