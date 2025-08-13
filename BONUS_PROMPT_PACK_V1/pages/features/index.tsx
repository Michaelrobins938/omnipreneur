import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/ui/footer";
import Link from 'next/link';

const navigationItems = [
  { label: "Tools", href: "/tools", description: "Explore our AI-powered tools" },
  { label: "Features", href: "/features", description: "Discover advanced capabilities" },
  { label: "Pricing", href: "/pricing", description: "Choose your plan" },
  { label: "About", href: "/about", description: "Learn about our mission" },
];

const features = [
  {
    title: 'Advanced AI Models',
    description: 'State-of-the-art machine learning models powering all our tools',
    icon: '🧠',
    details: ['GPT-4 Integration', 'Custom fine-tuning', 'Multi-modal support']
  },
  {
    title: 'Real-time Processing',
    description: 'Lightning-fast processing with sub-second response times',
    icon: '⚡',
    details: ['< 300ms latency', 'Parallel processing', 'Auto-scaling']
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption',
    icon: '🔒',
    details: ['SOC 2 compliant', 'GDPR ready', 'Zero-knowledge architecture']
  },
  {
    title: 'Seamless Integration',
    description: 'Easy integration with your existing tools and workflows',
    icon: '🔗',
    details: ['REST API', 'Webhook support', 'SDK libraries']
  }
];

export default function FeaturesPage() {
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
            Advanced Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the cutting-edge features that make our AI platform the choice for enterprise teams.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-400">{detail}</span>
                      </div>
                    ))}
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