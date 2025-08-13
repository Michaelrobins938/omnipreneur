'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Key, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  Settings,
  Activity,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  lastUsed?: string;
  createdAt: string;
  usage: {
    requests: number;
    limit: number;
  };
  active: boolean;
}

interface CreateKeyForm {
  name: string;
  permissions: string[];
  expiresAt?: string;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'read', label: 'Read Access', description: 'View data and analytics' },
  { id: 'write', label: 'Write Access', description: 'Create and modify content' },
  { id: 'analytics', label: 'Analytics', description: 'Access usage and performance data' },
  { id: 'billing', label: 'Billing', description: 'View billing and subscription info' },
  { id: 'admin', label: 'Admin', description: 'Full administrative access' }
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [createForm, setCreateForm] = useState<CreateKeyForm>({
    name: '',
    permissions: ['read'],
    expiresAt: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keys', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data || []);
      } else {
        console.error('Failed to fetch API keys');
      }
      
      // Mock data
      const mockKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production API',
          key: 'omni_sk_live_abcd1234567890abcdef1234567890abcdef',
          prefix: 'omni_sk_live_',
          permissions: ['read', 'write', 'analytics'],
          lastUsed: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          usage: { requests: 15420, limit: 100000 },
          active: true
        },
        {
          id: '2',
          name: 'Development Testing',
          key: 'omni_sk_test_xyz9876543210xyz9876543210xyz987654',
          prefix: 'omni_sk_test_',
          permissions: ['read'],
          lastUsed: '2024-01-14T16:45:00Z',
          createdAt: '2024-01-10T12:00:00Z',
          usage: { requests: 2847, limit: 10000 },
          active: true
        }
      ];
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!createForm.name.trim()) {
      alert('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(createForm)
      });
      
      if (response.ok) {
        const data = await response.json();
        const newKey = data.data;
        
        setApiKeys(prev => [...prev, newKey]);
        setShowCreateModal(false);
        setCreateForm({ name: '', permissions: ['read'], expiresAt: '' });
        // Removed undefined modal setter; show key by revealing it
        setRevealedKeys(prev => new Set([...prev, newKey.id]));
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('Failed to create API key. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Mock creation fallback
  const createMockKey = () => {
    try {
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: createForm.name,
        key: `omni_sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        prefix: 'omni_sk_live_',
        permissions: createForm.permissions,
        createdAt: new Date().toISOString(),
        usage: { requests: 0, limit: 100000 },
        active: true
      };

      setApiKeys(prev => [newKey, ...prev]);
      setShowCreateModal(false);
      setCreateForm({ name: '', permissions: ['read'], expiresAt: '' });
      
      // Show the new key immediately
      setRevealedKeys(prev => new Set([...prev, newKey.id]));
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/keys/${keyId}`, { method: 'DELETE', credentials: 'include' });
      
      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
      } else {
        const errorData = await response.json();
        alert(errorData.error?.message || 'Failed to revoke API key');
        return;
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      alert('Failed to revoke API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUsagePercentage = (usage: ApiKey['usage']) => {
    return Math.round((usage.requests / usage.limit) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Key className="w-8 h-8 mr-3" />
                API Keys
              </h1>
              <p className="text-zinc-400 mt-2">Create and manage API tokens for programmatic access</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create API Key</span>
            </button>
          </div>
        </div>

        {/* API Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/20 border border-blue-800 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold text-blue-300">API Documentation</h3>
              <p className="text-sm text-blue-200">
                Learn how to integrate with our API. 
                <Link href="/docs/api" className="ml-2 underline hover:text-white">
                  View Documentation →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* API Keys List */}
        <div className="space-y-6">
          {apiKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center"
            >
              <Key className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No API Keys Yet</h3>
              <p className="text-zinc-400 mb-6">Create your first API key to start using our programmatic interface</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First API Key</span>
              </button>
            </motion.div>
          ) : (
            apiKeys.map((apiKey, index) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {apiKey.name}
                      {!apiKey.active && (
                        <span className="ml-2 px-2 py-1 bg-red-900 text-red-300 text-xs rounded">
                          Inactive
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Created {formatDate(apiKey.createdAt)}
                      {apiKey.lastUsed && (
                        <span className="ml-4">
                          Last used {formatDate(apiKey.lastUsed)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => revokeApiKey(apiKey.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Revoke API Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* API Key Display */}
                <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-zinc-400 mb-1">API Key</p>
                      <div className="font-mono text-sm">
                        {revealedKeys.has(apiKey.id) ? (
                          <span className="text-green-400">{apiKey.key}</span>
                        ) : (
                          <span className="text-zinc-500">
                            {apiKey.prefix}{'•'.repeat(32)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        title={revealedKeys.has(apiKey.id) ? 'Hide API Key' : 'Show API Key'}
                      >
                        {revealedKeys.has(apiKey.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      {revealedKeys.has(apiKey.id) && (
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="p-2 text-zinc-400 hover:text-white transition-colors"
                          title="Copy API Key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Permissions and Usage */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Permissions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {apiKey.permissions.map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded border border-purple-800"
                        >
                          {AVAILABLE_PERMISSIONS.find(p => p.id === permission)?.label || permission}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Usage This Month
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{apiKey.usage.requests.toLocaleString()} requests</span>
                        <span className="text-zinc-400">
                          {getUsagePercentage(apiKey.usage)}% of limit
                        </span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            getUsagePercentage(apiKey.usage) > 90
                              ? 'bg-red-500'
                              : getUsagePercentage(apiKey.usage) > 75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(getUsagePercentage(apiKey.usage), 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-6">Create New API Key</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., Production API"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {AVAILABLE_PERMISSIONS.map(permission => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={createForm.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCreateForm(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, permission.id]
                              }));
                            } else {
                              setCreateForm(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== permission.id)
                              }));
                            }
                          }}
                          className="mr-3 rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-white">{permission.label}</span>
                          <p className="text-xs text-zinc-400">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Expires (Optional)
                  </label>
                  <input
                    type="date"
                    value={createForm.expiresAt}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create API Key</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

