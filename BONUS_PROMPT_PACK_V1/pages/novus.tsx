import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const NovusPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>NOVUS - Our Flagship AI Agent</title>
        <meta name="description" content="Experience the future of AI automation with NOVUS, our most advanced agent" />
      </Head>
      
      <div className="min-h-screen bg-[#0D1117] text-white">
        <main className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Hero Section */}
          <div className="rounded-3xl bg-gradient-to-b from-[#1A2233] to-[#0D1117] p-12 mb-16">
            <h1 className="text-center text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#3AA8FF] to-[#4CCAFF] text-transparent bg-clip-text">
              NOVUS - Our Flagship AI Agent
            </h1>
            <p className="text-center text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              The crown jewel of our suite - an autonomous AI agent that combines all our technologies into one powerful system
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="feature-card">
                <h3 className="text-[#4AE087] text-lg font-semibold mb-2">Active Learning</h3>
                <p className="text-gray-400">Continuously improves through real-world interactions</p>
              </div>
              <div className="feature-card">
                <h3 className="text-[#3AA8FF] text-lg font-semibold mb-2">Autonomous Operation</h3>
                <p className="text-gray-400">Works independently with minimal human oversight</p>
              </div>
              <div className="feature-card">
                <h3 className="text-[#B87AFF] text-lg font-semibold mb-2">Multi-Platform Integration</h3>
                <p className="text-gray-400">Seamlessly connects with various systems and platforms</p>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="metrics-card">
                <h3 className="text-2xl font-bold mb-6">Performance Metrics</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span>Task Completion</span>
                    <span className="text-[#4AE087]">98.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>User Satisfaction</span>
                    <span className="text-[#3AA8FF]">96.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue Generated</span>
                    <span className="text-[#B87AFF]">$2.3M+</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#1A2233]">
                <div className="w-24 h-24 mb-6">
                  <img 
                    src="/robot.png" 
                    alt="NOVUS Agent" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-[#3AA8FF] mb-4">NOVUS Agent</h2>
                <p className="text-gray-300 mb-8">
                  Experience the future of AI automation with our most advanced agent
                </p>
                <button 
                  onClick={() => router.push('/contact')}
                  className="px-8 py-3 bg-gradient-to-r from-[#3AA8FF] to-[#4CCAFF] rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Access NOVUS
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NovusPage; 