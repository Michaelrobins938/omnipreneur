export interface ConnectorResult {
  source: string;
  status: 'ok' | 'error';
  metrics?: Record<string, number>;
  error?: string;
}

export async function fetchGoogleAnalyticsSummary(_accountId: string): Promise<ConnectorResult> {
  // Placeholder: integrate real GA4 in production
  return { source: 'google-analytics', status: 'ok', metrics: { sessions: 1234, pageviews: 5678 } };
}

export async function fetchStripeSummary(_accountId: string): Promise<ConnectorResult> {
  // Placeholder: integrate Stripe in production
  return { source: 'stripe', status: 'ok', metrics: { charges: 42, revenue: 12345 } };
}

export async function fetchFacebookAdsSummary(_accountId: string): Promise<ConnectorResult> {
  // Placeholder: integrate Facebook Ads in production
  return { source: 'facebook-ads', status: 'ok', metrics: { spend: 250, impressions: 90000, clicks: 1400 } };
}

