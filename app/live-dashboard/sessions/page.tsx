'use client';

import { redirect } from 'next/navigation';

export default function LiveDashboardSessionsPage() {
  redirect('/live-dashboard/workspace');
}