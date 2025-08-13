import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface ToolsLayoutProps {
  children: React.ReactNode;
  currentTool?: string;
}

const ToolsLayout: React.FC<ToolsLayoutProps> = ({ children, currentTool }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tools = [
    { id: 'codebase-search', name: 'Codebase Search', description: 'Semantic search that finds code by meaning' },
    { id: 'read-file', name: 'Read File', description: 'View and analyze file contents' },
    { id: 'run-terminal', name: 'Terminal Commands', description: 'Execute terminal commands securely' },
    { id: 'list-directory', name: 'List Directory', description: 'Browse directory contents' },
    { id: 'grep-search', name: 'Grep Search', description: 'Find exact text matches' },
    { id: 'edit-file', name: 'Edit File', description: 'Modify or create files' },
    { id: 'search-replace', name: 'Search & Replace', description: 'Replace text in files' },
    { id: 'file-search', name: 'File Search', description: 'Find files by name' },
  ];

  return (
    <div className="min-h-screen bg-[#E8EDF2]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-[#E8EDF2]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#2D1A45] text-xl font-bold">
            Tools
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
            <div className="p-4 space-y-2">
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    currentTool === tool.id
                      ? 'bg-[#2D1A45] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm opacity-75">{tool.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar and Content */}
      <div className="flex pt-24">
        {/* Sidebar */}
        <div className="hidden md:block w-80 fixed h-screen overflow-y-auto p-8 border-r border-gray-200">
          <div className="space-y-2">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className={`block p-4 rounded-lg transition-colors ${
                  currentTool === tool.id
                    ? 'bg-[#2D1A45] text-white'
                    : 'hover:bg-white'
                }`}
              >
                <div className="font-medium">{tool.name}</div>
                <div className="text-sm opacity-75">{tool.description}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:ml-80 w-full min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsLayout; 