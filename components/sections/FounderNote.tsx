'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/utils/motion';

export default function FounderNote() {
	const prefersReducedMotion = useReducedMotion();

	const motionProps = prefersReducedMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
		: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

	return (
		<section aria-labelledby="founder-note-heading" className="py-16">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div {...motionProps} className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 backdrop-blur-xl">
					<h3 id="founder-note-heading" className="sr-only">Founder note</h3>
					<div className="flex items-start gap-4">
						<div aria-hidden className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
						<div className="text-zinc-300 text-base leading-relaxed">
							<p className="italic">
								I built Omnipreneur after years of duct-taping tools together. When everything clicks, you ship faster—and it shows up in revenue.
							</p>
							<p className="mt-4">
								Try it for yourself. If you don’t see a measurable lift in 30 days, you get your money back.
							</p>
							<p className="mt-4 text-sm text-zinc-400">
								<strong className="text-white">Michael Chen</strong>, Founder & CEO
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}



