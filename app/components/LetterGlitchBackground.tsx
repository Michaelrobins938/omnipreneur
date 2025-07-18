"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LetterGlitchBackground: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Predefined positions to avoid hydration mismatch
  const particlePositions = [
    { left: 10, top: 20, delay: 0, duration: 3 },
    { left: 25, top: 45, delay: 0.5, duration: 4 },
    { left: 40, top: 15, delay: 1, duration: 3.5 },
    { left: 60, top: 35, delay: 1.5, duration: 4.5 },
    { left: 80, top: 25, delay: 2, duration: 3.2 },
    { left: 15, top: 60, delay: 0.3, duration: 4.2 },
    { left: 35, top: 75, delay: 0.8, duration: 3.8 },
    { left: 55, top: 85, delay: 1.2, duration: 4.1 },
    { left: 75, top: 65, delay: 1.7, duration: 3.6 },
    { left: 90, top: 80, delay: 2.2, duration: 4.3 },
    { left: 5, top: 40, delay: 0.2, duration: 3.9 },
    { left: 30, top: 10, delay: 0.7, duration: 4.4 },
    { left: 50, top: 50, delay: 1.1, duration: 3.3 },
    { left: 70, top: 30, delay: 1.6, duration: 4.6 },
    { left: 85, top: 70, delay: 2.1, duration: 3.7 },
    { left: 20, top: 85, delay: 0.4, duration: 4.0 },
    { left: 45, top: 5, delay: 0.9, duration: 3.4 },
    { left: 65, top: 55, delay: 1.4, duration: 4.7 },
    { left: 95, top: 40, delay: 1.9, duration: 3.1 },
    { left: 10, top: 90, delay: 2.4, duration: 4.8 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay,
              ease: "easeInOut"
            }}
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        ))}
      </div>

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent h-px"
        animate={{
          y: ['0%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 1,
          ease: "linear"
        }}
      />

      {/* Glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5" />
    </div>
  );
};

export default LetterGlitchBackground; 