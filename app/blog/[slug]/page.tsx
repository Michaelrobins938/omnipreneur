"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getPostBySlug } from "../_posts";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug as string) || "";
  const post = getPostBySlug(slug);
  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Post not found</h1>
          <p className="text-zinc-400 mb-6">The article you are looking for does not exist or may have been moved.</p>
          <Link href="/blog" className="text-cyan-400 hover:text-cyan-300">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-zinc-400">
              <Link href="/blog" className="hover:text-white">← Back to Blog</Link>
              <span>•</span>
              <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs font-semibold">{post.category}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readMinutes} min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              {post.title}
            </h1>
            <p className="text-zinc-400 text-lg">{post.excerpt}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert prose-zinc">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="text-zinc-300 leading-7">{paragraph}</p>
          ))}

          <div className="mt-10 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <p className="text-sm text-zinc-400">
              Written by <span className="text-white font-medium">{post.author}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

