'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download,
  FileText,
  FileSpreadsheet,
  Image,
  Code,
  Copy,
  CheckCircle,
  ExternalLink,
  Zap,
  Package,
  Globe,
  Calendar,
  BarChart3,
  Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportResultsProps {
  data: any;
  type: 'content' | 'rewrite' | 'bundle' | 'niche';
  onClose?: () => void;
}

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  extension: string;
  mimeType: string;
}

const ExportFormats: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON',
    description: 'Structured data format for developers',
    icon: <Code className="w-5 h-5" />,
    extension: 'json',
    mimeType: 'application/json'
  },
  {
    id: 'csv',
    name: 'CSV',
    description: 'Spreadsheet format for data analysis',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    extension: 'csv',
    mimeType: 'text/csv'
  },
  {
    id: 'txt',
    name: 'Text',
    description: 'Plain text format for content',
    icon: <FileText className="w-5 h-5" />,
    extension: 'txt',
    mimeType: 'text/plain'
  },
  {
    id: 'md',
    name: 'Markdown',
    description: 'Formatted text with markup',
    icon: <Hash className="w-5 h-5" />,
    extension: 'md',
    mimeType: 'text/markdown'
  }
];

export default function ExportResults({ data, type, onClose }: ExportResultsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeAnalytics, setIncludeAnalytics] = useState(true);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const generateFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${type}-export-${timestamp}`;
  };

  const prepareData = () => {
    const exportData = {
      ...data,
      exportInfo: {
        type,
        exportedAt: new Date().toISOString(),
        format: selectedFormat,
        includeMetadata,
        includeAnalytics
      }
    };

    if (!includeMetadata) {
      delete exportData.methodology;
      delete exportData.exportInfo;
    }

    if (!includeAnalytics) {
      delete exportData.metrics;
      delete exportData.analysis;
    }

    return exportData;
  };

  const formatDataForExport = (format: string) => {
    const processedData = prepareData();

    switch (format) {
      case 'json':
        return JSON.stringify(processedData, null, 2);
      
      case 'csv':
        return convertToCSV(processedData);
      
      case 'txt':
        return convertToText(processedData);
      
      case 'md':
        return convertToMarkdown(processedData);
      
      default:
        return JSON.stringify(processedData, null, 2);
    }
  };

  const convertToCSV = (data: any) => {
    if (type === 'content' && data.content) {
      const headers = ['Content', 'Viral Score', 'Engagement Score', 'Hashtags'];
      const rows = data.content.map((item: any) => [
        `"${item.text.replace(/"/g, '""')}"`,
        item.viralScore || 0,
        item.engagementScore || 0,
        `"${(item.hashtags || []).join(', ')}"`
      ]);
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    // For other types, create a basic CSV structure
    const flatData = flattenObject(data);
    const headers = Object.keys(flatData);
    const values = Object.values(flatData);
    return [headers.join(','), values.join(',')].join('\n');
  };

  const convertToText = (data: any) => {
    let text = `${type.toUpperCase()} EXPORT\n`;
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    if (type === 'content' && data.content) {
      data.content.forEach((item: any, index: number) => {
        text += `--- Content ${index + 1} ---\n`;
        text += `${item.text}\n`;
        if (item.hashtags) text += `Hashtags: ${item.hashtags.join(' ')}\n`;
        if (item.viralScore) text += `Viral Score: ${Math.round(item.viralScore * 100)}%\n`;
        text += '\n';
      });
    } else {
      text += JSON.stringify(data, null, 2);
    }
    
    return text;
  };

  const convertToMarkdown = (data: any) => {
    let md = `# ${type.charAt(0).toUpperCase() + type.slice(1)} Export\n\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
    
    if (type === 'content' && data.content) {
      md += `## Generated Content\n\n`;
      data.content.forEach((item: any, index: number) => {
        md += `### Content ${index + 1}\n\n`;
        md += `${item.text}\n\n`;
        if (item.hashtags && item.hashtags.length > 0) {
          md += `**Hashtags:** ${item.hashtags.join(' ')}\n\n`;
        }
        if (item.viralScore) {
          md += `**Viral Score:** ${Math.round(item.viralScore * 100)}%\n\n`;
        }
        md += '---\n\n';
      });
    } else if (type === 'bundle' && data.marketing) {
      md += `## Bundle: ${data.bundleName}\n\n`;
      md += `${data.positioning}\n\n`;
      md += `### Marketing Materials\n\n`;
      md += `**Value Proposition:** ${data.marketing.valueProposition}\n\n`;
      md += `**Headlines:**\n`;
      data.marketing.headlines.forEach((headline: string) => {
        md += `- ${headline}\n`;
      });
    } else {
      md += '```json\n';
      md += JSON.stringify(data, null, 2);
      md += '\n```\n';
    }
    
    return md;
  };

  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = Array.isArray(obj[key]) ? obj[key].join('; ') : obj[key];
        }
      }
    }
    
    return flattened;
  };

  const handleExport = () => {
    const format = ExportFormats.find(f => f.id === selectedFormat);
    if (!format) return;

    const content = formatDataForExport(selectedFormat);
    const blob = new Blob([content], { type: format.mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generateFileName()}.${format.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleCopy = async () => {
    const content = formatDataForExport(selectedFormat);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'content': return <Zap className="w-5 h-5 text-purple-400" />;
      case 'rewrite': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'bundle': return <Package className="w-5 h-5 text-green-400" />;
      case 'niche': return <BarChart3 className="w-5 h-5 text-orange-400" />;
      default: return <Download className="w-5 h-5" />;
    }
  };

  const getDataStats = () => {
    switch (type) {
      case 'content':
        return {
          items: data.content?.length || 0,
          type: 'content pieces',
          metrics: data.metrics ? Object.keys(data.metrics).length : 0
        };
      case 'rewrite':
        return {
          items: data.alternatives?.length || 0,
          type: 'alternatives',
          metrics: data.analysis ? Object.keys(data.analysis.improvements).length : 0
        };
      case 'bundle':
        return {
          items: data.products?.length || 0,
          type: 'products',
          metrics: data.analysis ? Object.keys(data.analysis).length : 0
        };
      case 'niche':
        return {
          items: data.niches?.length || 0,
          type: 'niches analyzed',
          metrics: data.keywordSuggestions?.length || 0
        };
      default:
        return { items: 0, type: 'items', metrics: 0 };
    }
  };

  const stats = getDataStats();

  return (
    <Card className="bg-zinc-900 border-zinc-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getTypeIcon()}
          <span>Export Results</span>
        </CardTitle>
        <CardDescription>
          Download or copy your AI-generated {type} results in various formats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{stats.items}</p>
            <p className="text-xs text-zinc-400">{stats.type}</p>
          </div>
          <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{stats.metrics}</p>
            <p className="text-xs text-zinc-400">metrics</p>
          </div>
          <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
            <p className="text-2xl font-bold text-white">{Object.keys(data).length}</p>
            <p className="text-xs text-zinc-400">data fields</p>
          </div>
        </div>

        {/* Export Options */}
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-3 block">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ExportFormats.map((format) => (
                  <motion.div
                    key={format.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        selectedFormat === format.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-400">
                            {format.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{format.name}</h4>
                            <p className="text-xs text-zinc-400">{format.description}</p>
                          </div>
                          {selectedFormat === format.id && (
                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="metadata" 
                  checked={includeMetadata} 
                  onCheckedChange={(checked) => setIncludeMetadata(!!checked)}
                />
                <label htmlFor="metadata" className="text-sm text-white">
                  Include metadata and timestamps
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analytics" 
                  checked={includeAnalytics} 
                  onCheckedChange={(checked) => setIncludeAnalytics(!!checked)}
                />
                <label htmlFor="analytics" className="text-sm text-white">
                  Include analytics and metrics
                </label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="bg-zinc-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-2">Preview</h4>
          <pre className="text-xs text-zinc-400 overflow-x-auto max-h-32">
            {formatDataForExport(selectedFormat).substring(0, 200)}...
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleExport}
            className="flex items-center space-x-2 flex-1"
            disabled={exported}
          >
            {exported ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{exported ? 'Exported!' : 'Download'}</span>
          </Button>
          
          <Button 
            onClick={handleCopy}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={copied}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          
          {onClose && (
            <Button 
              onClick={onClose}
              variant="ghost"
            >
              Close
            </Button>
          )}
        </div>

        {/* File Info */}
        <div className="text-xs text-zinc-500 text-center">
          File will be saved as: {generateFileName()}.{ExportFormats.find(f => f.id === selectedFormat)?.extension}
        </div>
      </CardContent>
    </Card>
  );
}