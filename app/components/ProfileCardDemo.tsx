"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket, 
  FaUsers, 
  FaLightbulb, 
  FaChartLine, 
  FaShieldAlt, 
  FaGlobe 
} from 'react-icons/fa';
import ProfileCard from './ProfileCard';

const ProfileCardDemo = () => {
  const sampleProfiles = [
    {
      icon: FaRocket,
      title: 'AI Innovation',
      description: 'Cutting-edge artificial intelligence solutions',
      gradient: 'from-blue-500 to-cyan-500',
      stats: {
        value: '99%',
        label: 'Accuracy Rate'
      },
      features: ['Machine Learning', 'Neural Networks', 'Deep Learning']
    },
    {
      icon: FaUsers,
      title: 'Team Collaboration',
      description: 'Seamless team coordination and communication',
      gradient: 'from-green-500 to-emerald-500',
      stats: {
        value: '50+',
        label: 'Team Members'
      },
      features: ['Real-time Chat', 'File Sharing', 'Project Management']
    },
    {
      icon: FaLightbulb,
      title: 'Creative Solutions',
      description: 'Innovative problem-solving approaches',
      gradient: 'from-purple-500 to-pink-500',
      stats: {
        value: '200+',
        label: 'Projects Completed'
      },
      features: ['Design Thinking', 'User Research', 'Prototyping']
    },
    {
      icon: FaChartLine,
      title: 'Data Analytics',
      description: 'Advanced data analysis and insights',
      gradient: 'from-orange-500 to-red-500',
      stats: {
        value: '1M+',
        label: 'Data Points'
      },
      features: ['Predictive Analytics', 'Visualization', 'Reporting']
    },
    {
      icon: FaShieldAlt,
      title: 'Security First',
      description: 'Enterprise-grade security and compliance',
      gradient: 'from-indigo-500 to-purple-500',
      stats: {
        value: '100%',
        label: 'Uptime'
      },
      features: ['Encryption', 'Backup', 'Monitoring']
    },
    {
      icon: FaGlobe,
      title: 'Global Reach',
      description: 'Worldwide deployment and support',
      gradient: 'from-teal-500 to-cyan-500',
      stats: {
        value: '25+',
        label: 'Countries'
      },
      features: ['Multi-language', 'Localization', '24/7 Support']
    }
  ];

  return (
    <section className="w-full py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6">
          FEATURE CARDS
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
          Explore our comprehensive suite of AI-powered features and capabilities.
        </p>
      </div>
      
      {/* Profile Cards Grid */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProfiles.map((profile, index) => (
            <ProfileCard
              key={index}
              {...profile}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileCardDemo; 