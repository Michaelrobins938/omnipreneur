'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Globe,
  BarChart3,
  Key,
  Download,
  Trash2,
  Camera,
  Lock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Monitor,
  Moon,
  Sun,
  Palette,
  Languages,
  Clock,
  Database,
  Upload
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  company?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
  phone?: string;
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd?: string;
  };
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  usageReports: boolean;
  weeklyDigest: boolean;
  aiInsights: boolean;
  maintenanceUpdates: boolean;
  billingReminders: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
  dataRetention: number;
  downloadPersonalData: boolean;
  deleteAccount: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team';
  analyticsTracking: boolean;
  performanceTracking: boolean;
  usageStatistics: boolean;
  marketingOptIn: boolean;
  dataSharing: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  sidebarCompact: boolean;
  animations: boolean;
  soundEffects: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export default function EnhancedSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    website: '',
    location: '',
    timezone: '',
    language: 'en',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
    productUpdates: true,
    usageReports: false,
    weeklyDigest: true,
    aiInsights: true,
    maintenanceUpdates: true,
    billingReminders: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
    ipWhitelist: [],
    dataRetention: 90,
    downloadPersonalData: false,
    deleteAccount: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    analyticsTracking: true,
    performanceTracking: true,
    usageStatistics: true,
    marketingOptIn: false,
    dataSharing: false
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'dark',
    accentColor: '#3b82f6',
    sidebarCompact: false,
    animations: true,
    soundEffects: false,
    fontSize: 'medium'
  });

  useEffect(() => {
    fetchUserData();
    loadSettings();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const userData = data?.data || data?.user || data;
        setUser(userData);
        setProfileForm({
          name: userData.name || '',
          email: userData.email || '',
          bio: userData.bio || '',
          company: userData.company || '',
          website: userData.website || '',
          location: userData.location || '',
          timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: userData.language || 'en',
          phone: userData.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    const savedNotifications = localStorage.getItem('omnipreneur_notifications');
    const savedSecurity = localStorage.getItem('omnipreneur_security');
    const savedPrivacy = localStorage.getItem('omnipreneur_privacy');
    const savedAppearance = localStorage.getItem('omnipreneur_appearance');
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedSecurity) {
      setSecurity(JSON.parse(savedSecurity));
    }

    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }

    if (savedAppearance) {
      setAppearance(JSON.parse(savedAppearance));
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      // Handle avatar upload first if there's a new file
      let avatarUrl = user?.avatar;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        const uploadResponse = await fetch('/api/users/avatar', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          avatarUrl = uploadData.avatarUrl;
        }
      }

      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          bio: profileForm.bio,
          company: profileForm.company,
          website: profileForm.website,
          location: profileForm.location,
          timezone: profileForm.timezone,
          language: profileForm.language,
          phone: profileForm.phone,
          avatar: avatarUrl,
          currentPassword: profileForm.currentPassword || undefined,
          newPassword: profileForm.newPassword || undefined
        })
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setProfileForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setAvatarFile(null);
        setUnsavedChanges(false);
        fetchUserData(); // Refresh user data
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (section: string, data: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/users/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({ section, data })
      });

      if (response.ok) {
        localStorage.setItem(`omnipreneur_${section}`, JSON.stringify(data));
        alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
        setUnsavedChanges(false);
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const enable2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Show QR code or setup instructions
        alert('2FA setup initiated. Check your email for instructions.');
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      alert('Failed to enable 2FA');
    }
  };

  const downloadData = async () => {
    try {
      const response = await fetch('/api/users/data-export', {
        credentials: 'include',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omnipreneur-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data');
    }
  };

  const deleteAccount = async () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') return;

    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        }
      });

      if (response.ok) {
        alert('Account scheduled for deletion. You have 30 days to cancel this action.');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and avatar' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, and login settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push notification preferences' },
    { id: 'privacy', label: 'Privacy', icon: Lock, description: 'Data usage and privacy controls' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme, colors, and interface settings' },
    { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Subscription and payment management' },
    { id: 'data', label: 'Data & Export', icon: Database, description: 'Data management and export options' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Account Settings</h1>
              <p className="text-zinc-400 mt-2">Manage your profile, security, and preferences.</p>
            </div>
            {unsavedChanges && (
              <div className="flex items-center text-amber-400 bg-amber-400/10 px-4 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-6 sticky top-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all group ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="flex-1">
                          <div className="font-medium">{tab.label}</div>
                          <div className="text-xs opacity-75 mt-1">{tab.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Profile Settings</h2>
                    <div className="flex items-center space-x-2">
                      {user?.emailVerified && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Avatar Section */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-zinc-300 mb-4">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden">
                          {(user?.avatar || avatarFile) ? (
                            <img 
                              src={avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-12 h-12 text-zinc-400" />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAvatarFile(file);
                                setUnsavedChanges(true);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400 mb-2">Upload a new profile picture</p>
                        <p className="text-xs text-zinc-500">JPG, PNG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, name: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, email: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Bio</label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, bio: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        rows={3}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Company</label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, company: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, website: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, location: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, phone: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Timezone</label>
                      <select
                        value={profileForm.timezone}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, timezone: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Central European Time</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Australia/Sydney">Sydney (AEST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Language</label>
                      <select
                        value={profileForm.language}
                        onChange={(e) => {
                          setProfileForm(prev => ({ ...prev, language: e.target.value }));
                          setUnsavedChanges(true);
                        }}
                        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="pt">Português</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="mt-12 pt-8 border-t border-zinc-700">
                    <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={profileForm.currentPassword}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">New Password</label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Continue with other tabs... */}
              {/* This is a comprehensive start - I'll continue with the other tabs if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}