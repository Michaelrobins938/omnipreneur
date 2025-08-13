// app/novus/sessions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import { NovusSession } from '@/lib/novus/types';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function NovusSessions() {
  const [sessions, setSessions] = useState<NovusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/novus/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/novus/sessions/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload sessions
        loadSessions();
      } else {
        alert(data.error?.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Delete session error:', error);
      alert('An error occurred while deleting the session');
    }
  };

  return (
    <ProductAccessControl
      productId="novus-protocol"
      productName="NOVUS Protocol"
      requiredPlans={['NOVUS_PROTOCOL', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
      <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My NOVUS Sessions</h1>
              <p className="text-zinc-400">Saved prompt optimization sessions</p>
            </div>
            <Link href="/novus/workspace">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                New Session
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-zinc-400">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
                <p className="text-zinc-400 mb-6">
                  Optimize your first prompt to save a session
                </p>
                <Link href="/novus/workspace">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Create Session
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => (
                <div 
                  key={session.id} 
                  className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white truncate">
                      {session.title}
                    </h3>
                    <Button
                      onClick={() => handleDeleteSession(session.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-zinc-400 mb-4 line-clamp-3">
                    {session.input}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-zinc-700/50 rounded-full text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-zinc-500">
                    <span>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/novus/workspace?session=${session.id}`}>
                      <Button variant="secondary" size="sm" className="flex items-center gap-1">
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProductAccessControl>
  );
}