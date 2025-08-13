"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";

const assets = [
  { name: "Primary Logo (SVG)", path: "/favicon.svg" },
  { name: "Notched Double (SVG)", path: "/notched-double.svg" },
  { name: "Notched Double Glass (SVG)", path: "/notched-double-glass.svg" },
];

export default function PressKit() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Press Kit
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Download logos and brand assets for editorial use. For additional formats, contact
              {" "}
              <a href="mailto:press@omnipreneur.ai" className="text-cyan-400 hover:text-cyan-300">
                press@omnipreneur.ai
              </a>
              .
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset, idx) => (
              <motion.a
                key={asset.path}
                href={asset.path}
                download
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 group flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{asset.name}</h3>
                  <p className="text-zinc-500 text-sm">Click to download</p>
                </div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500/30">
                  <FaDownload />
                </span>
              </motion.a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/press"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Press
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

