'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title = "Product Demo" }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Content */}
            <div className="relative aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={title}
                />
              ) : (
                /* Demo placeholder - replace with actual video */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <Play className="w-12 h-12 text-white ml-1" />
                  </motion.div>
                  <h4 className="text-2xl font-bold mb-2">Omnipreneur Platform Tour</h4>
                  <p className="text-zinc-300 text-center max-w-md">
                    See how 27 AI tools work together to automate your business operations and scale your growth.
                  </p>
                  
                  {/* Demo features list */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="text-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mx-auto mb-2" />
                      <span>Content Generation</span>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2" />
                      <span>Workflow Automation</span>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mx-auto mb-2" />
                      <span>Analytics Dashboard</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-800/50 text-center">
              <p className="text-zinc-400 text-sm">
                Want to try it yourself? 
                <button className="ml-2 text-blue-400 hover:text-blue-300 transition-colors">
                  Start Free Trial
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}