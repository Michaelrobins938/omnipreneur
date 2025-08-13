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

const team = [
  {
    name: 'Dr. Sarah Chen',
    role: 'CEO & Founder',
    bio: 'Former AI researcher at Google, leading our mission to democratize AI.',
    avatar: '👩‍💼'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    bio: 'Expert in scalable AI systems with 15+ years in enterprise software.',
    avatar: '👨‍💻'
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Head of AI Research',
    bio: 'PhD in Machine Learning, specializing in natural language processing.',
    avatar: '👩‍🔬'
  },
  {
    name: 'Alex Thompson',
    role: 'VP of Product',
    bio: 'Product leader with experience at Stripe and Airbnb.',
    avatar: '👨‍💼'
  }
];

export default function AboutPage() {
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
            About AI Enterprise
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're on a mission to make enterprise-grade AI accessible to every business, 
            empowering teams to work smarter and achieve more.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300 leading-relaxed">
                Founded in 2023, AI Enterprise was born from the belief that artificial intelligence 
                should be accessible to businesses of all sizes. We've assembled a team of world-class 
                engineers, researchers, and product experts to build the most powerful and user-friendly 
                AI platform for enterprise use.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mt-4">
                Our platform combines cutting-edge AI models with intuitive interfaces, enabling teams 
                to automate complex tasks, generate insights, and create content at unprecedented speed 
                and quality.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="text-4xl mb-4">{member.avatar}</div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="text-blue-400">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
} 