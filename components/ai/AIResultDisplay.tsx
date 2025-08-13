'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy,
  Download,
  RefreshCw,
  Share2,
  Bookmark,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Code,
  FileText,
  Image,
  Palette,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Edit3,
  Save,
  Trash2,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AIResult {
  id: string;
  type: 'text' | 'code' | 'json' | 'design' | 'image' | 'data';
  title?: string;
  content: any;
  metadata?: {
    model?: string;
    processingTime?: number;
    tokens?: number;
    qualityScore?: number;
    timestamp?: string;
  };
  actions?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    variant?: 'default' | 'outline' | 'ghost';
    onClick: () => void;
  }>;
}

interface AIResultDisplayProps {
  result: AIResult;
  onSave?: (result: AIResult) => void;
  onRate?: (result: AIResult, rating: 'up' | 'down') => void;
  onEdit?: (result: AIResult) => void;
  onCopy?: (content: string) => void;
  onShare?: (result: AIResult) => void;
  className?: string;
  editable?: boolean;
  collapsible?: boolean;
}

export function AIResultDisplay({
  result,
  onSave,
  onRate,
  onEdit,
  onCopy,
  onShare,
  className = '',
  editable = false,
  collapsible = false
}: AIResultDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editedContent, setEditedContent] = useState(result.content);
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    const textContent = typeof result.content === 'string' 
      ? result.content 
      : JSON.stringify(result.content, null, 2);
    
    try {
      await navigator.clipboard.writeText(textContent);
      onCopy?.(textContent);
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ ...result, content: editedContent });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
    setIsEditing(false);
  };

  const handleRate = (newRating: 'up' | 'down') => {
    setRating(newRating);
    onRate?.(result, newRating);
  };

  const getTypeIcon = () => {
    switch (result.type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'json': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getQualityColor = (score?: number) => {
    if (!score) return 'text-zinc-400';
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          {typeof editedContent === 'string' ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Edit content..."
            />
          ) : (
            <Textarea
              value={JSON.stringify(editedContent, null, 2)}
              onChange={(e) => {
                try {
                  setEditedContent(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, keep as string temporarily
                }
              }}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Edit JSON content..."
            />
          )}
          
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    switch (result.type) {
      case 'code':
        return <CodeDisplay content={result.content} />;
      case 'design':
        return <DesignDisplay content={result.content} />;
      case 'json':
        return <JSONDisplay content={result.content} />;
      case 'text':
      default:
        return <TextDisplay content={result.content} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                {getTypeIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {result.title || `AI Generated ${result.type}`}
                </CardTitle>
                {result.metadata && (
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    {result.metadata.model && (
                      <span>Model: {result.metadata.model}</span>
                    )}
                    {result.metadata.processingTime && (
                      <span>Time: {result.metadata.processingTime}ms</span>
                    )}
                    {result.metadata.qualityScore && (
                      <span className={getQualityColor(result.metadata.qualityScore)}>
                        Quality: {result.metadata.qualityScore}%
                      </span>
                    )}
                  </CardDescription>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {result.metadata?.qualityScore && (
                <Badge variant="outline" className={getQualityColor(result.metadata.qualityScore)}>
                  {result.metadata.qualityScore}% Quality
                </Badge>
              )}
              
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <div className="space-y-4">
                  {/* Content Display */}
                  <div className="relative">
                    {renderContent()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>

                    {editable && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}

                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => onShare?.(result)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>

                    <div className="flex-1" />

                    {/* Rating Buttons */}
                    <div className="flex items-center space-x-1">
                      <Button
                        variant={rating === 'up' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleRate('up')}
                        className={rating === 'up' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={rating === 'down' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => handleRate('down')}
                        className={rating === 'down' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Save Status */}
                    <AnimatePresence>
                      {isSaved && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center space-x-1 text-green-400"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Saved!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Custom Actions */}
                    {result.actions?.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant || 'outline'}
                        size="sm"
                        onClick={action.onClick}
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Content-specific display components
function TextDisplay({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
        <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-sans leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}

function CodeDisplay({ content }: { content: string }) {
  const [language, setLanguage] = useState('javascript');
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          <Code className="w-3 h-3 mr-1" />
          {language}
        </Badge>
      </div>
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 overflow-x-auto">
        <pre className="text-sm text-zinc-300 font-mono">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}

function JSONDisplay({ content }: { content: any }) {
  return (
    <div className="space-y-2">
      <Badge variant="outline">
        <FileText className="w-3 h-3 mr-1" />
        JSON
      </Badge>
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 overflow-x-auto">
        <pre className="text-sm text-zinc-300 font-mono">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function DesignDisplay({ content }: { content: any }) {
  const { designs, colorPalette, typography } = content;
  
  return (
    <div className="space-y-6">
      {/* Color Palette */}
      {colorPalette && (
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Color Palette</h4>
          <div className="flex space-x-2">
            {colorPalette.map((color: string, index: number) => (
              <div key={index} className="text-center">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-zinc-600 shadow-lg"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-zinc-400 mt-1 font-mono">{color}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography */}
      {typography && (
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Typography</h4>
          <div className="space-y-2">
            <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
              <p className="text-zinc-400 text-xs">Headings</p>
              <p className="text-white" style={{ fontFamily: typography.headings }}>
                {typography.headings}
              </p>
            </div>
            <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800">
              <p className="text-zinc-400 text-xs">Body</p>
              <p className="text-white" style={{ fontFamily: typography.body }}>
                {typography.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Design Elements */}
      {designs && designs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-zinc-400 mb-3">Design System</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designs.map((design: any, index: number) => (
              <div key={index} className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <h5 className="text-white font-medium mb-2">{design.style || `Design ${index + 1}`}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Layout:</span>
                    <span className="text-white">{design.layout}</span>
                  </div>
                  {design.spacing && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Spacing:</span>
                      <span className="text-white">{design.spacing.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Bulk result display for multiple results
interface AIResultGridProps {
  results: AIResult[];
  onSelect?: (result: AIResult) => void;
  onBulkAction?: (results: AIResult[], action: string) => void;
  className?: string;
}

export function AIResultGrid({ 
  results, 
  onSelect, 
  onBulkAction,
  className = '' 
}: AIResultGridProps) {
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const toggleSelection = (resultId: string) => {
    const newSelection = new Set(selectedResults);
    if (newSelection.has(resultId)) {
      newSelection.delete(resultId);
    } else {
      newSelection.add(resultId);
    }
    setSelectedResults(newSelection);
  };

  const handleBulkAction = (action: string) => {
    const selected = results.filter(r => selectedResults.has(r.id));
    onBulkAction?.(selected, action);
    setSelectedResults(new Set());
  };

  return (
    <div className={className}>
      {selectedResults.size > 0 && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-400">
              {selectedResults.size} result{selectedResults.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleBulkAction('export')}>
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedResults(new Set())}>
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result) => (
          <div key={result.id} className="relative">
            <label className="absolute top-4 left-4 z-10 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedResults.has(result.id)}
                onChange={() => toggleSelection(result.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 transition-colors ${
                selectedResults.has(result.id)
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-zinc-600 hover:border-zinc-500'
              }`}>
                {selectedResults.has(result.id) && (
                  <CheckCircle className="w-3 h-3 text-white m-0.5" />
                )}
              </div>
            </label>
            
            <AIResultDisplay
              result={result}
              collapsible
              editable
              className="ml-8"
              onCopy={(content) => {
                // Handle copy
              }}
              onSave={(result) => {
                // Handle save
              }}
              onRate={(result, rating) => {
                // Handle rating
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}