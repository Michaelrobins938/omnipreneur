import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  status: 'active' | 'pending' | 'suspended';
  commission: number;
  referrals: number;
  earnings: number;
  joinedDate: Date;
}

interface Commission {
  id: string;
  affiliateId: string;
  product: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  date: Date;
}

export default function AffiliatePortal() {
  const [affiliateCode, setAffiliateCode] = useState('');
  const [currentAffiliate, setCurrentAffiliate] = useState<Affiliate | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'referrals' | 'earnings' | 'resources'>('dashboard');

  // Demo data
  const demoAffiliate: Affiliate = {
    id: 'aff-001',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    code: 'SARAH20',
    status: 'active',
    commission: 25,
    referrals: 47,
    earnings: 2347.50,
    joinedDate: new Date('2024-01-15')
  };

  const demoCommissions: Commission[] = [
    {
      id: 'com-001',
      affiliateId: 'aff-001',
      product: 'Bundle Builder Pro',
      amount: 97.00,
      status: 'paid',
      date: new Date('2024-07-10')
    },
    {
      id: 'com-002',
      affiliateId: 'aff-001',
      product: 'Content Spawner',
      amount: 39.00,
      status: 'pending',
      date: new Date('2024-07-12')
    },
    {
      id: 'com-003',
      affiliateId: 'aff-001',
      product: 'AutoRewrite Engine',
      amount: 77.00,
      status: 'paid',
      date: new Date('2024-07-08')
    }
  ];

  useEffect(() => {
    // Simulate loading affiliate data
    setIsLoading(true);
    setTimeout(() => {
      setCurrentAffiliate(demoAffiliate);
      setCommissions(demoCommissions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogin = async () => {
    if (!affiliateCode.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentAffiliate(demoAffiliate);
      setCommissions(demoCommissions);
      setIsLoading(false);
    }, 1000);
  };

  const handleGenerateLink = (product: string) => {
    if (!currentAffiliate) return;
    
    const baseUrl = 'https://omnipreneur.com';
    const affiliateLink = `${baseUrl}/${product}?ref=${currentAffiliate.code}`;
    
    navigator.clipboard.writeText(affiliateLink);
    alert('Affiliate link copied to clipboard!');
  };

  const handleExportData = () => {
    if (!currentAffiliate) return;
    
    const exportData = {
      affiliate: currentAffiliate,
      commissions: commissions,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-data-${currentAffiliate.code}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCommissionStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Hero />
        
        <div className="mt-16 space-y-8">
          {/* Login Section */}
          {!currentAffiliate && (
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-green-400">🌐 Partner Dashboard</h2>
              <p className="text-gray-300 mb-6">
                Track your earnings, manage referrals, and access exclusive partner resources. 
                Earn while others automate their business with our premium AI tools.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Enter your affiliate code..." 
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                />
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading || !affiliateCode.trim()}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {isLoading ? 'Loading...' : 'View My Stats'}
                </Button>
              </div>
            </Card>
          )}

          {/* Dashboard */}
          {currentAffiliate && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">${currentAffiliate.earnings.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">Total Earnings</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{currentAffiliate.referrals}</div>
                    <div className="text-sm text-gray-400">Total Referrals</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{currentAffiliate.commission}%</div>
                    <div className="text-sm text-gray-400">Commission Rate</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getStatusColor(currentAffiliate.status)}`}>
                      {currentAffiliate.status.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-400">Account Status</div>
                  </div>
                </Card>
              </div>

              {/* Navigation Tabs */}
              <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { id: 'referrals', label: 'Referrals', icon: '👥' },
                  { id: 'earnings', label: 'Earnings', icon: '💰' },
                  { id: 'resources', label: 'Resources', icon: '📚' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <Card>
                      <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                          onClick={() => handleGenerateLink('bundle-builder')}
                          className="bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          Generate Bundle Builder Link
                        </Button>
                        <Button 
                          onClick={() => handleGenerateLink('content-spawner')}
                          className="bg-gradient-to-r from-pink-500 to-red-600"
                        >
                          Generate Content Spawner Link
                        </Button>
                        <Button 
                          onClick={handleExportData}
                          className="bg-gradient-to-r from-green-500 to-blue-600"
                        >
                          Export Data
                        </Button>
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
                      <div className="space-y-3">
                        {commissions.slice(0, 5).map((commission) => (
                          <div key={commission.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                            <div>
                              <div className="font-medium text-white">{commission.product}</div>
                              <div className="text-sm text-gray-400">
                                {commission.date.toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${getCommissionStatusColor(commission.status)}`}>
                                ${commission.amount.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-400 capitalize">
                                {commission.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'referrals' && (
                  <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white">Your Referral Network</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">47</div>
                          <div className="text-sm text-gray-400">Total Referrals</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">12</div>
                          <div className="text-sm text-gray-400">Active Referrals</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-lg font-medium mb-3 text-white">Your Affiliate Links</h4>
                        <div className="space-y-2">
                          {[
                            { name: 'Bundle Builder Pro', code: `${currentAffiliate.code}-BB` },
                            { name: 'Content Spawner', code: `${currentAffiliate.code}-CS` },
                            { name: 'AutoRewrite Engine', code: `${currentAffiliate.code}-AR` },
                            { name: 'Live Dashboard', code: `${currentAffiliate.code}-LD` }
                          ].map((product) => (
                            <div key={product.code} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="font-medium text-white">{product.name}</div>
                                <div className="text-sm text-gray-400">{product.code}</div>
                              </div>
                              <Button 
                                onClick={() => handleGenerateLink(product.name.toLowerCase().replace(' ', '-'))}
                                className="bg-green-500 hover:bg-green-600 text-xs px-3 py-1"
                              >
                                Copy Link
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'earnings' && (
                  <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white">Earnings & Commissions</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-400">$2,347.50</div>
                          <div className="text-sm text-gray-400">Total Earned</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-400">$156.00</div>
                          <div className="text-sm text-gray-400">Pending</div>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-400">$2,191.50</div>
                          <div className="text-sm text-gray-400">Paid Out</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3 text-white">Commission History</h4>
                        <div className="space-y-2">
                          {commissions.map((commission) => (
                            <div key={commission.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="font-medium text-white">{commission.product}</div>
                                <div className="text-sm text-gray-400">
                                  {commission.date.toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium ${getCommissionStatusColor(commission.status)}`}>
                                  ${commission.amount.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-400 capitalize">
                                  {commission.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === 'resources' && (
                  <Card>
                    <h3 className="text-xl font-semibold mb-4 text-white">Partner Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Marketing Materials</h4>
                        <div className="space-y-2">
                          {[
                            'Product Brochures',
                            'Social Media Templates',
                            'Email Campaigns',
                            'Banner Graphics',
                            'Video Promos'
                          ].map((resource) => (
                            <div key={resource} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
                              <span className="text-white">{resource}</span>
                              <Button className="bg-blue-500 hover:bg-blue-600 text-xs px-3 py-1">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-white">Training & Support</h4>
                        <div className="space-y-2">
                          {[
                            'Getting Started Guide',
                            'Best Practices Manual',
                            'Video Tutorials',
                            'Live Training Sessions',
                            'Partner Community'
                          ].map((resource) => (
                            <div key={resource} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
                              <span className="text-white">{resource}</span>
                              <Button className="bg-green-500 hover:bg-green-600 text-xs px-3 py-1">
                                Access
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 