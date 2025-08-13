export interface DesignRequest {
  prompt: string;
  count: number;
}

export function generateDesigns(req: DesignRequest) {
  const items = Array.from({ length: req.count }).map((_, i) => ({
    id: `design_${Date.now()}_${i}`,
    previewUrl: `/api/design/preview/${Date.now()}_${i}.png`,
    prompt: req.prompt
  }));
  return { items };
}

