"use client"
import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would handle form submission
    alert('Contact form submission - This would be connected to your CRM/email system.');
  };

  return (
    <section className="w-full py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6 tracking-tight">
                Get Started Today
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                Transform your business with enterprise-grade AI technology. Our team is ready to help you implement the perfect solution.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="text-2xl mb-2">📧</div>
                <h3 className="text-lg font-orbitron font-bold text-white mb-1">Email Us</h3>
                <p className="text-zinc-400">enterprise@omnipreneur.ai</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="text-lg font-orbitron font-bold text-white mb-1">Schedule a Demo</h3>
                <p className="text-zinc-400">Book a personalized demo with our team</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl transform -rotate-1" />
            <form onSubmit={handleSubmit} className="relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-orbitron text-zinc-400 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-orbitron text-zinc-400 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-orbitron text-zinc-400 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-orbitron text-zinc-400 mb-2">Message</label>
                  <textarea
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 h-32"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-orbitron font-bold py-4 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 