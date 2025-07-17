"use client"
import React from 'react';
import { motion } from 'framer-motion';

const InfiniteMenu = () => {
  const menuItems = [
    { id: 1, title: 'AI Technology', icon: '🤖', color: 'from-purple-500 to-pink-500' },
    { id: 2, title: 'Robotics', icon: '⚙️', color: 'from-cyan-500 to-blue-500' },
    { id: 3, title: 'Automation', icon: '🔧', color: 'from-green-500 to-emerald-500' },
    { id: 4, title: 'Machine Learning', icon: '🧠', color: 'from-indigo-500 to-purple-500' },
    { id: 5, title: 'IoT Solutions', icon: '📡', color: 'from-orange-500 to-red-500' },
    { id: 6, title: 'Cloud Computing', icon: '☁️', color: 'from-blue-500 to-cyan-500' },
    { id: 7, title: 'Data Analytics', icon: '📊', color: 'from-teal-500 to-green-500' },
    { id: 8, title: 'Cybersecurity', icon: '🔒', color: 'from-red-500 to-pink-500' },
    { id: 9, title: 'Blockchain', icon: '⛓️', color: 'from-yellow-500 to-orange-500' },
    { id: 10, title: 'Quantum Computing', icon: '⚛️', color: 'from-violet-500 to-purple-500' },
    { id: 11, title: 'Edge Computing', icon: '🌐', color: 'from-emerald-500 to-teal-500' },
    { id: 12, title: '5G Networks', icon: '📶', color: 'from-pink-500 to-rose-500' },
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...menuItems, ...menuItems, ...menuItems];

  return (
    <section className="w-full py-16 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950" />
      
      {/* Section Title */}
      <div className="text-center mb-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Our Technology Stack
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Explore our comprehensive range of cutting-edge technologies and services
        </p>
      </div>

      {/* Infinite Menu Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="relative overflow-hidden">
          {/* First Row - Forward Scroll */}
          <motion.div
            className="flex gap-6 mb-8"
            animate={{
              x: [0, -50 * menuItems.length]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-64 h-32 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 p-6 hover:border-zinc-600/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                  <div className="flex items-center gap-4 h-full">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        Advanced solutions
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second Row - Reverse Scroll */}
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-50 * menuItems.length, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedItems.map((item, index) => (
              <motion.div
                key={`reverse-${item.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-64 h-32 bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-800/50 p-6 hover:border-zinc-600/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                  <div className="flex items-center gap-4 h-full">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm">
                        Innovative technology
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Interactive Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-6 py-3 bg-zinc-900/80 border border-zinc-700 text-zinc-300 rounded-full hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300">
            View All Services
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};

export default InfiniteMenu; 