'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Send,
  Paperclip,
  X,
  AlertCircle,
  Info,
  Zap,
  AlertTriangle,
  CheckCircle,
  Upload,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

const categories = [
  { id: 'technical', name: 'Technical Issues', icon: '🔧', description: 'Bugs, errors, performance issues' },
  { id: 'billing', name: 'Billing & Payments', icon: '💳', description: 'Subscription, invoices, payment problems' },
  { id: 'account', name: 'Account Management', icon: '👤', description: 'Login, profile, settings issues' },
  { id: 'feature', name: 'Feature Request', icon: '💡', description: 'Suggest new features or improvements' },
  { id: 'bug', name: 'Bug Report', icon: '🐛', description: 'Report unexpected behavior' },
  { id: 'general', name: 'General Inquiry', icon: '❓', description: 'Questions, guidance, other topics' }
];

const priorities = [
  { 
    id: 'low', 
    name: 'Low', 
    icon: Info, 
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    description: 'General questions, minor issues' 
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    icon: AlertCircle, 
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Functionality not working as expected' 
  },
  { 
    id: 'high', 
    name: 'High', 
    icon: AlertTriangle, 
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Affecting productivity or business operations' 
  },
  { 
    id: 'urgent', 
    name: 'Urgent', 
    icon: Zap, 
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Critical issue, service completely unavailable' 
  }
];

export default function NewTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Check file type
      const allowedTypes = ['image/', 'application/pdf', 'text/', 'application/json'];
      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        alert(`File type ${file.type} is not supported.`);
        continue;
      }

      const fileId = Math.random().toString(36).substr(2, 9);
      const attachedFile: AttachedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type
      };

      setAttachments(prev => [...prev, attachedFile]);

      // In a real app, upload to storage service
      // For now, just simulate upload
      console.log('Uploading file:', file.name);
    }

    // Reset input
    event.target.value = '';
  };

  const removeAttachment = (fileId: string) => {
    setAttachments(prev => prev.filter(file => file.id !== fileId));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          attachments: attachments.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/support/tickets/${data.data.id}`);
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/support/tickets" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support Tickets
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white">Create Support Ticket</h1>
            <p className="text-zinc-400 mt-2">
              Describe your issue and we'll get back to you as soon as possible
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">What can we help you with?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    formData.category === category.id
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-white mb-1">{category.name}</h3>
                  <p className="text-zinc-400 text-sm">{category.description}</p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-400 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.category}
              </p>
            )}
          </motion.div>

          {/* Priority Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">How urgent is this issue?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {priorities.map(priority => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => handleInputChange('priority', priority.id)}
                  className={`p-4 border rounded-lg text-left transition-all ${
                    formData.priority === priority.id
                      ? priority.color
                      : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                  }`}
                >
                  <priority.icon className="w-6 h-6 mb-2" />
                  <h3 className="font-medium text-white mb-1">{priority.name}</h3>
                  <p className="text-zinc-400 text-sm">{priority.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Subject and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Tell us more about your issue</h2>
            
            <div className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief summary of your issue"
                  className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.subject ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Please provide as much detail as possible about your issue. Include steps to reproduce, error messages, and any relevant context."
                  rows={6}
                  className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-zinc-700'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="text-zinc-500 text-sm mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </div>
          </motion.div>

          {/* File Attachments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Attachments (Optional)</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Upload screenshots, error logs, or other relevant files to help us understand your issue better.
            </p>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 mb-4">
              <div className="text-center">
                <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-zinc-400 mb-2">Drop files here or click to upload</p>
                <p className="text-zinc-500 text-sm">
                  Supported: Images, PDFs, text files (max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.json,.log"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors cursor-pointer mt-2"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Choose Files
                </label>
              </div>
            </div>

            {/* Attached Files */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-white">Attached Files</h3>
                {attachments.map(file => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="text-white text-sm">{file.name}</p>
                          <p className="text-zinc-500 text-xs">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-white mb-1">What happens next?</h3>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• You'll receive a confirmation email with your ticket number</li>
                  <li>• Our support team will review your ticket within 24 hours</li>
                  <li>• We'll keep you updated on progress via email</li>
                  <li>• You can track your ticket status in this portal</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Ticket...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Create Ticket
                  </div>
                )}
              </button>
              
              <Link
                href="/support/tickets"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </Link>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}