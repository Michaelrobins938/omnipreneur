'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Plus,
  Folder,
  FolderOpen,
  Edit,
  Trash2,
  Move,
  Search,
  Grid,
  List,
  MoreHorizontal,
  FileText,
  Calendar,
  ChevronRight,
  ChevronDown,
  DragIndicator,
  Color,
  Check,
  X,
  Archive,
  Star,
  BarChart3
} from 'lucide-react';

interface ContentFolder {
  id: string;
  name: string;
  color?: string;
  parentId?: string;
  children?: ContentFolder[];
  createdAt: string;
  _count: {
    content: number;
  };
}

interface ContentItem {
  id: string;
  title: string;
  contentType: string;
  createdAt: string;
  isFavorited: boolean;
}

const folderColors = [
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Green', value: '#10B981', class: 'bg-emerald-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Orange', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Cyan', value: '#06B6D4', class: 'bg-cyan-500' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
  { name: 'Gray', value: '#6B7280', class: 'bg-gray-500' }
];

export default function FoldersPage() {
  const [folders, setFolders] = useState<ContentFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ContentFolder | null>(null);
  const [folderContent, setFolderContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<ContentFolder | null>(null);
  const [draggedFolder, setDraggedFolder] = useState<ContentFolder | null>(null);

  // Form state
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState(folderColors[0].value);
  const [parentFolderId, setParentFolderId] = useState<string>('');

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchFolderContent(selectedFolder.id);
    }
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/content-library/folders', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(buildFolderTree(data.data));
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderContent = async (folderId: string) => {
    try {
      const response = await fetch(`/api/content-library?folder=${folderId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setFolderContent(data.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch folder content:', error);
    }
  };

  const buildFolderTree = (flatFolders: ContentFolder[]): ContentFolder[] => {
    const folderMap = new Map<string, ContentFolder>();
    const rootFolders: ContentFolder[] = [];

    // Create map of all folders
    flatFolders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Build tree structure
    flatFolders.forEach(folder => {
      const folderWithChildren = folderMap.get(folder.id)!;
      
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children!.push(folderWithChildren);
        }
      } else {
        rootFolders.push(folderWithChildren);
      }
    });

    return rootFolders;
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    try {
      const response = await fetch('/api/content-library/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: folderName,
          color: folderColor,
          parentId: parentFolderId || undefined
        })
      });

      if (response.ok) {
        await fetchFolders();
        setShowCreateModal(false);
        setFolderName('');
        setFolderColor(folderColors[0].value);
        setParentFolderId('');
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleEditFolder = async () => {
    if (!editingFolder || !folderName.trim()) return;

    try {
      const response = await fetch(`/api/content-library/folders/${editingFolder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: folderName,
          color: folderColor,
          parentId: parentFolderId || undefined
        })
      });

      if (response.ok) {
        await fetchFolders();
        setShowEditModal(false);
        setEditingFolder(null);
        setFolderName('');
        setFolderColor(folderColors[0].value);
        setParentFolderId('');
      }
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/content-library/folders/${folderId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchFolders();
        if (selectedFolder?.id === folderId) {
          setSelectedFolder(null);
          setFolderContent([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const toggleFolderExpansion = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const openEditModal = (folder: ContentFolder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setFolderColor(folder.color || folderColors[0].value);
    setParentFolderId(folder.parentId || '');
    setShowEditModal(true);
  };

  const renderFolder = (folder: ContentFolder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    const isSelected = selectedFolder?.id === folder.id;

    return (
      <div key={folder.id} className="mb-1">
        <div
          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
            isSelected 
              ? 'bg-blue-600/20 border border-blue-500/30' 
              : 'hover:bg-zinc-800/50'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedFolder(folder)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolderExpansion(folder.id);
              }}
              className="p-1 hover:bg-zinc-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-5" />}
          
          <div 
            className="w-4 h-4 rounded flex items-center justify-center"
            style={{ backgroundColor: folder.color || '#6B7280' }}
          >
            {isExpanded ? (
              <FolderOpen className="w-3 h-3 text-white" />
            ) : (
              <Folder className="w-3 h-3 text-white" />
            )}
          </div>
          
          <span className="text-sm font-medium flex-1">{folder.name}</span>
          
          <span className="text-xs text-zinc-400">
            {folder._count.content}
          </span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(folder);
              }}
              className="p-1 hover:bg-zinc-700 rounded"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id);
              }}
              className="p-1 hover:bg-red-600 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4">
            {folder.children!.map(childFolder => 
              renderFolder(childFolder, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFolderOptions = (flatFolders: ContentFolder[], currentFolderId?: string): JSX.Element[] => {
    return flatFolders
      .filter(f => f.id !== currentFolderId)
      .map(folder => (
        <option key={folder.id} value={folder.id}>
          {folder.name}
        </option>
      ));
  };

  const getAllFolders = (folders: ContentFolder[]): ContentFolder[] => {
    const result: ContentFolder[] = [];
    
    const traverse = (folderList: ContentFolder[]) => {
      folderList.forEach(folder => {
        result.push(folder);
        if (folder.children) {
          traverse(folder.children);
        }
      });
    };
    
    traverse(folders);
    return result;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading folders...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white">Folder Organization</h1>
              <p className="text-zinc-400 mt-2">Organize your content with custom folders and categories</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Folder Tree */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Folder className="w-5 h-5 mr-2" />
                  Folders
                </h2>
              </div>
              
              <div className="p-4 space-y-1 max-h-96 overflow-y-auto">
                {folders.length > 0 ? (
                  folders.map(folder => renderFolder(folder))
                ) : (
                  <div className="text-center py-8">
                    <Folder className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">No folders created yet</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Create your first folder
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Folder Content */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {selectedFolder ? selectedFolder.name : 'Select a folder'}
                  </h2>
                  
                  {selectedFolder && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-zinc-400">
                        {folderContent.length} items
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'grid' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'list' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-zinc-800 border border-zinc-700 hover:bg-zinc-700'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {selectedFolder ? (
                  folderContent.length > 0 ? (
                    <div className={
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-3'
                    }>
                      {folderContent.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-all ${
                            viewMode === 'list' ? 'flex items-center space-x-4' : ''
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="w-4 h-4 text-blue-400" />
                              {item.isFavorited && <Star className="w-3 h-3 text-yellow-400" />}
                            </div>
                            
                            <h3 className="font-medium text-white mb-1 line-clamp-2">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                              <span>{item.contentType}</span>
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                          
                          <Link
                            href={`/dashboard/content-library/item/${item.id}`}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                          >
                            View
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Folder is empty</h3>
                      <p className="text-zinc-400">
                        Content items in this folder will appear here
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Folder className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Select a folder</h3>
                    <p className="text-zinc-400">
                      Choose a folder from the sidebar to view its contents
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Create New Folder</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Folder Name
                    </label>
                    <input
                      type="text"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {folderColors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setFolderColor(color.value)}
                          className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110`}
                        >
                          {folderColor === color.value && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Parent Folder (Optional)
                    </label>
                    <select
                      value={parentFolderId}
                      onChange={(e) => setParentFolderId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No parent (root level)</option>
                      {renderFolderOptions(getAllFolders(folders))}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mt-6">
                  <button
                    onClick={handleCreateFolder}
                    disabled={!folderName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Folder Modal */}
        <AnimatePresence>
          {showEditModal && editingFolder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Edit Folder</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Folder Name
                    </label>
                    <input
                      type="text"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Color
                    </label>
                    <div className="flex space-x-2">
                      {folderColors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setFolderColor(color.value)}
                          className={`w-8 h-8 rounded-full ${color.class} flex items-center justify-center transition-transform hover:scale-110`}
                        >
                          {folderColor === color.value && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Parent Folder (Optional)
                    </label>
                    <select
                      value={parentFolderId}
                      onChange={(e) => setParentFolderId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No parent (root level)</option>
                      {renderFolderOptions(getAllFolders(folders), editingFolder.id)}
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mt-6">
                  <button
                    onClick={handleEditFolder}
                    disabled={!folderName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Update Folder
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}