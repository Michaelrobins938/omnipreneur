'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Paperclip,
  ArrowUpRight,
  Zap,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_for_response' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  lastResponseAt?: string;
  assignedTo?: string;
  responseTime?: number; // in hours
  resolutionTime?: number; // in hours
  attachments: number;
  messagesCount: number;
  tags: string[];
}

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: MessageCircle },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  waiting_for_response: { label: 'Waiting for Response', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: CheckCircle }
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-500/20 text-gray-400', icon: Info },
  medium: { label: 'Medium', color: 'bg-blue-500/20 text-blue-400', icon: MessageCircle },
  high: { label: 'High', color: 'bg-orange-500/20 text-orange-400', icon: AlertTriangle },
  urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-400', icon: Zap }
};

const categories = [
  { id: 'technical', name: 'Technical Issues', icon: '🔧' },
  { id: 'billing', name: 'Billing & Payments', icon: '💳' },
  { id: 'account', name: 'Account Management', icon: '👤' },
  { id: 'feature', name: 'Feature Request', icon: '💡' },
  { id: 'bug', name: 'Bug Report', icon: '🐛' },
  { id: 'general', name: 'General Inquiry', icon: '❓' }
];

// Sample tickets data
const sampleTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to generate content - API timeout errors',
    description: 'I keep getting timeout errors when trying to generate long-form content...',
    status: 'in_progress',
    priority: 'high',
    category: 'technical',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T14:20:00Z',
    lastResponseAt: '2025-01-15T14:20:00Z',
    assignedTo: 'Sarah Chen',
    responseTime: 2,
    attachments: 2,
    messagesCount: 5,
    tags: ['api', 'timeout', 'content-generation']
  },
  {
    id: 'TKT-002',
    subject: 'Billing question about pro plan upgrade',
    description: 'I upgraded to pro but still see starter limits...',
    status: 'waiting_for_response',
    priority: 'medium',
    category: 'billing',
    createdAt: '2025-01-14T16:45:00Z',
    updatedAt: '2025-01-15T09:10:00Z',
    lastResponseAt: '2025-01-15T09:10:00Z',
    assignedTo: 'Mike Johnson',
    responseTime: 1,
    attachments: 1,
    messagesCount: 3,
    tags: ['billing', 'upgrade', 'limits']
  },
  {
    id: 'TKT-003',
    subject: 'Feature request: Bulk template import',
    description: 'Would love to be able to import multiple templates at once...',
    status: 'open',
    priority: 'low',
    category: 'feature',
    createdAt: '2025-01-13T11:20:00Z',
    updatedAt: '2025-01-13T11:20:00Z',
    attachments: 0,
    messagesCount: 1,
    tags: ['templates', 'import', 'bulk-operations']
  }
];

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(searchQuery && { query: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
        ...(priorityFilter && { priority: priorityFilter }),
        ...(categoryFilter && { category: categoryFilter })
      });

      const response = await fetch(`/api/support/tickets?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data.data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const filteredTickets = tickets.filter(ticket => {
    if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter && ticket.status !== statusFilter) return false;
    if (priorityFilter && ticket.priority !== priorityFilter) return false;
    if (categoryFilter && ticket.category !== categoryFilter) return false;
    return true;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
              <p className="text-zinc-400 mt-2">Manage your support requests and track their progress</p>
            </div>
            
            <Link
              href="/support/tickets/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold">{ticketStats.total}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Open</p>
                <p className="text-2xl font-bold text-blue-400">{ticketStats.open}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{ticketStats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{ticketStats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <Link href={`/support/tickets/${ticket.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="font-mono text-sm text-zinc-500">{ticket.id}</span>
                        
                        <span className={`px-2 py-1 border rounded-full text-xs ${statusConfig[ticket.status].color}`}>
                          {statusConfig[ticket.status].label}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityConfig[ticket.priority].color}`}>
                          {priorityConfig[ticket.priority].label}
                        </span>
                        
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                          {categories.find(c => c.id === ticket.category)?.icon} {categories.find(c => c.id === ticket.category)?.name}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {ticket.subject}
                      </h3>
                      
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                        {ticket.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-xs text-zinc-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created {getTimeAgo(ticket.createdAt)}
                        </span>
                        
                        {ticket.lastResponseAt && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Last response {getTimeAgo(ticket.lastResponseAt)}
                          </span>
                        )}
                        
                        {ticket.assignedTo && (
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Assigned to {ticket.assignedTo}
                          </span>
                        )}
                        
                        <span className="flex items-center">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          {ticket.messagesCount} messages
                        </span>
                        
                        {ticket.attachments > 0 && (
                          <span className="flex items-center">
                            <Paperclip className="w-3 h-3 mr-1" />
                            {ticket.attachments} attachments
                          </span>
                        )}
                      </div>
                      
                      {ticket.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {ticket.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tickets found</h3>
              <p className="text-zinc-400 mb-6">
                {searchQuery || statusFilter || priorityFilter || categoryFilter
                  ? 'Try adjusting your filters'
                  : 'You haven\'t created any support tickets yet'
                }
              </p>
              <Link
                href="/support/tickets/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Need Help?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/support/help"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <FileText className="w-6 h-6 text-blue-400 mb-2" />
              <h4 className="font-medium text-white mb-1">Help Center</h4>
              <p className="text-zinc-400 text-sm">Browse our knowledge base</p>
            </Link>
            
            <Link
              href="/contact"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-green-400 mb-2" />
              <h4 className="font-medium text-white mb-1">Live Chat</h4>
              <p className="text-zinc-400 text-sm">Chat with our support team</p>
            </Link>
            
            <a
              href="mailto:support@omnipreneur.ai"
              className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <ArrowUpRight className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="font-medium text-white mb-1">Email Support</h4>
              <p className="text-zinc-400 text-sm">Send us an email</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}