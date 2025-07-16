import React, { useState } from 'react';
import Head from 'next/head';
import ToolsLayout from '../../components/ToolsLayout';
import { Search, Code2, FolderSearch } from 'lucide-react';

const CodebaseSearchPage = () => {
  const [query, setQuery] = useState('');
  const [targetDir, setTargetDir] = useState('');

  return (
    <ToolsLayout currentTool="codebase-search">
      <Head>
        <title>Codebase Search | Development Tools</title>
        <meta name="description" content="Semantic search that finds code by meaning, not exact text" />
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#2D1A45] mb-4">Codebase Search</h1>
          <p className="text-gray-600 text-lg">
            Find code by meaning, not just text matching. Perfect for exploring unfamiliar codebases
            and understanding implementation details.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Search Query</span>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="How does user authentication work?"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D1A45] focus:border-transparent transition-shadow pl-12"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium mb-2 block">Target Directory (Optional)</span>
              <div className="relative">
                <input
                  type="text"
                  value={targetDir}
                  onChange={(e) => setTargetDir(e.target.value)}
                  placeholder="src/components/"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#2D1A45] focus:border-transparent transition-shadow pl-12"
                />
                <FolderSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </label>
          </div>

          <button className="w-full bg-[#2D1A45] text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2">
            <Code2 size={20} />
            <span>Search Codebase</span>
          </button>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2D1A45] mb-6">Usage Guidelines</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">When to Use</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Exploring unfamiliar codebases
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Understanding implementation details
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Finding code by functionality
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">When Not to Use</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">×</span>
                  Exact text matches (use grep instead)
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">×</span>
                  Reading known files
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">×</span>
                  Simple symbol lookups
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Example Queries */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#2D1A45] mb-6">Example Queries</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">"Where is the user authentication logic implemented?"</div>
              <div className="text-gray-600 mt-2">Finds authentication-related code across the codebase</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">"How are API requests handled in the frontend?"</div>
              <div className="text-gray-600 mt-2">Locates API integration code in frontend components</div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-[#2D1A45]">"What happens when a user submits the contact form?"</div>
              <div className="text-gray-600 mt-2">Traces form submission flow through the application</div>
            </div>
          </div>
        </div>
      </div>
    </ToolsLayout>
  );
};

export default CodebaseSearchPage; 