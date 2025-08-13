'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Cookie,
  Shield,
  Settings,
  BarChart3,
  Globe,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  AlertCircle,
  Info
} from 'lucide-react';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
  cookies: Array<{
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }>;
}

export default function CookiePolicyPage() {
  const [activeTab, setActiveTab] = useState<'policy' | 'settings'>('policy');
  const [cookieSettings, setCookieSettings] = useState<CookieCategory[]>([
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      required: true,
      enabled: true,
      cookies: [
        {
          name: 'auth-token',
          purpose: 'Maintains your login session',
          duration: '30 days',
          provider: 'Omnipreneur AI'
        },
        {
          name: 'csrf-token',
          purpose: 'Protects against cross-site request forgery attacks',
          duration: 'Session',
          provider: 'Omnipreneur AI'
        },
        {
          name: 'preferences',
          purpose: 'Stores your cookie preferences',
          duration: '1 year',
          provider: 'Omnipreneur AI'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      required: false,
      enabled: true,
      cookies: [
        {
          name: '_ga',
          purpose: 'Distinguishes unique users',
          duration: '2 years',
          provider: 'Google Analytics'
        },
        {
          name: '_ga_*',
          purpose: 'Tracks page views and user sessions',
          duration: '2 years',
          provider: 'Google Analytics'
        },
        {
          name: 'usage_metrics',
          purpose: 'Tracks feature usage and performance',
          duration: '90 days',
          provider: 'Omnipreneur AI'
        }
      ]
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      required: false,
      enabled: false,
      cookies: [
        {
          name: 'theme_preference',
          purpose: 'Remembers your dark/light mode preference',
          duration: '1 year',
          provider: 'Omnipreneur AI'
        },
        {
          name: 'language_setting',
          purpose: 'Stores your language preference',
          duration: '1 year',
          provider: 'Omnipreneur AI'
        },
        {
          name: 'dashboard_layout',
          purpose: 'Remembers your dashboard customizations',
          duration: '6 months',
          provider: 'Omnipreneur AI'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies are used to make advertising messages more relevant to you.',
      required: false,
      enabled: false,
      cookies: [
        {
          name: 'referral_source',
          purpose: 'Tracks how you found our website',
          duration: '30 days',
          provider: 'Omnipreneur AI'
        },
        {
          name: 'conversion_tracking',
          purpose: 'Measures the effectiveness of our campaigns',
          duration: '90 days',
          provider: 'Omnipreneur AI'
        }
      ]
    }
  ]);

  const [loading, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load cookie preferences from localStorage
    const savedPreferences = localStorage.getItem('cookie-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setCookieSettings(prev => 
          prev.map(category => ({
            ...category,
            enabled: preferences[category.id] !== undefined ? preferences[category.id] : category.enabled
          }))
        );
      } catch (error) {
        console.error('Failed to load cookie preferences:', error);
      }
    }
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setCookieSettings(prev =>
      prev.map(category =>
        category.id === categoryId && !category.required
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    
    try {
      const preferences = cookieSettings.reduce((acc, category) => {
        acc[category.id] = category.enabled;
        return acc;
      }, {} as Record<string, boolean>);

      // Save to localStorage
      localStorage.setItem('cookie-preferences', JSON.stringify(preferences));

      // Send to API for server-side tracking
      await fetch('/api/legal/cookie-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ preferences })
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save cookie preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const acceptAll = () => {
    setCookieSettings(prev =>
      prev.map(category => ({ ...category, enabled: true }))
    );
  };

  const rejectOptional = () => {
    setCookieSettings(prev =>
      prev.map(category => ({ 
        ...category, 
        enabled: category.required 
      }))
    );
  };

  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-orange-600/20 border border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-orange-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
            <p className="text-xl text-zinc-400 mb-2">
              Learn about the cookies we use and manage your preferences
            </p>
            <p className="text-sm text-zinc-500">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('policy')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'policy'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Cookie Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cookie Settings</span>
          </button>
        </div>

        {/* Cookie Policy Tab */}
        {activeTab === 'policy' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* What Are Cookies */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What Are Cookies?</h2>
              <div className="space-y-4 text-zinc-300">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  We use cookies to enhance your experience on our platform, remember your preferences, and analyze how 
                  our service is used to help us improve it.
                </p>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How We Use Cookies</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Essential Functionality</h3>
                      <p className="text-zinc-300 text-sm">
                        Keep you logged in, remember your preferences, and ensure the security of your account.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Analytics & Performance</h3>
                      <p className="text-zinc-300 text-sm">
                        Understand how you use our platform to improve performance and user experience.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Settings className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Personalization</h3>
                      <p className="text-zinc-300 text-sm">
                        Customize your experience based on your preferences and usage patterns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Globe className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white mb-2">Marketing & Communication</h3>
                      <p className="text-zinc-300 text-sm">
                        Deliver relevant content and measure the effectiveness of our communications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Types of Cookies */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Types of Cookies We Use</h2>
              <div className="space-y-6">
                {cookieSettings.map(category => (
                  <div key={category.id} className="border border-zinc-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      {category.required ? (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Required
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm mb-4">{category.description}</p>
                    
                    <div className="space-y-3">
                      {category.cookies.map((cookie, index) => (
                        <div key={index} className="bg-zinc-800/50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-zinc-400">Name:</span>
                              <p className="text-white font-mono">{cookie.name}</p>
                            </div>
                            <div>
                              <span className="text-zinc-400">Purpose:</span>
                              <p className="text-zinc-300">{cookie.purpose}</p>
                            </div>
                            <div>
                              <span className="text-zinc-400">Duration:</span>
                              <p className="text-zinc-300">{cookie.duration}</p>
                            </div>
                            <div>
                              <span className="text-zinc-400">Provider:</span>
                              <p className="text-zinc-300">{cookie.provider}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Cookie Rights</h2>
              <div className="space-y-4 text-zinc-300">
                <p>
                  You have the right to accept or reject cookies. You can exercise your cookie rights by 
                  setting your preferences in the Cookie Settings tab above.
                </p>
                <p>
                  You can also manage cookies through your browser settings. Please note that if you 
                  disable essential cookies, some features of our website may not function properly.
                </p>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-400 mb-2">Browser Cookie Controls</h4>
                  <p className="text-blue-100 text-sm">
                    Most browsers allow you to view, manage, and delete cookies. Visit your browser's 
                    help section for specific instructions on managing cookies.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cookie Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={rejectOptional}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reject Optional Cookies
                </button>
              </div>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
              {cookieSettings.map(category => (
                <div key={category.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{category.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {category.required ? (
                        <span className="px-3 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Always Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`p-1 rounded-full transition-colors ${
                            category.enabled ? 'text-green-400' : 'text-zinc-500'
                          }`}
                        >
                          {category.enabled ? (
                            <ToggleRight className="w-8 h-8" />
                          ) : (
                            <ToggleLeft className="w-8 h-8" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-zinc-500">
                    {category.cookies.length} cookie{category.cookies.length !== 1 ? 's' : ''} in this category
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="sticky bottom-8 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {saved && (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Preferences saved!</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSavePreferences}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mt-8"
        >
          <div className="text-center">
            <Cookie className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Cookies?</h2>
            <p className="text-zinc-400 mb-6">
              If you have any questions about our use of cookies, please contact us.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Contact Support
              </Link>
              
              <Link
                href="/legal/privacy"
                className="inline-flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}