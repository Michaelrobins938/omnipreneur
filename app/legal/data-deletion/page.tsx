'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Mail,
  FileText
} from 'lucide-react';

export default function DataDeletionPage() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [confirmations, setConfirmations] = useState<Record<string, boolean>>({});
  const [finalConfirmation, setFinalConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const confirmationItems = [
    {
      id: 'data-loss',
      text: 'I understand that all my personal data, including generated content, templates, and account history will be permanently deleted.',
      critical: true
    },
    {
      id: 'irreversible',
      text: 'I understand that this action is irreversible and cannot be undone.',
      critical: true
    },
    {
      id: 'export-opportunity',
      text: 'I have had the opportunity to export my data before deletion (or choose not to).',
      critical: false
    },
    {
      id: 'subscription-cancellation',
      text: 'I understand that any active subscriptions will be cancelled and I will not receive refunds for unused periods.',
      critical: true
    },
    {
      id: 'legal-retention',
      text: 'I understand that some data may be retained for legal, security, or regulatory compliance as permitted by law.',
      critical: false
    }
  ];

  const handleConfirmationChange = (id: string, checked: boolean) => {
    setConfirmations(prev => ({ ...prev, [id]: checked }));
  };

  const allCriticalConfirmed = confirmationItems
    .filter(item => item.critical)
    .every(item => confirmations[item.id]);

  const handleSubmit = async () => {
    if (finalConfirmation !== 'DELETE MY ACCOUNT') {
      alert('Please type the exact confirmation phrase');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/legal/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          requestType: 'delete',
          email: '', // Will be filled by the API from authenticated user
          reason
        })
      });

      if (response.ok) {
        setDeleted(true);
      } else {
        throw new Error('Failed to submit deletion request');
      }
    } catch (error) {
      console.error('Failed to submit deletion request:', error);
      alert('Failed to submit deletion request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (deleted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Deletion Request Submitted</h1>
            <p className="text-zinc-400 mb-6">
              Your account deletion request has been submitted. We'll process this request within 30 days and send you a confirmation email when completed.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/"
                className="block w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Return to Homepage
              </Link>
              
              <Link
                href="/contact"
                className="block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Contact Support
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
            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Delete Account & Data</h1>
            <p className="text-xl text-zinc-400">
              Permanently remove your account and all associated data
            </p>
          </motion.div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map(stepNumber => (
            <div
              key={stepNumber}
              className={`flex items-center space-x-2 ${
                stepNumber < step ? 'text-green-400' :
                stepNumber === step ? 'text-blue-400' :
                'text-zinc-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stepNumber < step ? 'border-green-400 bg-green-400/20' :
                stepNumber === step ? 'border-blue-400 bg-blue-400/20' :
                'border-zinc-600'
              }`}>
                {stepNumber < step ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {stepNumber < 3 && (
                <div className={`w-8 h-0.5 ${
                  stepNumber < step ? 'bg-green-400' : 'bg-zinc-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Information & Export Opportunity */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Warning */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Critical Warning</h3>
                  <p className="text-red-100 text-sm mb-4">
                    Account deletion is permanent and irreversible. All your data will be lost forever.
                  </p>
                  <ul className="text-red-100 text-sm space-y-1">
                    <li>• All generated content and templates will be deleted</li>
                    <li>• Your account history and analytics will be removed</li>
                    <li>• Active subscriptions will be cancelled without refund</li>
                    <li>• You will not be able to recover this data later</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Option */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Download className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Export Your Data First</h3>
                  <p className="text-blue-100 text-sm mb-4">
                    Before deleting your account, consider exporting your data. This includes:
                  </p>
                  <ul className="text-blue-100 text-sm space-y-1 mb-4">
                    <li>• Generated content and templates</li>
                    <li>• Account settings and preferences</li>
                    <li>• Usage history and analytics</li>
                    <li>• Payment and subscription records</li>
                  </ul>
                  <Link
                    href="/legal/data-request"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Link>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Why are you deleting your account?</h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please tell us why you're deleting your account. Your feedback helps us improve our service."
                rows={4}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!reason.trim()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Continue to Confirmations
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Confirmations */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Please confirm your understanding</h3>
              <div className="space-y-4">
                {confirmationItems.map(item => (
                  <label
                    key={item.id}
                    className="flex items-start space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={confirmations[item.id] || false}
                      onChange={(e) => handleConfirmationChange(item.id, e.target.checked)}
                      className="mt-1 text-red-600 focus:ring-red-500 border-zinc-600 rounded"
                    />
                    <span className={`text-sm ${item.critical ? 'text-white' : 'text-zinc-300'}`}>
                      {item.text}
                      {item.critical && <span className="text-red-400 ml-1">*</span>}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-4">
                * Required confirmations
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!allCriticalConfirmed}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Continue to Final Confirmation
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Final Confirmation</h3>
              <p className="text-zinc-300 mb-4">
                To confirm account deletion, please type the following phrase exactly:
              </p>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
                <code className="text-red-400 font-mono">DELETE MY ACCOUNT</code>
              </div>
              <input
                type="text"
                value={finalConfirmation}
                onChange={(e) => setFinalConfirmation(e.target.value)}
                placeholder="Type the confirmation phrase here"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-400 mb-1">This action cannot be undone</h4>
                  <p className="text-red-100 text-sm">
                    Once you click "Delete My Account", your account and all data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || finalConfirmation !== 'DELETE MY ACCOUNT'}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {loading ? 'Processing...' : 'Delete My Account'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Legal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Legal Information</h3>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>• Account deletion requests are processed within 30 days as required by GDPR</p>
            <p>• Some data may be retained for legal, security, or regulatory compliance purposes</p>
            <p>• You will receive confirmation when the deletion is complete</p>
            <p>• If you have any questions, contact our support team before proceeding</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
            >
              <Mail className="w-4 h-4 mr-1" />
              Contact Support
            </Link>
            <Link
              href="/legal/privacy"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
            >
              <FileText className="w-4 h-4 mr-1" />
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}