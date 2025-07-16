import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/ui/footer";
import Link from 'next/link';

const navigationItems = [
  { label: "Tools", href: "/tools", description: "Explore our AI-powered tools" },
  { label: "Features", href: "/features", description: "Discover advanced capabilities" },
  { label: "Pricing", href: "/pricing", description: "Choose your plan" },
  { label: "About", href: "/about", description: "Learn about our mission" },
];

const tools = [
  {
    title: 'Codebase Search',
    description: 'Semantic search powered by advanced AI models',
    icon: '🔍',
    status: 'active',
    features: ['Semantic understanding', 'Multi-language support', 'Real-time indexing'],
    link: '/tools/codebase-search'
  },
  {
    title: 'AutoRewrite Engine',
    description: 'Transform content with intelligent rewriting',
    icon: '✍️',
    status: 'active',
    features: ['Style preservation', 'Tone adjustment', 'Plagiarism-free output'],
    link: '/tools/auto-rewrite'
  },
  {
    title: 'Bundle Builder',
    description: 'Package and deploy with automated optimization',
    icon: '📦',
    status: 'beta',
    features: ['Dependency management', 'Size optimization', 'Deployment automation'],
    link: '/tools/bundle-builder'
  },
  {
    title: 'Content Spawner',
    description: 'Generate engaging content at scale',
    icon: '🎯',
    status: 'active',
    features: ['Multi-format output', 'SEO optimization', 'Brand voice consistency'],
    link: '/tools/content-spawner'
  },
  {
    title: 'Live Dashboard',
    description: 'Real-time analytics and monitoring',
    icon: '📊',
    status: 'active',
    features: ['Real-time metrics', 'Custom dashboards', 'Alert system'],
    link: '/tools/live-dashboard'
  },
  {
    title: 'Affiliate Portal',
    description: 'Track and manage partnerships effortlessly',
    icon: '🤝',
    status: 'coming-soon',
    features: ['Commission tracking', 'Partner management', 'Performance analytics'],
    link: '/tools/affiliate-portal'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navigation items={navigationItems} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-300">
            AI Tools Suite
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered tools designed to transform your workflow and boost productivity.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{tool.icon}</div>
                    <Badge 
                      variant={
                        tool.status === 'active' ? 'default' :
                        tool.status === 'beta' ? 'warning' :
                        'secondary'
                      }
                    >
                      {tool.status}
                    </Badge>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {tool.features.map((feature, j) => (
                        <div key={j} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4">
                      <Link href={tool.link}>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
} 