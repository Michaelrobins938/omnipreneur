export type NovusSession = {
  id: string;
  createdAt: string;
  title: string;
  tags: string[];
  input: string;
  optimized: string;
  metrics: {
    readability: number; // 0-100
    structure: number;   // 0-100
    safety: number;      // 0-100
    tokenDeltaPct: number; // +/- %
  };
  diff: string; // serialized diff blocks
};

export type NovusTemplate = {
  id: string;
  name: string;
  variables: string[]; // ["{brand}", "{audience}"]
  body: string;        // template text with {vars}
};