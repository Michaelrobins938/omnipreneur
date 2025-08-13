import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footer } from "@/components/ui/footer";
import CALShowcase from "@/components/CALShowcase";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Star, Users, Zap } from 'lucide-react';

const navigationItems = [
  { label: "Tools", href: "/tools", description: "Explore our AI-powered tools" },
  { label: "Features", href: "/features", description: "Discover advanced capabilities" },
  { label: "Pricing", href: "/pricing", description: "Choose your plan" },
  { label: "About", href: "/about", description: "Learn about our mission" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      <Navigation items={navigationItems} />
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 300}px`,
                  height: `${Math.random() * 300}px`,
                  border: '1px solid rgba(255,255,255,0.1)',
                  animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-300">
              Enterprise AI Excellence
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transform your workflow with our cutting-edge AI tools. Built for the future, available today.
            </p>
            <div className="flex gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg"
                asChild
              >
                <Link href="/tools">Explore Tools</Link>
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-500/10 px-8 py-4 rounded-lg text-lg"
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats Cards */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-8 space-y-4">
          {[
            { title: 'Success Rate', value: '98.7%', description: 'Average success rate across all tools' },
            { title: 'User Satisfaction', value: '96.2%', description: 'Customer satisfaction score' },
            { title: 'Processing Speed', value: '0.3ms', description: 'Average response time' }
          ].map((stat, i) => (
            <StatsCard
              key={i}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              className="w-64"
            />
          ))}
        </div>
      </div>

      {/* CALShowcase Section */}
      <CALShowcase />

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Enterprise-Grade AI Tools</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful AI solutions designed for modern enterprises
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Codebase Search',
              description: 'Semantic search powered by advanced AI models',
              icon: '🔍',
              status: 'active',
              link: '/tools/codebase-search'
            },
            {
              title: 'AutoRewrite Engine',
              description: 'Transform content with intelligent rewriting',
              icon: '✍️',
              status: 'active',
              link: '/tools/auto-rewrite'
            },
            {
              title: 'Bundle Builder',
              description: 'Package and deploy with automated optimization',
              icon: '📦',
              status: 'beta',
              link: '/tools/bundle-builder'
            },
            {
              title: 'Content Spawner',
              description: 'Generate engaging content at scale',
              icon: '🎯',
              status: 'active',
              link: '/tools/content-spawner'
            },
            {
              title: 'Live Dashboard',
              description: 'Real-time analytics and monitoring',
              icon: '📊',
              status: 'active',
              link: '/tools/live-dashboard'
            },
            {
              title: 'Affiliate Portal',
              description: 'Track and manage partnerships effortlessly',
              icon: '🤝',
              status: 'coming-soon',
              link: '/tools/affiliate-portal'
            }
          ].map((tool, i) => (
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
                  <div className="flex justify-between items-center">
                    <Progress value={tool.status === 'active' ? 100 : tool.status === 'beta' ? 75 : 25} className="flex-1 mr-4" />
                    <Link href={tool.link}>
                      <Button variant="ghost" size="sm">
                        Explore →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold">Why Choose Our Platform?</h2>
            <div className="space-y-4">
              {[
                'Advanced AI Models',
                'Real-time Processing',
                'Enterprise Security',
                'Seamless Integration'
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <p className="text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[400px]"
          >
            {/* Add your feature visualization here */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl overflow-hidden">
              {/* Add dynamic visualization elements */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the next generation of enterprise AI solutions and elevate your business today.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
} 