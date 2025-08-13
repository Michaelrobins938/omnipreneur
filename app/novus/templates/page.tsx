// app/novus/templates/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import { NovusTemplate } from '@/lib/novus/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Save, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function NovusTemplates() {
  const [templates, setTemplates] = useState<NovusTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateBody, setEditTemplateBody] = useState('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/novus/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName || !newTemplateBody) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('/api/novus/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateName,
          body: newTemplateBody
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setNewTemplateName('');
        setNewTemplateBody('');
        setShowCreateForm(false);
        
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

  const handleStartEdit = (template: NovusTemplate) => {
    setEditingTemplate(template.id);
    setEditTemplateName(template.name);
    setEditTemplateBody(template.body);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTemplateName || !editTemplateBody) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch(`/api/novus/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editTemplateName,
          body: editTemplateBody
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEditingTemplate(null);
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
      } else {
        alert(data.error?.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Delete template error:', error);
      alert('An error occurred while deleting the template');
    }
  };

  return (
    <ProductAccessControl
      productId="novus-protocol"
      productName="NOVUS Protocol"
      requiredPlans={['NOVUS_PROTOCOL', 'PRO', 'ENTERPRISE']}
      demoMode={true}
    >
      <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">NOVUS Templates</h1>
              <p className="text-zinc-400">Custom prompt templates for reuse</p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Template
            </Button>
          </div>

          {showCreateForm && (
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Create New Template</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Template Name
                  </label>
                  <Input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g., Blog Post Outline"
                    className="bg-zinc-900/50 border-zinc-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Template Body
                  </label>
                  <Textarea
                    value={newTemplateBody}
                    onChange={(e) => setNewTemplateBody(e.target.value)}
                    placeholder="Enter your template with {variables}..."
                    className="bg-zinc-900/50 border-zinc-700 text-white"
                    rows={6}
                  />
                  <p className="text-sm text-zinc-500 mt-2">
                    Use {'{'}variable_name{'}'} to create placeholders in your template
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setShowCreateForm(false)}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Create Template
                  </Button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-zinc-400">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700/50 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">No templates yet</h3>
                <p className="text-zinc-400 mb-6">
                  Create your first template to save time on repetitive prompts
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Create Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map(template => (
                <div 
                  key={template.id} 
                  className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-all"
                >
                  {editingTemplate === template.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <Input
                        type="text"
                        value={editTemplateName}
                        onChange={(e) => setEditTemplateName(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-700 text-white"
                      />
                      <Textarea
                        value={editTemplateBody}
                        onChange={(e) => setEditTemplateBody(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-700 text-white"
                        rows={4}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setEditingTemplate(null)}
                          variant="secondary"
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSaveEdit(template.id)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-white">
                          {template.name}
                        </h3>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleStartEdit(template)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteTemplate(template.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-zinc-400 mb-4 bg-zinc-900/50 p-3 rounded-lg">
                        {template.body}
                      </div>
                      
                      {template.variables.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-zinc-300 mb-2">Variables</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map(variable => (
                              <span
                                key={variable}
                                className="text-xs px-2 py-1 bg-zinc-700/50 rounded-full text-zinc-300"
                              >
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Link href={`/novus/workspace?template=${template.id}`}>
                          <Button variant="secondary" size="sm" className="flex items-center gap-1">
                            <span>Use Template</span>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProductAccessControl>
  );
}