import { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  urgencyBanner: {
    text: "🚀 Limited Time: Get 50% off all Pro plans until August 31st - No code needed!",
    enabled: true,
    dismissible: true
  },
  // Added fallback urgency text for homepage banner usage
  urgencyText: "Next onboarding cohort closes in 3 days • Join now to unlock 2 bonus playbooks.",
  // Centralized proof metrics used by ProofBand
  proof: { users: "50k+", generated: "1M+", success: "98%" },
  socialProof: {
    userCount: "50K+",
    contentGenerated: "1M+",
    successRate: "98%"
  },
  testimonials: [
    {
      quote: "Omnipreneur's AI tools have transformed how we create content. We're producing 10x more content in half the time.",
      author: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow Solutions"
    },
    {
      quote: "The NOVUS Protocol alone has improved our prompt engineering efficiency by 900%. Incredible ROI.",
      author: "Marcus Rodriguez",
      role: "AI Engineer",
      company: "DataVision Inc"
    },
    {
      quote: "From content creation to project management, this platform covers everything. It's like having a full team of AI specialists.",
      author: "Emily Watson",
      role: "CEO",
      company: "GrowthHackers Pro"
    },
    {
      quote: "The healthcare compliance tools are a game-changer for our medical practice. HIPAA-compliant AI that actually works.",
      author: "Dr. James Park",
      role: "Chief Medical Officer",
      company: "MedTech Innovations"
    },
    {
      quote: "We've increased our affiliate revenue by 250% using the Affiliate Portal. The AI insights are incredibly accurate.",
      author: "Lisa Thompson",
      role: "Partnership Manager",
      company: "E-commerce Pro"
    }
  ]
};