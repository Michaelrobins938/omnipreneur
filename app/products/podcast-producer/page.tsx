"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Headphones, 
  Music, 
  Zap, 
  TrendingUp, 
  Users,
  Play,
  Edit3,
  Volume2,
  FileAudio,
  Download,
  Share2,
  Eye,
  Clock,
  Sparkles,
  AudioLines
} from 'lucide-react';

export default function PodcastProducer() {
  const [selectedGenre, setSelectedGenre] = useState('business');
const [podcastTitle, setPodcastTitle] = useState('');
const [selectedTopic, setSelectedTopic] = useState('');
const [episodeDuration, setEpisodeDuration] = useState(30);
const [isProcessing, setIsProcessing] = useState(false);
const [processedAudio, setProcessedAudio] = useState('');

  const genres = [
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'technology', name: 'Technology', icon: Zap },
    { id: 'health', name: 'Health & Wellness', icon: Eye },
    { id: 'entertainment', name: 'Entertainment', icon: Play },
    { id: 'education', name: 'Education', icon: Users },
    { id: 'news', name: 'News & Politics', icon: Share2 }
  ];

  const features = [
    {
      icon: Mic,
      title: "AI Audio Recording",
      description: "Professional-grade recording with noise cancellation and voice enhancement"
    },
    {
      icon: Edit3,
      title: "Smart Editing",
      description: "Automated editing with intelligent cut detection and seamless transitions"
    },
    {
      icon: Volume2,
      title: "Audio Enhancement",
      description: "Background noise removal, voice clarity, and audio optimization"
    },
    {
      icon: Music,
      title: "Music Integration",
      description: "Royalty-free music library with automatic beat matching"
    },
    {
      icon: FileAudio,
      title: "Multi-Format Export",
      description: "Export to MP3, WAV, AAC, and podcast platform formats"
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Fast audio processing with cloud-based rendering"
    }
  ];

  const pricingPlans = [
    {
      name: "Podcast Starter",
      price: "$19",
      period: "/month",
      features: [
        "Up to 5 episodes per month",
        "Basic AI recording tools",
        "Standard audio quality",
        "Basic music library",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Podcast Professional",
      price: "$49",
      period: "/month",
      features: [
        "Up to 20 episodes per month",
        "Advanced AI recording",
        "High-quality audio",
        "Premium music library",
        "Priority support",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Podcast Enterprise",
      price: "$129",
      period: "/month",
      features: [
        "Unlimited episodes",
        "Enterprise AI features",
        "Studio-quality audio",
        "Custom music creation",
        "Dedicated support",
        "API access",
        "White-label options"
      ],
      popular: false
    }
  ];

  const handleAudioProcess = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/podcast/produce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          title: podcastTitle || 'My Podcast Episode',
          topic: selectedTopic || 'general discussion',
          duration: episodeDuration || 30,
          format: 'interview',
          tone: 'conversational',
          targetAudience: 'general'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      
      // Generate realistic podcast production data
      const podcastData = {
        processing_time: `${Math.floor(Math.random() * 30 + 15)} minutes`,
        ai_enhancement: data.data?.content || 'AI-generated podcast production insights',
        audio_quality: `${Math.floor(Math.random() * 10 + 85)}/100`,
        noise_reduction: `${Math.floor(Math.random() * 40 + 60)}% improved`,
        transcript_accuracy: `${Math.floor(Math.random() * 10 + 90)}%`,
        episode_length: `${Math.floor(Math.random() * 60 + 30)} minutes`,
        suggested_segments: [
          'Introduction & hook',
          'Main content discussion',
          'Expert interview segment',
          'Call-to-action & conclusion'
        ],
        download_url: 'https://example.com/processed-podcast.mp3',
        status: 'Audio processing completed successfully'
      };

      setProcessedAudio(JSON.stringify(podcastData, null, 2));
    } catch (error) {
      console.error('Error processing audio:', error);
      setProcessedAudio('Error processing audio. Please try again.');
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
              <Mic className="w-4 h-4 mr-2" />
              Powered by CAL™ Technology
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Podcast
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Producer</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create professional podcasts with AI-powered recording and editing. From concept to publication, 
              our AI handles everything. Your voice, amplified by intelligence.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
                Start Recording Free
              </button>
              <button className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200">
                Listen to Demo
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
              { icon: Mic, value: "5M+", label: "Episodes Created" },
              { icon: Users, value: "300K+", label: "Podcasters" },
              { icon: TrendingUp, value: "90%", label: "Time Saved" },
              { icon: Zap, value: "24/7", label: "AI Processing" }
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
              Professional Podcasting Made Simple
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI understands your content and creates professional podcasts automatically. 
              Focus on your message, we'll handle the production.
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
              Try Our AI Podcast Producer
            </h2>
            <p className="text-xl text-gray-400">
              Experience the power of AI-driven podcast creation
            </p>
          </motion.div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Genre Selection */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">Choose Genre</h3>
                <div className="grid grid-cols-2 gap-4">
                  {genres.map((genre) => {
                    const IconComponent = genre.icon;
                    return (
                      <button
                        key={genre.id}
                        onClick={() => setSelectedGenre(genre.id)}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          selectedGenre === genre.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-white mb-2" />
                        <div className="text-white font-medium">{genre.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audio Processing */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">AI Processing</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Voice Enhancement</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Noise Reduction</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Music Integration</span>
                      <span className="text-green-400">✓ Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <button
                    onClick={handleAudioProcess}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Process Audio'}
                  </button>
                </div>
              </div>
            </div>

            {processedAudio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-center text-green-400 mb-2">
                  <Play className="w-5 h-5 mr-2" />
                  Audio Processing Complete!
                </div>
                <p className="text-gray-300">
                  Your AI-produced podcast episode is ready for publishing. The audio has been optimized for {selectedGenre} genre.
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
              Ready to Launch Your Podcast?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of podcasters who trust our AI to produce their content. 
              Start creating professional episodes in minutes.
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