'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Folder,
  Star,
  BarChart3,
  Calendar,
  Tag,
  Eye,
  Copy,
  Share2,
  Download,
  Bookmark,
  SortAsc,
  SortDesc,
  ChevronDown,
  Clock,
  TrendingUp
} from 'lucide-react';
import ContentLibraryDashboard from '@/app/components/content-library/ContentLibraryDashboard';

export default function ContentLibraryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Content Library</h1>
              <p className="text-zinc-400 mt-2">Manage and organize all your generated content</p>
            </div>
            
            <Link
              href="/dashboard/content-library/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Link>
          </div>
        </div>

        {/* Content Library Dashboard Component */}
        <ContentLibraryDashboard />
      </div>
    </div>
  );
}