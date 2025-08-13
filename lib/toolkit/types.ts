export interface Session {
  id: string;
  createdAt: string;
  title: string;
  tags: string[];
  input: string;
  result: string;
  metrics: Record<string, number>;
  diff?: string;
}

export interface Template {
  id: string;
  name: string;
  variables: string[];
  body: string;
}

export interface ProcessResult {
  output: string;
  metrics: Record<string, number>;
  diff?: string;
  improvements?: string[];
}

export interface ProductStrategy {
  run: (input: string, params?: Record<string, any>) => Promise<ProcessResult>;
  defaultParams?: Record<string, any>;
  labels: {
    run: string;
    save: string;
    copy: string;
    editor: string;
    result: string;
    original: string;
    improvements: string;
  };
  metricsConfig: MetricConfig[];
  docsLink?: string;
  tokenCountFn?: (text: string) => number;
  hotkeys?: Array<{ key: string; action: string }>;
}

export interface MetricConfig {
  label: string;
  key: string;
  color?: string;
  format?: (value: number) => string;
}

export interface UsageInfo {
  remaining: number;
  limit: number;
}