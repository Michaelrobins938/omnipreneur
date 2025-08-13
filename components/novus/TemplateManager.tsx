// components/novus/TemplateManager.tsx
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { 
  Plus, 
  Edit, 
  Save, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { NovusTemplate } from '../../lib/novus/types';

interface TemplateManagerProps {
  templates: NovusTemplate[];
  onSelectTemplate: (template: NovusTemplate) => void;
  onCreateTemplate: (template: Omit<NovusTemplate, 'id'>) => void;
  onUpdateTemplate: (id: string, template: Partial<NovusTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function TemplateManager({
  templates,
  onSelectTemplate,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate
}: TemplateManagerProps) {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateBody, setNewTemplateBody] = useState('');
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateBody, setEditTemplateBody] = useState('');

  const handleCreateTemplate = () => {
    if (newTemplateName && newTemplateBody) {
      onCreateTemplate({
        name: newTemplateName,
        variables: [],
        body: newTemplateBody
      });
      setNewTemplateName('');
      setNewTemplateBody('');
    }
  };

  const handleStartEdit = (template: NovusTemplate) => {
    setEditingTemplate(template.id);
    setEditTemplateName(template.name);
    setEditTemplateBody(template.body);
  };

  const handleSaveEdit = (id: string) => {
    if (editTemplateName && editTemplateBody) {
      onUpdateTemplate(id, {
        name: editTemplateName,
        body: editTemplateBody
      });
      setEditingTemplate(null);
    }
  };

  const extractVariables = (body: string): string[] => {
    const variableRegex = /\{([^}]+)\}/g;
    return Array.from(new Set(
      Array.from(body.matchAll(variableRegex)).map(match => match[0])
    ));
  };

  return (
    <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Templates</h2>
        <Button
          onClick={() => setExpandedTemplate(expandedTemplate === 'new' ? null : 'new')}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          New
        </Button>
      </div>

      {/* New Template Form */}
      {expandedTemplate === 'new' && (
        <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
          <h3 className="font-medium text-white mb-3">Create New Template</h3>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
            <Textarea
              placeholder="Template body with {variables}"
              value={newTemplateBody}
              onChange={(e) => setNewTemplateBody(e.target.value)}
              className="bg-zinc-800/50 border-zinc-700 text-white"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setExpandedTemplate(null)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>No templates found</p>
            <p className="text-sm mt-2">Create your first template to get started</p>
          </div>
        ) : (
          templates.map(template => (
            <div
              key={template.id}
              className="p-4 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 hover:bg-zinc-700/30 transition-all"
            >
              {editingTemplate === template.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={editTemplateName}
                    onChange={(e) => setEditTemplateName(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 text-white"
                  />
                  <Textarea
                    value={editTemplateBody}
                    onChange={(e) => setEditTemplateBody(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700 text-white"
                    rows={3}
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
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-medium text-white cursor-pointer flex-1"
                      onClick={() => onSelectTemplate(template)}
                    >
                      {template.name}
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleStartEdit(template)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteTemplate(template.id)}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="mt-2 text-sm text-zinc-400 cursor-pointer"
                    onClick={() => onSelectTemplate(template)}
                  >
                    {template.body.substring(0, 100)}
                    {template.body.length > 100 ? '...' : ''}
                  </div>
                  
                  {template.variables.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.variables.map(variable => (
                        <span
                          key={variable}
                          className="text-xs px-2 py-1 bg-zinc-700/50 rounded-full text-zinc-300"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}