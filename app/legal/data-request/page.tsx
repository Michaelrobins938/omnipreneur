'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Download,
  FileText,
  Shield,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Lock,
  Database
} from 'lucide-react';

export default function DataRequestPage() {
  const [requestType, setRequestType] = useState<'export' | 'delete' | 'correct'>('export');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [specificData, setSpecificData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dataTypes = [
    { id: 'profile', label: 'Profile Information', description: 'Name, email, account settings' },
    { id: 'content', label: 'Generated Content', description: 'All content created using our AI tools' },
    { id: 'usage', label: 'Usage Analytics', description: 'How you use our platform and features' },
    { id: 'payments', label: 'Payment History', description: 'Subscription and transaction records' },
    { id: 'support', label: 'Support Communications', description: 'Messages and support ticket history' },
    { id: 'preferences', label: 'Preferences & Settings', description: 'Your customizations and preferences' }
  ];

  const handleDataTypeToggle = (dataType: string) => {
    setSpecificData(prev => 
      prev.includes(dataType)
        ? prev.filter(type => type !== dataType)
        : [...prev, dataType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/legal/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          requestType,
          email,
          reason,
          specificData: requestType === 'export' ? specificData : undefined
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Failed to submit data request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Request Submitted</h1>
            <p className="text-zinc-400 mb-6">
              Your data request has been submitted successfully. We'll process your request and contact you within 30 days.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Return to Dashboard
              </Link>
              
              <Link
                href="/legal/privacy"
                className="block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Data Rights Request</h1>
            <p className="text-xl text-zinc-400">
              Exercise your data protection rights under GDPR and CCPA
            </p>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <Shield className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">GDPR Compliant</h3>
            <p className="text-zinc-400 text-sm">
              Full compliance with European data protection regulations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <Clock className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">30-Day Response</h3>
            <p className="text-zinc-400 text-sm">
              We'll process your request within the required timeframe
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <Lock className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Secure Process</h3>
            <p className="text-zinc-400 text-sm">
              Identity verification required for all data requests
            </p>
          </motion.div>
        </div>

        {/* Request Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Submit Data Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Request Type
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRequestType('export')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    requestType === 'export'
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <Download className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-medium text-white">Export Data</h3>
                  <p className="text-sm text-zinc-400">Download your personal information</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('correct')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    requestType === 'correct'
                      ? 'border-yellow-500 bg-yellow-600/20'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <FileText className="w-6 h-6 text-yellow-400 mb-2" />
                  <h3 className="font-medium text-white">Correct Data</h3>
                  <p className="text-sm text-zinc-400">Request correction of inaccurate data</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('delete')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    requestType === 'delete'
                      ? 'border-red-500 bg-red-600/20'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
                  <h3 className="font-medium text-white">Delete Account</h3>
                  <p className="text-sm text-zinc-400">Permanently delete your account and data</p>
                </button>
              </div>
            </div>

            {/* Email Verification */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Must match the email address associated with your account
              </p>
            </div>

            {/* Data Types for Export */}
            {requestType === 'export' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Data to Export (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {dataTypes.map(dataType => (
                    <label
                      key={dataType.id}
                      className="flex items-start space-x-3 p-3 border border-zinc-700 rounded-lg hover:border-zinc-600 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={specificData.includes(dataType.id)}
                        onChange={() => handleDataTypeToggle(dataType.id)}
                        className="mt-1 text-blue-600 focus:ring-blue-500 border-zinc-600 rounded"
                      />
                      <div>
                        <h4 className="font-medium text-white">{dataType.label}</h4>
                        <p className="text-sm text-zinc-400">{dataType.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Reason/Details */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {requestType === 'delete' ? 'Reason for Deletion' : 
                 requestType === 'correct' ? 'What needs to be corrected?' : 
                 'Additional Details (Optional)'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  requestType === 'delete' ? 'Please explain why you want to delete your account...' :
                  requestType === 'correct' ? 'Describe what information is incorrect and how it should be corrected...' :
                  'Any specific requirements or additional information...'
                }
                rows={4}
                required={requestType !== 'export'}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Warning for deletion */}
            {requestType === 'delete' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-400 mb-1">Account Deletion Warning</h4>
                    <p className="text-red-100 text-sm">
                      This action is irreversible. All your data, including generated content, 
                      templates, and account history will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading || !email || (requestType !== 'export' && !reason)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {loading ? 'Submitting...' : `Submit ${requestType === 'export' ? 'Export' : requestType === 'correct' ? 'Correction' : 'Deletion'} Request`}
              </button>
              
              <Link
                href="/legal/privacy"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </form>

          {/* Legal Information */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-3">Important Information</h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>• We will verify your identity before processing any data request</p>
              <p>• Response time: up to 30 days for GDPR requests, up to 45 days for CCPA requests</p>
              <p>• Export files will be provided in a machine-readable format</p>
              <p>• Account deletion requests cannot be reversed once processed</p>
              <p>• Some data may be retained for legal or security purposes as permitted by law</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}