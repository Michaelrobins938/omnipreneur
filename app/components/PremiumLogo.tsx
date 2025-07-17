"use client"
import React from 'react';
import { motion } from 'framer-motion';

const PremiumLogo: React.FC = () => {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Premium Brain Icon */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-full blur-lg opacity-20 animate-pulse" />
        
        {/* Main Icon Container */}
        <motion.div
          className="relative w-10 h-10 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full border border-zinc-700/50 flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {/* Neural Network Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              {/* Neural connections */}
              <path
                d="M8 12 L16 8 L24 12 L32 8 M8 20 L16 16 L24 20 L32 16 M8 28 L16 24 L24 28 L32 24"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.6"
              />
              {/* Nodes */}
              <circle cx="8" cy="12" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="16" cy="8" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="24" cy="12" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="32" cy="8" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="8" cy="20" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="16" cy="16" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="24" cy="20" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="32" cy="16" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="8" cy="28" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="16" cy="24" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="24" cy="28" r="1.5" fill="url(#nodeGradient)" />
              <circle cx="32" cy="24" r="1.5" fill="url(#nodeGradient)" />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          
          {/* Central Processing Unit */}
          <div className="relative z-10">
            <motion.div
              className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(6, 182, 212, 0.4)",
                  "0 0 20px rgba(6, 182, 212, 0.8)",
                  "0 0 0 rgba(6, 182, 212, 0.4)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-3 h-3 bg-white rounded-sm" />
            </motion.div>
          </div>
          
          {/* Animated Rings */}
          <motion.div
            className="absolute inset-0 border border-cyan-500/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute inset-0 border border-purple-500/30 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </div>
      
      {/* Text Logo */}
      <div className="flex flex-col">
        <motion.h1
          className="text-xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Omnipreneur
        </motion.h1>
        <motion.p
          className="text-xs text-zinc-400 font-medium tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          AI SUITE
        </motion.p>
      </div>
    </motion.div>
  );
};

export default PremiumLogo; 