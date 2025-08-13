'use client'

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface SupportWidgetProps {
	label?: string;
	href?: string; // External help center or chat link
}

export default function SupportWidget({ label = 'Support', href = '/support' }: SupportWidgetProps) {
	const [open, setOpen] = useState(false);

	if (open) {
		return (
			<div className="fixed bottom-4 right-4 z-50">
				<div className="w-80 max-w-[90vw] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
					<div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
						<div className="flex items-center gap-2 text-sm text-white">
							<MessageCircle className="w-4 h-4" />
							<span>How can we help?</span>
						</div>
						<button aria-label="Close support" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-zinc-800">
							<X className="w-4 h-4 text-zinc-400" />
						</button>
					</div>
					<div className="p-4 text-sm text-zinc-300">
						<p className="mb-3">Visit our Help Center, browse FAQs, or open a ticket.</p>
						<a
							href={href}
							className="inline-flex items-center justify-center w-full rounded-xl px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold"
							aria-label="Open support portal"
							target={href.startsWith('http') ? '_blank' : undefined}
							rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
						>
							Open Support
						</a>
					</div>
				</div>
			</div>
		);
	}

	return (
		<button
			className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/25"
			onClick={() => setOpen(true)}
			aria-label="Open support"
		>
			<MessageCircle className="w-5 h-5" />
			<span className="hidden sm:inline text-sm font-semibold">{label}</span>
		</button>
	);
}



