"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface SplashCursorProps {
  size?: number;
  trailLength?: number;
  color?: string;
  opacity?: number;
}

const SplashCursor: React.FC<SplashCursorProps> = ({
  size = 20,
  trailLength = 8,
  color = '#06b6d4', // cyan-500
  opacity = 0.3
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      cursorX.set(clientX);
      cursorY.set(clientY);
      setIsVisible(true);

      // Update trail
      setTrail(prev => {
        const newTrail = [...prev, { x: clientX, y: clientY }];
        if (newTrail.length > trailLength) {
          return newTrail.slice(-trailLength);
        }
        return newTrail;
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, trailLength]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      >
        <div
          className="relative"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
          }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Inner dot */}
          <motion.div
            className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
            animate={{
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Trail effect */}
      {trail.map((point, index) => (
        <motion.div
          key={index}
          className="fixed pointer-events-none z-[9998]"
          style={{
            x: point.x,
            y: point.y,
            opacity: (index / trail.length) * opacity,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: (index / trail.length) * opacity }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/40"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              marginLeft: -(size * 0.6) / 2,
              marginTop: -(size * 0.6) / 2,
            }}
          />
        </motion.div>
      ))}

      {/* Click effect */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: [0, 1.5, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="rounded-full border border-cyan-400/60"
          style={{
            width: size * 2,
            height: size * 2,
            marginLeft: -(size * 2) / 2,
            marginTop: -(size * 2) / 2,
          }}
        />
      </motion.div>
    </>
  );
};

export default SplashCursor; 