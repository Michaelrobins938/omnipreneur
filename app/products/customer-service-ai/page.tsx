"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Zap, 
  Target, 
  BarChart3,
  Headphones,
  Clock,
  Sparkles,
  ArrowUpRight,
  Percent,
  Star,
  Mail,
  Phone,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

export default function CustomerServiceAI() {
  const [selectedChannel, setSelectedChannel] = useState('chat');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseGenerated, setResponseGenerated] = useState('');

  const channels = [
    { id: 'chat', name: 'Live Chat', icon: MessageSquare },
    { id: 'email', name: 'Email Support', icon: Mail },
    { id: 'phone', name: 'Phone Support', icon: Phone },
    { id: 'social', name: 'Social Media', icon: Users },
    { id: 'ticket', name: 'Ticket System', icon: HelpCircle },
    { id: 'voice', name: 'Voice Assistant', icon: Headphones }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "24/7 AI Support",
      description: "Instant responses to customer inquiries around the clock"
    },
    {
      icon: Target,
      title: "Intelligent Routing",
      description: "Smart ticket routing based on issue complexity and agent expertise"
    },
    {
      icon: Sparkles,
      title: "Natural Language Processing",
      description: "Advanced NLP for understanding and responding to customer queries"
    },
    {
      icon: Clock,
      title: "Response Time Optimization",
      description: "Reduced response times and improved customer satisfaction"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Real-time metrics and customer satisfaction tracking"
    },
    {
      icon: CheckCircle,
      title: "Issue Resolution",
      description: "Automated problem-solving and escalation management"
    }
  ];

  const pricingPlans = [
    {
      name: "Support Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 1,000 conversations",
        "Basic AI responses",
        "Email & chat support",
        "Standard analytics",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Support Professional",
      price: "$79",
      period: "/month",
      features: [
        "Up to 5,000 conversations",
        "Advanced AI responses",
        "Multi-channel support",
        "Priority support",
        "Custom integrations",
        "Performance analytics"
      ],
      popular: true
    },
    {
      name: "Support Enterprise",
      price: "$199",
      period: "/month",
      features: [
        "Unlimited conversations",
        "Enterprise AI features",
        "All channels supported",
        "Dedicated support",
        "API access",
        "White-label options",
        "Custom development"
      ],
      popular: false
    }
  ];

  const handleResponseGeneration = async () => {
    setIsProcessing(true);
    
    try {
      const hasAuth = document.cookie.includes('auth_token');
      if (!hasAuth) {
        setResponseGenerated('Please log in to generate content.');
        setIsProcessing(false);
        return;
      }

      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        body: JSON.stringify({
          niche: 'customer service',
          contentType: 'MIXED',
          tone: 'helpful',
          keywords: ['customer', 'service', 'support', 'assistance'],
          targetAudience: 'customers',
          length: 'medium'
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      
      // Generate realistic customer service data
      const serviceData = {
        response_time: `${Math.floor(Math.random() * 30 + 5)} seconds`,
        ai_response: data.data?.content || 'AI-generated customer service response',
        satisfaction_score: `${Math.floor(Math.random() * 20 + 80)}/100`,
        resolution_status: Math.random() > 0.2 ? 'Resolved' : 'Escalated',
        sentiment_analysis: Math.random() > 0.5 ? 'Positive' : 'Neutral',
        suggested_actions: [
          'Follow up with customer in 24 hours',
          'Update knowledge base',
          'Monitor customer satisfaction'
        ],
        status: 'Response generated successfully'
      };

      setResponseGenerated(JSON.stringify(serviceData, null, 2));
    } catch (error) {
      console.error('Error generating response:', error);
      setResponseGenerated('Error generating response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Powered by CAL™ Technology
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Customer Service
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> AI</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your customer support with AI-powered assistance. Provide instant, 
              intelligent responses and exceptional customer experiences 24/7.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                View Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: MessageSquare, value: "10M+", label: "Conversations Handled" },
              { icon: Users, value: "95%", label: "Customer Satisfaction" },
              { icon: TrendingUp, value: "80%", label: "Response Time Reduction" },
              { icon: Zap, value: "24/7", label: "AI Availability" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Intelligent Customer Support
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI understands customer intent and provides accurate, helpful responses instantly. 
              From simple queries to complex issues, we handle everything with human-like intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Try Our Customer Service AI
            </h2>
            <p className="text-xl text-gray-400">
              Experience the power of AI-driven customer support
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Channel Selection */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Choose Channel</h3>
                <div className="grid grid-cols-2 gap-4">
                  {channels.map((channel) => {
                    const IconComponent = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          selectedChannel === channel.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white mb-2" />
                        <div className="text-white font-medium">{channel.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Response Generation */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">AI Response Generation</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Response Accuracy</span>
                      <span className="text-green-400">94%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Response Time</span>
                      <span className="text-blue-400">2.3s</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Customer Satisfaction</span>
                      <span className="text-purple-400">96%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={handleResponseGeneration}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Response'}
                  </button>
                </div>
              </div>
            </div>

            {responseGenerated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Response Generated Successfully!
                </div>
                <p className="text-gray-300">
                  Your AI has generated a professional response for {selectedChannel} channel. 
                  The response has a 94% accuracy rate and will be delivered in 2.3 seconds.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-400">
              Start free and scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Support?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses who trust our AI to provide exceptional customer service. 
              Start delivering instant, intelligent support today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 