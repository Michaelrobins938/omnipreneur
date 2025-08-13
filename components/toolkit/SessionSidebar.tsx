'use client';

import * as React from 'react';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Tag, Clock } from 'lucide-react';

interface Session {
  id: string;
  createdAt: string;
  title: string;
  tags: string[];
  input: string;
  result: string;
  metrics: Record<string, number>;
}

interface SessionSidebarProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onCreateNew: () => void;
  title?: string;
}

export default function SessionSidebar({
  sessions,
  onSelectSession,
  onCreateNew,
  title = "Sessions"
}: SessionSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(sessions.flatMap(session => session.tags))
  );

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.input.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = !selectedTag || session.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <Button
          onClick={onCreateNew}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          New
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900/50 border-zinc-700 text-white"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          onClick={() => setSelectedTag(null)}
          size="sm"
          variant={selectedTag === null ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          <Tag className="w-3 h-3" />
          All
        </Button>
        {allTags.map(tag => (
          <Button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            size="sm"
            variant={tag === selectedTag ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </Button>
        ))}
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No sessions found</p>
            <p className="text-sm mt-2">Create your first session to get started</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="p-3 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 hover:bg-zinc-700/30 cursor-pointer transition-all"
            >
              <h3 className="font-medium text-white truncate">{session.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-wrap gap-1">
                  {session.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-700/50 rounded-full text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {session.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded-full text-zinc-300">
                      +{session.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-zinc-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}