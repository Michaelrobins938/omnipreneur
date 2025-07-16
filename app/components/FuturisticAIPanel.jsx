"use client"
import React from 'react';
import Image from 'next/image';

// Import the robot head image from the reference design
const robotImg = "/images/robot-head-metallic.png";
const videoImg = "/images/tech-showcase.png";

const FuturisticAIPanel = () => {
  const handlePlayVideo = () => {
    // Video player functionality would go here
    // Logging removed for production
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center py-8 md:py-12 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
        {/* Left Column: Video Card */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="aspect-video relative">
              <Image 
                src={videoImg} 
                alt="Technology Showcase"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
              <button 
                onClick={handlePlayVideo}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/20 transition-all duration-300"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-orbitron text-white text-sm md:text-base tracking-wider">
                UNLOCK THE POTENTIAL OF AI AND ROBOTICS
              </h3>
            </div>
          </div>
        </div>

        {/* Right Column: Robot Head */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
            <Image 
              src={robotImg} 
              alt="AI Robot Head"
              width={600}
              height={600}
              className="w-full h-auto relative z-10"
            />
          </div>
        </div>
      </div>

      {/* Headline Section */}
      <div className="text-center mt-12 md:mt-16 relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white tracking-wider leading-tight mb-6">
          UNLOCK THE POTENTIAL OF<br />AI AND ROBOTICS
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          Transform your business with cutting-edge AI technology and advanced robotics solutions. Experience the future of automation and intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-orbitron rounded-full hover:brightness-110 transition-all duration-300">
            Explore Technology
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-orbitron rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default FuturisticAIPanel; 