"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Settings,
  Loader2,
  Code,
  Database,
  Zap,
  Globe,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';

interface ValidationTest {
  id: string;
  endpoint: string;
  method: string;
  description: string;
  requiresAuth: boolean;
  requiresAdmin: boolean;
  testData?: any;
  status?: 'pending' | 'running' | 'pass' | 'fail' | 'warning';
  result?: any;
}

interface ValidationSuite {
  id: string;
  name: string;
  description: string;
  tests: ValidationTest[];
}

export default function ValidationDashboard() {
  const [validationSuites] = useState<ValidationSuite[]>([
    {
      id: 'auth',
      name: 'Authentication APIs',
      description: 'Test authentication and authorization endpoints',
      tests: [
        {
          id: 'auth-1',
          endpoint: '/api/auth/login',
          method: 'POST',
          description: 'User login endpoint',
          requiresAuth: false,
          requiresAdmin: false,
          testData: { email: 'test@example.com', password: 'password' }
        },
        {
          id: 'auth-2',
          endpoint: '/api/auth/logout',
          method: 'POST',
          description: 'User logout endpoint',
          requiresAuth: true,
          requiresAdmin: false
        },
        {
          id: 'auth-3',
          endpoint: '/api/users/me',
          method: 'GET',
          description: 'Get current user',
          requiresAuth: true,
          requiresAdmin: false
        }
      ]
    },
    {
      id: 'admin',
      name: 'Admin APIs',
      description: 'Test admin-only endpoints',
      tests: [
        {
          id: 'admin-1',
          endpoint: '/api/admin/system',
          method: 'GET',
          description: 'System health check',
          requiresAuth: true,
          requiresAdmin: true
        },
        {
          id: 'admin-2',
          endpoint: '/api/admin/users',
          method: 'GET',
          description: 'List all users',
          requiresAuth: true,
          requiresAdmin: true
        },
        {
          id: 'admin-3',
          endpoint: '/api/admin/analytics',
          method: 'GET',
          description: 'Admin analytics',
          requiresAuth: true,
          requiresAdmin: true
        }
      ]
    },
    {
      id: 'products',
      name: 'Product APIs',
      description: 'Test product-specific endpoints',
      tests: [
        {
          id: 'product-1',
          endpoint: '/api/rewrite/process',
          method: 'POST',
          description: 'Auto Rewrite Engine',
          requiresAuth: true,
          requiresAdmin: false,
          testData: { 
            content: 'Test content to rewrite',
            style: 'professional',
            tone: 'conversational'
          }
        },
        {
          id: 'product-2',
          endpoint: '/api/seo/analyze',
          method: 'POST',
          description: 'SEO Optimizer',
          requiresAuth: true,
          requiresAdmin: false,
          testData: { 
            url: 'https://example.com',
            keywords: ['test', 'seo'],
            analysis_type: 'BASIC'
          }
        },
        {
          id: 'product-3',
          endpoint: '/api/leads/generate',
          method: 'POST',
          description: 'Lead Generation',
          requiresAuth: true,
          requiresAdmin: false,
          testData: { 
            industry: 'technology',
            targetAudience: 'businesses',
            quantity: 10
          }
        }
      ]
    },
    {
      id: 'dashboard',
      name: 'Dashboard APIs',
      description: 'Test dashboard and management endpoints',
      tests: [
        {
          id: 'dash-1',
          endpoint: '/api/keys',
          method: 'GET',
          description: 'List API keys',
          requiresAuth: true,
          requiresAdmin: false
        },
        {
          id: 'dash-2',
          endpoint: '/api/projects',
          method: 'GET',
          description: 'List projects',
          requiresAuth: true,
          requiresAdmin: false
        },
        {
          id: 'dash-3',
          endpoint: '/api/analytics/dashboard',
          method: 'GET',
          description: 'Dashboard analytics',
          requiresAuth: true,
          requiresAdmin: false
        }
      ]
    }
  ]);

  const [selectedSuite, setSelectedSuite] = useState<string>('auth');
  const [customTests, setCustomTests] = useState<ValidationTest[]>([]);
  const [newTest, setNewTest] = useState<Partial<ValidationTest>>({
    endpoint: '',
    method: 'GET',
    description: '',
    requiresAuth: false,
    requiresAdmin: false
  });
  const [showAddTest, setShowAddTest] = useState(false);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});

  const runValidation = async (suiteId: string, tests: ValidationTest[] = []) => {
    const testsToRun = tests.length > 0 ? tests : 
      suiteId === 'custom' ? customTests : 
      validationSuites.find(s => s.id === suiteId)?.tests || [];

    if (testsToRun.length === 0) return;

    const testIds = testsToRun.map(t => t.id);
    setRunningTests(prev => new Set([...prev, ...testIds]));

    try {
      const response = await fetch('/api/system/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          endpoints: testsToRun.map(test => ({
            path: test.endpoint,
            method: test.method,
            description: test.description,
            requiresAuth: test.requiresAuth,
            requiresAdmin: test.requiresAdmin,
            testData: test.testData
          })),
          options: {
            timeout: 30000,
            followRedirects: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setValidationResults(prev => ({
          ...prev,
          [suiteId]: data.data
        }));
      } else {
        throw new Error(data.error?.message || 'Validation failed');
      }

    } catch (error) {
      console.error('Validation error:', error);
      setValidationResults(prev => ({
        ...prev,
        [suiteId]: {
          results: testsToRun.map(test => ({
            endpoint: test.endpoint,
            status: 'fail',
            message: error instanceof Error ? error.message : 'Unknown error'
          })),
          summary: { total: testsToRun.length, passed: 0, failed: testsToRun.length, warnings: 0 }
        }
      }));
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        testIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
  };

  const runSingleTest = async (test: ValidationTest) => {
    await runValidation('single', [test]);
  };

  const addCustomTest = () => {
    if (newTest.endpoint && newTest.method && newTest.description) {
      const test: ValidationTest = {
        id: `custom-${Date.now()}`,
        endpoint: newTest.endpoint!,
        method: newTest.method!,
        description: newTest.description!,
        requiresAuth: newTest.requiresAuth || false,
        requiresAdmin: newTest.requiresAdmin || false,
        testData: newTest.testData
      };

      setCustomTests(prev => [...prev, test]);
      setNewTest({
        endpoint: '',
        method: 'GET',
        description: '',
        requiresAuth: false,
        requiresAdmin: false
      });
      setShowAddTest(false);
    }
  };

  const removeCustomTest = (id: string) => {
    setCustomTests(prev => prev.filter(t => t.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-500" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-orange-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getCurrentTests = () => {
    if (selectedSuite === 'custom') return customTests;
    return validationSuites.find(s => s.id === selectedSuite)?.tests || [];
  };

  const getCurrentSuite = () => {
    if (selectedSuite === 'custom') {
      return { name: 'Custom Tests', description: 'User-defined validation tests' };
    }
    return validationSuites.find(s => s.id === selectedSuite);
  };

  const currentResults = validationResults[selectedSuite];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-500" />
              API Validation Dashboard
            </h1>
            <p className="text-zinc-400 mt-2">
              Comprehensive API endpoint testing and validation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Test Suites */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Test Suites</h2>
              
              <div className="space-y-2">
                {validationSuites.map((suite) => (
                  <button
                    key={suite.id}
                    onClick={() => setSelectedSuite(suite.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSuite === suite.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="font-medium">{suite.name}</div>
                    <div className="text-sm text-zinc-400">
                      {suite.tests.length} tests
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => setSelectedSuite('custom')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSuite === 'custom'
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="font-medium">Custom Tests</div>
                  <div className="text-sm text-zinc-400">
                    {customTests.length} tests
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 rounded-lg p-6">
              {/* Suite Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{getCurrentSuite()?.name}</h2>
                  <p className="text-zinc-400">{getCurrentSuite()?.description}</p>
                </div>
                
                <div className="flex space-x-3">
                  {selectedSuite === 'custom' && (
                    <button
                      onClick={() => setShowAddTest(true)}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Test
                    </button>
                  )}
                  
                  <button
                    onClick={() => runValidation(selectedSuite)}
                    disabled={runningTests.size > 0 || getCurrentTests().length === 0}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                  >
                    {runningTests.size > 0 ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run Tests
                  </button>
                </div>
              </div>

              {/* Add Test Modal */}
              {showAddTest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Add Custom Test</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Endpoint</label>
                        <input
                          type="text"
                          value={newTest.endpoint || ''}
                          onChange={(e) => setNewTest(prev => ({ ...prev, endpoint: e.target.value }))}
                          placeholder="/api/example"
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Method</label>
                        <select
                          value={newTest.method || 'GET'}
                          onChange={(e) => setNewTest(prev => ({ ...prev, method: e.target.value }))}
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <input
                          type="text"
                          value={newTest.description || ''}
                          onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Test description"
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newTest.requiresAuth || false}
                            onChange={(e) => setNewTest(prev => ({ ...prev, requiresAuth: e.target.checked }))}
                            className="mr-2 rounded border-zinc-600 bg-zinc-700"
                          />
                          Requires Auth
                        </label>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newTest.requiresAdmin || false}
                            onChange={(e) => setNewTest(prev => ({ ...prev, requiresAdmin: e.target.checked }))}
                            className="mr-2 rounded border-zinc-600 bg-zinc-700"
                          />
                          Admin Only
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowAddTest(false)}
                        className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addCustomTest}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Add Test
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tests List */}
              <div className="space-y-3">
                {getCurrentTests().map((test) => {
                  const isRunning = runningTests.has(test.id);
                  const result = currentResults?.results?.find((r: any) => r.endpoint === test.endpoint);
                  
                  return (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {result ? getStatusIcon(result.status) : getStatusIcon('pending')}
                          <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getMethodColor(test.method)}`}>
                            {test.method}
                          </span>
                        </div>
                        
                        <div>
                          <div className="font-medium">{test.endpoint}</div>
                          <div className="text-sm text-zinc-400">{test.description}</div>
                          {result?.message && (
                            <div className="text-sm text-yellow-400 mt-1">{result.message}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {test.requiresAuth && (
                            <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                              Auth
                            </span>
                          )}
                          {test.requiresAdmin && (
                            <span className="px-2 py-1 text-xs bg-red-600 text-white rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => runSingleTest(test)}
                          disabled={isRunning}
                          className="p-2 hover:bg-zinc-700 rounded transition-colors"
                        >
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        
                        {selectedSuite === 'custom' && (
                          <button
                            onClick={() => removeCustomTest(test.id)}
                            className="p-2 hover:bg-zinc-700 text-red-500 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {getCurrentTests().length === 0 && (
                  <div className="text-center text-zinc-400 py-8">
                    No tests available. {selectedSuite === 'custom' && 'Click "Add Test" to create custom tests.'}
                  </div>
                )}
              </div>

              {/* Results Summary */}
              {currentResults && (
                <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Test Results Summary</h3>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Passed: {currentResults.summary?.passed || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Failed: {currentResults.summary?.failed || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Warnings: {currentResults.summary?.warnings || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                      <span>Total: {currentResults.summary?.total || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}