"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface ProfileCardProps {
  icon: IconType;
  title: string;
  description: string;
  gradient: string;
  stats?: {
    value: string;
    label: string;
  };
  features?: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  stats,
  features
}) => {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 p-6">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-zinc-400 text-sm">{description}</p>
            </div>
          </div>

          {/* Stats (if provided) */}
          {stats && (
            <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.value}</div>
              <div className="text-zinc-400 text-sm">{stats.label}</div>
            </div>
          )}

          {/* Features (if provided) */}
          {features && (
            <div className="space-y-2">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  <span className="text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <motion.button
            className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </motion.div>
  );
};

export default ProfileCard; 