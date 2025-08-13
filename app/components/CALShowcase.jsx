"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const stages = [
  {
    id: 'deconstruct',
    name: 'Deconstruct',
    description: 'Extract core intent, key entities, and context from raw input using advanced NLP.',
    icon: '🔍',
    color: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    id: 'diagnose',
    name: 'Diagnose',
    description: 'Identify clarity gaps, ambiguity, and optimization opportunities through AI analysis.',
    icon: '🧠',
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    id: 'develop',
    name: 'Develop',
    description: 'Select optimal techniques and assign AI roles for maximum performance.',
    icon: '⚡',
    color: 'from-indigo-500/20 to-violet-500/20'
  },
  {
    id: 'deliver',
    name: 'Deliver',
    description: 'Construct precision-crafted prompts with implementation guidance and validation.',
    icon: '🚀',
    color: 'from-violet-500/20 to-cyan-500/20'
  }
];

const CALShowcase = () => {
  const [activeStage, setActiveStage] = useState(stages[0]);

  return (
    <section className="w-full py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 tracking-tight">
            CAL™ Technology
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Our proprietary Cognitive Architecture Layering engine transforms basic inputs into precision-crafted AI commands.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Visualization */}
          <motion.div 
            className="relative aspect-square max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_8s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full border border-white/10 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-12 rounded-full border border-white/10 animate-[spin_4s_linear_infinite_reverse]" />
            
            {/* Stage Indicators */}
            {stages.map((stage, index) => {
              const angle = (index * 360) / stages.length;
              const isActive = stage.id === activeStage.id;
              return (
                <motion.button
                  key={stage.id}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`
                  }}
                  onClick={() => setActiveStage(stage)}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    filter: isActive ? 'brightness(1.2)' : 'brightness(1)'
                  }}
                  className={`w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center text-2xl
                    ${isActive ? 'bg-cyan-500/30 text-cyan-400' : 'bg-zinc-800/50 text-zinc-400'}
                    transition-all duration-300 hover:bg-cyan-500/20 hover:text-cyan-400`}
                >
                  {stage.icon}
                </motion.button>
              );
            })}

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-4xl"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                🧠
              </motion.div>
            </div>
          </motion.div>

          {/* Stage Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <motion.h3 
                key={activeStage.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-orbitron font-bold text-white mb-4"
              >
                {activeStage.name}
              </motion.h3>
              <motion.p 
                key={`${activeStage.id}-desc`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-zinc-400"
              >
                {activeStage.description}
              </motion.p>
            </div>

            {/* Stage Navigation */}
            <div className="grid grid-cols-2 gap-4">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage)}
                  className={`p-4 rounded-xl transition-all duration-300 text-left
                    ${stage.id === activeStage.id
                      ? 'bg-gradient-to-r ' + stage.color + ' border border-white/10'
                      : 'bg-zinc-900/30 hover:bg-white/5'}`}
                >
                  <div className="text-2xl mb-2">{stage.icon}</div>
                  <div className={`font-orbitron font-bold mb-1
                    ${stage.id === activeStage.id ? 'text-white' : 'text-zinc-400'}`}>
                    {stage.name}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CALShowcase; 