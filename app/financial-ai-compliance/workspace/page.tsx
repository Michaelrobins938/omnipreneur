'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import PromptEditor from '@/components/toolkit/PromptEditor';
import ResultPreview from '@/components/toolkit/ResultPreview';
import MetricsStrip from '@/components/toolkit/MetricsStrip';
import RunControls from '@/components/toolkit/RunControls';
import SessionSidebar from '@/components/toolkit/SessionSidebar';
import TemplateManager from '@/components/toolkit/TemplateManager';
import UpgradeGate from '@/components/toolkit/UpgradeGate';
import DocsShortcut from '@/components/toolkit/DocsShortcut';
import HotkeysHelp from '@/components/toolkit/HotkeysHelp';
import { Session, Template } from '@/lib/toolkit/types';
import { TOOL_STRATEGIES } from '@/lib/tools/strategies';

const PRODUCT_ID = 'financial-ai-compliance';
const strategy = TOOL_STRATEGIES[PRODUCT_ID];

export default function FinancialAIComplianceWorkspace() {
  const [inputContent, setInputContent] = useState('');
  const [resultContent, setResultContent] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [sessions, setSessions] = useState<Session[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [usage, setUsage] = useState({ remaining: 5, limit: 5 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    loadSessions();
    loadTemplates();
    loadUsage();
    
    const templateId = searchParams.get('template');
    if (templateId) {
      loadTemplate(templateId);
    }
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/sessions`);
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/templates`);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadUsage = async () => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/usage`);
      const data = await response.json();
      if (data.success) {
        setUsage(data.data);
      }
    } catch (error) {
      console.error('Error loading usage:', error);
    }
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/templates/${templateId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedTemplate(data.data);
        setInputContent(data.data.body);
      }
    } catch (error) {
      console.error('Error loading template:', error);
    }
  };

  const handleProcess = async () => {
    console.log(`${PRODUCT_ID}_run`);
    
    setIsProcessing(true);
    
    try {
      let contentWithVariables = inputContent;
      Object.entries(variables).forEach(([key, val]) => {
        contentWithVariables = contentWithVariables.replace(new RegExp(key, 'g'), val);
      });
      
      const response = await fetch(`/api/${PRODUCT_ID}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: contentWithVariables,
          params: { tone: 'professional', style: 'clear' }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`${PRODUCT_ID}_success`);
        
        setResultContent(data.data.output);
        setImprovements(data.data.improvements || []);
        setMetrics(data.data.metrics || {});
      } else {
        console.log(`${PRODUCT_ID}_error`);
        alert(data.error?.message || 'Failed to process content');
      }
    } catch (error) {
      console.log(`${PRODUCT_ID}_error`);
      console.error('Processing error:', error);
      alert('An error occurred while processing the content');
    } finally {
      setIsProcessing(false);
      loadUsage();
    }
  };

  const handleSaveSession = async () => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: inputContent.substring(0, 50) + (inputContent.length > 50 ? '...' : ''),
          tags: ['compliance'],
          input: inputContent,
          result: resultContent,
          metrics
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`${PRODUCT_ID}_session_saved`);
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultContent);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleExport = async (format: 'json' | 'md') => {
    console.log(`${PRODUCT_ID}_export_clicked`, { format });
    
    try {
      let content = '';
      let filename = '';
      let mimeType = '';
      
      if (format === 'json') {
        content = JSON.stringify({
          input: inputContent,
          result: resultContent,
          metrics,
          improvements
        }, null, 2);
        filename = `${PRODUCT_ID}-session.json`;
        mimeType = 'application/json';
      } else {
        content = `# Financial AI Compliance Session

## Original Content
${inputContent}

## Generated Content
${resultContent}

## Metrics
${strategy.metricsConfig.map(m => `- ${m.label}: ${metrics[m.key]?.toFixed(1) || 0}`).join('\n')}

## Features
${improvements.map(imp => `- ${imp}`).join('\n')}
`;
        filename = `${PRODUCT_ID}-session.md`;
        mimeType = 'text/markdown';
      }
      
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

  const handleSelectSession = (session: Session) => {
    setInputContent(session.input);
    setResultContent(session.result);
    setMetrics(session.metrics);
    setImprovements([]);
  };

  const handleCreateNew = () => {
    setInputContent('');
    setResultContent('');
    setMetrics({});
    setImprovements([]);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setInputContent(template.body);
    setVariables({});
  };

  const handleCreateTemplate = async (template: Omit<Template, 'id'>) => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });
      
      const data = await response.json();
      
      if (data.success) {
        loadTemplates();
      } else {
        alert(data.error?.message || 'Failed to create template');
      }
    } catch (error) {
      console.error('Create template error:', error);
      alert('An error occurred while creating the template');
    }
  };

  const handleUpdateTemplate = async (id: string, template: Partial<Template>) => {
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });
      
      const data = await response.json();
      
      if (data.success) {
        loadTemplates();
      } else {
        alert(data.error?.message || 'Failed to update template');
      }
    } catch (error) {
      console.error('Update template error:', error);
      alert('An error occurred while updating the template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/${PRODUCT_ID}/templates/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        loadTemplates();
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

  const handleUpgrade = () => {
    console.log('checkout_initiated');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleProcess();
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputContent, resultContent, metrics, improvements]);

  const metricsData = strategy.metricsConfig.map(config => ({
    label: config.label,
    value: metrics[config.key] || 0,
    color: config.color,
    format: config.format
  }));

  return (
    <ProductAccessControl
      productId={PRODUCT_ID}
      productName="Financial AI Compliance"
      requiredPlans={['FINANCIAL_AI_COMPLIANCE', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
      <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
        <div className="max-w-8xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Financial AI Compliance</h1>
                <p className="text-zinc-400">Financial Content Compliance Workspace</p>
              </div>
              <div className="flex items-center space-x-3">
                <DocsShortcut 
                  productName="Financial AI Compliance" 
                  docsLink="/products/financial-ai-compliance/docs" 
                />
                <HotkeysHelp 
                  productName="Financial AI Compliance"
                  hotkeys={strategy.hotkeys}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <UpgradeGate 
                remaining={usage.remaining} 
                limit={usage.limit} 
                onUpgrade={handleUpgrade}
                productName="Financial AI Compliance"
                productId={PRODUCT_ID}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SessionSidebar 
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onCreateNew={handleCreateNew}
                title={strategy.labels.save.replace('Save ', '')}
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <PromptEditor
                value={inputContent}
                onChange={setInputContent}
                onRun={handleProcess}
                variables={variables}
                onVariablesChange={setVariables}
                templateVariables={selectedTemplate?.variables || []}
                placeholder="Enter financial content to check compliance..."
                title={strategy.labels.editor}
                buttonLabel={strategy.labels.run}
                tokenCountFn={strategy.tokenCountFn}
              />
              
              <RunControls
                onRun={handleProcess}
                onSave={handleSaveSession}
                onCopy={handleCopy}
                onExport={handleExport}
                isRunning={isProcessing}
                runLabel={strategy.labels.run}
                saveLabel={strategy.labels.save}
                copyLabel={strategy.labels.copy}
              />
              
              {resultContent && (
                <>
                  <ResultPreview
                    original={inputContent}
                    result={resultContent}
                    improvements={improvements}
                    originalLabel={strategy.labels.original}
                    resultLabel={strategy.labels.result}
                    improvementsLabel={strategy.labels.improvements}
                  />
                  
                  <MetricsStrip metrics={metricsData} />
                </>
              )}
            </div>

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