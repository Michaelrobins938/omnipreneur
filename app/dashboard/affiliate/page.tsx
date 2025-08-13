'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  ExternalLink, 
  BarChart3, 
  DollarSign, 
  Users, 
  Eye, 
  Edit3, 
  Trash2, 
  Copy, 
  Calendar,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  Filter,
  Download,
  Search,
  QrCode,
  Shield,
  Activity,
  Globe
} from 'lucide-react';

interface AffiliateLink {
  id: string;
  linkId: string;
  originalUrl: string;
  affiliateUrl: string;
  campaignName?: string;
  commissionRate: number;
  clicks: number;
  conversions: number;
  revenue: number;
  createdAt: string;
  active: boolean;
  lastClick?: string;
  description?: string;
}

interface CreateLinkForm {
  originalUrl: string;
  campaignName: string;
  commissionRate: number;
  description: string;
  customSlug: string;
  expiryDate: string;
  generateQRCode: boolean;
}

interface Analytics {
  summary: {
    totalLinks: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    averageConversionRate: number;
    averageCommissionRate: number;
  };
  links: AffiliateLink[];
}

export default function AffiliateManagementPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [createForm, setCreateForm] = useState<CreateLinkForm>({
    originalUrl: '',
    campaignName: '',
    commissionRate: 10,
    description: '',
    customSlug: '',
    expiryDate: '',
    generateQRCode: false
  });

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/affiliate/analytics', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        setAnalytics(result.data);
        setLinks(result.data.links || []);
      } else {
        // Mock data for demonstration
        const mockData: Analytics = {
          summary: {
            totalLinks: 3,
            totalClicks: 1247,
            totalConversions: 89,
            totalRevenue: 4380.50,
            averageConversionRate: 7.1,
            averageCommissionRate: 15.0
          },
          links: [
            {
              id: '1',
              linkId: 'product-launch-2024',
              originalUrl: 'https://example.com/product',
              affiliateUrl: 'https://omni.com/r/product-launch-2024',
              campaignName: 'Product Launch 2024',
              commissionRate: 20,
              clicks: 567,
              conversions: 45,
              revenue: 2250.00,
              createdAt: '2024-01-15T10:00:00Z',
              active: true,
              lastClick: '2024-01-20T14:30:00Z',
              description: 'Main product launch campaign'
            },
            {
              id: '2',
              linkId: 'holiday-special',
              originalUrl: 'https://example.com/holiday',
              affiliateUrl: 'https://omni.com/r/holiday-special',
              campaignName: 'Holiday Special',
              commissionRate: 15,
              clicks: 423,
              conversions: 28,
              revenue: 1680.00,
              createdAt: '2024-01-10T08:00:00Z',
              active: true,
              lastClick: '2024-01-19T16:45:00Z',
              description: 'Holiday promotion campaign'
            },
            {
              id: '3',
              linkId: 'beta-testing',
              originalUrl: 'https://example.com/beta',
              affiliateUrl: 'https://omni.com/r/beta-testing',
              campaignName: 'Beta Testing Program',
              commissionRate: 10,
              clicks: 257,
              conversions: 16,
              revenue: 450.50,
              createdAt: '2024-01-05T12:00:00Z',
              active: false,
              lastClick: '2024-01-18T09:15:00Z',
              description: 'Beta testing recruitment'
            }
          ]
        };
        setAnalytics(mockData);
        setLinks(mockData.links);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateLink = async () => {
    if (!createForm.originalUrl || !createForm.campaignName) {
      alert('Please fill in required fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/affiliate/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          originalUrl: createForm.originalUrl,
          campaignName: createForm.campaignName,
          commissionRate: createForm.commissionRate / 100,
          description: createForm.description,
          customSlug: createForm.customSlug || undefined,
          expiryDate: createForm.expiryDate || undefined,
          generateQRCode: createForm.generateQRCode
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add new link to the list
        const newLink: AffiliateLink = {
          id: result.data.id,
          linkId: result.data.linkId,
          originalUrl: result.data.originalUrl,
          affiliateUrl: result.data.affiliateUrl,
          campaignName: result.data.campaignName,
          commissionRate: result.data.commissionRate * 100,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          createdAt: result.data.createdAt,
          active: true,
          description: createForm.description
        };

        setLinks(prev => [newLink, ...prev]);
        setShowCreateModal(false);
        setCreateForm({
          originalUrl: '',
          campaignName: '',
          commissionRate: 10,
          description: '',
          customSlug: '',
          expiryDate: '',
          generateQRCode: false
        });
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to create affiliate link');
      }
    } catch (error) {
      console.error('Failed to create affiliate link:', error);
      alert('Failed to create affiliate link');
    } finally {
      setCreating(false);
    }
  };

  const deleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this affiliate link?')) {
      return;
    }

    try {
      // Mock deletion - replace with real API call
      setLinks(prev => prev.filter(link => link.id !== linkId));
    } catch (error) {
      console.error('Failed to delete link:', error);
      alert('Failed to delete affiliate link');
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getConversionRate = (link: AffiliateLink) => {
    return link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : '0.0';
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = link.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.linkId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && link.active) ||
                         (filterStatus === 'inactive' && !link.active);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-zinc-400">Loading affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Users className="w-8 h-8 mr-3" />
                Affiliate Management
              </h1>
              <p className="text-zinc-400 mt-2">Manage your affiliate links and track performance</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Link</span>
            </button>
          </div>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Total Clicks</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.summary.totalClicks.toLocaleString()}</p>
              <p className="text-sm text-zinc-400 mt-1">Across {analytics.summary.totalLinks} links</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Conversions</h3>
              <p className="text-3xl font-bold text-white mt-2">{analytics.summary.totalConversions}</p>
              <p className="text-sm text-zinc-400 mt-1">{analytics.summary.averageConversionRate.toFixed(1)}% conversion rate</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Revenue</h3>
              <p className="text-3xl font-bold text-white mt-2">{formatCurrency(analytics.summary.totalRevenue)}</p>
              <p className="text-sm text-zinc-400 mt-1">{analytics.summary.averageCommissionRate.toFixed(1)}% avg commission</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">Active Links</h3>
              <p className="text-3xl font-bold text-white mt-2">{links.filter(l => l.active).length}</p>
              <p className="text-sm text-zinc-400 mt-1">of {analytics.summary.totalLinks} total</p>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                placeholder="Search links..."
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Links</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Affiliate Links Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400 text-lg">No affiliate links found</p>
                      <p className="text-zinc-500 text-sm">Create your first affiliate link to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium text-white">{link.campaignName}</h3>
                            <button
                              onClick={() => copyToClipboard(link.affiliateUrl)}
                              className="text-zinc-400 hover:text-white transition-colors"
                              title="Copy link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-zinc-400 mt-1">{link.linkId}</p>
                          {link.description && (
                            <p className="text-xs text-zinc-500 mt-1">{link.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-zinc-300">{link.clicks} clicks</span>
                            <span className="text-zinc-300">{link.conversions} conversions</span>
                          </div>
                          <div className="text-xs text-zinc-400">
                            {getConversionRate(link)}% conversion rate
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{formatCurrency(link.revenue)}</div>
                          <div className="text-xs text-zinc-400">{link.commissionRate}% commission</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-zinc-300">{formatDate(link.createdAt)}</div>
                          {link.lastClick && (
                            <div className="text-xs text-zinc-500">
                              Last click: {formatDate(link.lastClick)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          link.active 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-gray-900 text-gray-300'
                        }`}>
                          {link.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => window.open(link.affiliateUrl, '_blank')}
                            className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-zinc-400 hover:text-yellow-400 transition-colors"
                            title="Edit link"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Delete link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Create Link Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-6">Create Affiliate Link</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Original URL *
                    </label>
                    <input
                      type="url"
                      value={createForm.originalUrl}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, originalUrl: e.target.value }))}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/product"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={createForm.campaignName}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, campaignName: e.target.value }))}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                      placeholder="Product Launch 2024"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={createForm.commissionRate}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Custom Slug (Optional)
                    </label>
                    <input
                      type="text"
                      value={createForm.customSlug}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, customSlug: e.target.value }))}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                      placeholder="my-custom-link"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Campaign description..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={createForm.expiryDate}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={createForm.generateQRCode}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, generateQRCode: e.target.checked }))}
                        className="rounded border-zinc-600 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-zinc-300">Generate QR Code</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-zinc-800">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createAffiliateLink}
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Link</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}