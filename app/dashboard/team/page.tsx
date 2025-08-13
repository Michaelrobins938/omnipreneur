'use client';

import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-zinc-400 mt-2">Invite teammates and manage roles. TODO: implement.</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Members</h2>
            <p className="text-zinc-400">No members yet. TODO: list and manage members.</p>
          </div>

          <div className="text-zinc-500 text-sm">
            <Link href="/dashboard" className="underline hover:text-white">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

