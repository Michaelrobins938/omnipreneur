// app/novus/workspace/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import PromptEditor from '@/components/novus/PromptEditor';
import OptimizationPreview from '@/components/novus/OptimizationPreview';
import MetricsStrip from '@/components/novus/MetricsStrip';
import RunControls from '@/components/novus/RunControls';
import SessionSidebar from '@/components/novus/SessionSidebar';
import TemplateManager from '@/components/novus/TemplateManager';
import UpgradeGate from '@/components/novus/UpgradeGate';
import DocsShortcut from '@/components/novus/DocsShortcut';
import HotkeysHelp from '@/components/novus/HotkeysHelp';
import { NovusSession, NovusTemplate } from '@/lib/novus/types';
import { checkFreeTierLimits } from '@/lib/novus/limits';

export default function NovusWorkspace() {
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    readability: 0,
    structure: 0,
    safety: 0,
    tokenDeltaPct: 0
  });
  const [sessions, setSessions] = useState<NovusSession[]>([]);
  const [templates, setTemplates] = useState<NovusTemplate[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [usage, setUsage] = useState({ remaining: 5, limit: 5 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NovusTemplate | null>(null);
  const searchParams = useSearchParams();

  // Load data on component mount
  useEffect(() => {
    loadSessions();
    loadTemplates();
    loadUsage();
    
    // Check if there's a template ID in the URL
    const templateId = searchParams.get('template');
    if (templateId) {
      loadTemplate(templateId);
    }
  }, []);

  // Load sessions from API
  const loadSessions = async () => {
    try {
      const response = await fetch('/api/novus/sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  // Load templates from API
  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/novus/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  // Load usage info from API
  const loadUsage = async () => {
    try {
      const response = await fetch('/api/novus/usage');
      const data = await response.json();
      if (data.success) {
        setUsage(data.data);
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  // Load a specific template
  const loadTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/novus/templates/${templateId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedTemplate(data.data);
        setInputPrompt(data.data.body);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  // Handle optimize
  const handleOptimize = async () => {
    // Emit analytics event
    console.log('novus_optimize_run');
    
    setIsOptimizing(true);
    
    try {
      // Replace variables in the prompt
      let promptWithVariables = inputPrompt;
      Object.entries(variables).forEach(([key, val]) => {
        promptWithVariables = promptWithVariables.replace(new RegExp(key, 'g'), val);
      });
      
      const response = await fetch('/api/novus/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptWithVariables
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Emit success analytics event
        console.log('novus_optimize_success');
        
        setOptimizedPrompt(data.data.optimized);
        setImprovements(data.data.improvements);
        setMetrics(data.data.metrics);
      } else {
        // Emit error analytics event
        console.log('novus_optimize_error');
        alert(data.error?.message || 'Failed to optimize prompt');
      }
    } catch (error) {
      // Emit error analytics event
      console.log('novus_optimize_error');
      console.error('Optimization error:', error);
      alert('An error occurred while optimizing the prompt');
    } finally {
      setIsOptimizing(false);
      loadUsage(); // Refresh usage after optimization
    }
  };

  // Handle save session
  const handleSaveSession = async () => {
    try {
      const response = await fetch('/api/novus/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: inputPrompt.substring(0, 50) + (inputPrompt.length > 50 ? '...' : ''),
          tags: [],
          input: inputPrompt,
          optimized: optimizedPrompt,
          metrics,
          diff: '' // In a real implementation, this would be a proper diff
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Emit analytics event
        console.log('novus_session_saved');
        
        // Reload sessions
        loadSessions();
        alert('Session saved successfully!');
      } else {
        alert(data.error?.message || 'Failed to save session');
      }
    } catch (error) {
      console.error('Save session error:', error);
      alert('An error occurred while saving the session');
    }
  };

  // Handle copy optimized prompt
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      alert('Optimized prompt copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy to clipboard');
    }
  };

  // Handle export
  const handleExport = async (format: 'json' | 'md') => {
    // Emit analytics event
    console.log('novus_export_clicked', { format });
    
    try {
      let content = '';
      let filename = '';
      let mimeType = '';
      
      if (format === 'json') {
        content = JSON.stringify({
          input: inputPrompt,
          optimized: optimizedPrompt,
          metrics,
          improvements
        }, null, 2);
        filename = 'novus-session.json';
        mimeType = 'application/json';
      } else {
        content = `# NOVUS Protocol Session

## Original Prompt
${inputPrompt}

## Optimized Prompt
${optimizedPrompt}

## Metrics
- Readability: ${metrics.readability.toFixed(1)}
- Structure: ${metrics.structure.toFixed(1)}
- Safety: ${metrics.safety.toFixed(1)}
- Token Change: ${metrics.tokenDeltaPct.toFixed(1)}%

')}
## Improvements
${improvements.map(imp => `- ${imp}`).join('\n')}
`;
        filename = 'novus-session.md';
        mimeType = 'text/markdown';
      }
      
      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export session');
    }
  };

  // Handle session selection
  const handleSelectSession = (session: NovusSession) => {
    setInputPrompt(session.input);
    setOptimizedPrompt(session.optimized);
    setMetrics(session.metrics);
    setImprovements([]); // Improvements aren't stored in sessions
  };

  // Handle create new session
  const handleCreateNew = () => {
    setInputPrompt('');
    setOptimizedPrompt('');
    setMetrics({
      readability: 0,
      structure: 0,
      safety: 0,
      tokenDeltaPct: 0
    });
    setImprovements([]);
  };

  // Handle template selection
  const handleSelectTemplate = (template: NovusTemplate) => {
    setSelectedTemplate(template);
    setInputPrompt(template.body);
    setVariables({}); // Reset variables when selecting a new template
  };

  // Handle create template
  const handleCreateTemplate = async (template: Omit<NovusTemplate, 'id'>) => {
    try {
      const response = await fetch('/api/novus/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload templates
        loadTemplates();
      } else {
        alert(data.error?.message || 'Failed to create template');
      }
    } catch (error) {
      console.error('Create template error:', error);
      alert('An error occurred while creating the template');
    }
  };

  // Handle update template
  const handleUpdateTemplate = async (id: string, template: Partial<NovusTemplate>) => {
    try {
      const response = await fetch(`/api/novus/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload templates
        loadTemplates();
      } else {
        alert(data.error?.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Update template error:', error);
      alert('An error occurred while updating the template');
    }
  };

  // Handle delete template
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/novus/templates/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload templates
        loadTemplates();
        // Clear selected template if it was the one deleted
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
        }
      } else {
        alert(data.error?.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Delete template error:', error);
      alert('An error occurred while deleting the template');
    }
  };

  // Handle upgrade
  const handleUpgrade = () => {
    // This would be called when user initiates checkout
    console.log('checkout_initiated');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleOptimize();
            break;
          case 's':
            e.preventDefault();
            handleSaveSession();
            break;
          case 'b':
            e.preventDefault();
            handleCopy();
            break;
          case 'e':
            e.preventDefault();
            handleExport('md');
            break;
          case 't':
            e.preventDefault();
            // Apply template logic would go here
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputPrompt, optimizedPrompt, metrics, improvements]);

  return (
    <ProductAccessControl
      productId="novus-protocol"
      productName="NOVUS Protocol"
      requiredPlans={['NOVUS_PROTOCOL', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
      <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
        <div className="max-w-8xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">NOVUS Protocol</h1>
                <p className="text-zinc-400">AI Prompt Optimization Workspace</p>
              </div>
              <div className="flex items-center space-x-3">
                <DocsShortcut />
                <HotkeysHelp onApplyTemplate={() => {}} />
              </div>
            </div>
            
            <div className="mt-4">
              <UpgradeGate 
                remaining={usage.remaining} 
                limit={usage.limit} 
                onUpgrade={handleUpgrade} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Sessions */}
            <div className="lg:col-span-1">
              <SessionSidebar 
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onCreateNew={handleCreateNew}
              />
            </div>

            {/* Center - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <PromptEditor
                value={inputPrompt}
                onChange={setInputPrompt}
                onOptimize={handleOptimize}
                variables={variables}
                onVariablesChange={setVariables}
                templateVariables={selectedTemplate?.variables || []}
              />
              
              <RunControls
                onRun={handleOptimize}
                onSave={handleSaveSession}
                onCopy={handleCopy}
                onExport={handleExport}
                isRunning={isOptimizing}
              />
              
              {optimizedPrompt && (
                <>
                  <OptimizationPreview
                    original={inputPrompt}
                    optimized={optimizedPrompt}
                    improvements={improvements}
                  />
                  
                  <MetricsStrip
                    readability={metrics.readability}
                    structure={metrics.structure}
                    safety={metrics.safety}
                    tokenDeltaPct={metrics.tokenDeltaPct}
                  />
                </>
              )}
            </div>

            {/* Right Sidebar - Templates */}
            <div className="lg:col-span-1">
              <TemplateManager
                templates={templates}
                onSelectTemplate={handleSelectTemplate}
                onCreateTemplate={handleCreateTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </ProductAccessControl>
  );
}