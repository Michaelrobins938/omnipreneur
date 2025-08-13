export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readMinutes: number;
  views: number;
  date: string; // ISO string
  content: string[]; // paragraphs
};

export const posts: BlogPost[] = [
  {
    slug: "ai-content-strategy-2025",
    title: "AI Content Strategy in 2025",
    excerpt:
      "How to leverage CAL-powered workflows to create, repurpose, and distribute content at scale without sacrificing quality.",
    category: "AI & Technology",
    author: "Omnipreneur Editorial",
    readMinutes: 6,
    views: 1240,
    date: "2025-07-01",
    content: [
      "AI has shifted from helpful assistant to core operating system for content-led growth. In 2025, the winners will be those who build durable systems, not one-off prompts.",
      "We recommend defining pillar narratives, structuring atomic content components, and using CAL™ orchestration to remix across formats with consistent voice and accuracy.",
      "Measure what matters: topic authority, conversion quality, and asset half-life rather than raw post counts."
    ]
  },
  {
    slug: "prompt-engineering-to-process-engineering",
    title: "From Prompt Engineering to Process Engineering",
    excerpt:
      "Move beyond clever prompts. Build resilient pipelines with validation, review loops, and source-grounded generation.",
    category: "Operations",
    author: "Omnipreneur Editorial",
    readMinutes: 8,
    views: 980,
    date: "2025-06-20",
    content: [
      "Prompts are inputs; processes are systems. Durable outcomes require versioned prompts, deterministic evaluators, and continuous improvement loops.",
      "Adopt checkers for factuality, tone, and compliance. Use human-in-the-loop where risk is high and automate everything else.",
      "Outcomes improve when you encode business logic into reusable functions—your organization's AI playbook."
    ]
  },
  {
    slug: "shipping-products-with-ai-teams",
    title: "Shipping Products with AI-Accelerated Teams",
    excerpt:
      "A practical framework for combining human creativity with AI leverage to reduce cycle time by 60–80%.",
    category: "Product",
    author: "Omnipreneur Editorial",
    readMinutes: 7,
    views: 1432,
    date: "2025-06-05",
    content: [
      "Teams that pair program with AI move faster and make fewer mistakes. The key is clarity of intent and clean handoffs.",
      "Define acceptance criteria up front, codify UI patterns, and wire CI checks to catch regressions early.",
      "Use sprint templates where AI drafts, humans review, and tests verify. Repeatable excellence scales."
    ]
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

