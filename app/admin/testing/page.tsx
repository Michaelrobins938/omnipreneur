"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Loader2,
  RefreshCw,
  Database,
  Zap,
  Globe,
  Shield,
  Terminal,
  FileCheck,
  BarChart3
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'running' | 'pending';
  duration?: number;
  message?: string;
  details?: any;
  timestamp?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  tests: TestResult[];
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export default function TestingDashboard() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'integration',
      name: 'Integration Tests',
      description: 'Comprehensive system integration testing',
      icon: Globe,
      tests: [],
      status: 'idle'
    },
    {
      id: 'database',
      name: 'Database Tests',
      description: 'Database connectivity and performance',
      icon: Database,
      tests: [],
      status: 'idle'
    },
    {
      id: 'ai-services',
      name: 'AI Services',
      description: 'OpenAI and Claude API testing',
      icon: Zap,
      tests: [],
      status: 'idle'
    },
    {
      id: 'api-validation',
      name: 'API Validation',
      description: 'Endpoint validation and security',
      icon: Shield,
      tests: [],
      status: 'idle'
    },
    {
      id: 'websocket',
      name: 'WebSocket Tests',
      description: 'Real-time connection testing',
      icon: Terminal,
      tests: [],
      status: 'idle'
    },
    {
      id: 'performance',
      name: 'Performance Tests',
      description: 'System performance benchmarks',
      icon: BarChart3,
      tests: [],
      status: 'idle'
    }
  ]);

  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testHistory, setTestHistory] = useState<any[]>([]);

  const runTestSuite = async (suiteId: string) => {
    setRunningTests(prev => new Set(prev).add(suiteId));
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId ? { ...suite, status: 'running', tests: [] } : suite
    ));

    try {
      let endpoint = '';
      let params = new URLSearchParams();

      switch (suiteId) {
        case 'integration':
          endpoint = '/api/test/integration';
          params.append('category', 'all');
          break;
        case 'database':
          endpoint = '/api/test/integration';
          params.append('category', 'database');
          break;
        case 'ai-services':
          endpoint = '/api/test/integration';
          params.append('category', 'ai');
          params.append('quick', 'false');
          break;
        case 'api-validation':
          endpoint = '/api/system/validate';
          params.append('scope', 'apis');
          params.append('details', 'true');
          break;
        case 'websocket':
          endpoint = '/api/test/integration';
          params.append('category', 'websocket');
          break;
        case 'performance':
          endpoint = '/api/system/performance';
          break;
        default:
          throw new Error('Unknown test suite');
      }

      const response = await fetch(`${endpoint}?${params}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Test failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const processedTests = processTestResults(data.data, suiteId);
        
        setTestSuites(prev => prev.map(suite => 
          suite.id === suiteId 
            ? { 
                ...suite, 
                status: 'completed', 
                tests: processedTests 
              } 
            : suite
        ));

        // Add to history
        setTestHistory(prev => [{
          id: Date.now().toString(),
          suiteId,
          timestamp: new Date().toISOString(),
          results: data.data,
          summary: calculateSummary(processedTests)
        }, ...prev.slice(0, 9)]); // Keep last 10 runs

      } else {
        throw new Error(data.error?.message || 'Test execution failed');
      }

    } catch (error) {
      console.error('Test execution error:', error);
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              status: 'failed',
              tests: [{
                id: 'error',
                name: 'Test Execution Error',
                status: 'fail',
                message: error instanceof Error ? error.message : 'Unknown error'
              }]
            } 
          : suite
      ));
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }
  };

  const processTestResults = (data: any, suiteId: string): TestResult[] => {
    const tests: TestResult[] = [];

    if (data.tests) {
      Object.entries(data.tests).forEach(([category, categoryTests]: [string, any]) => {
        if (typeof categoryTests === 'object' && categoryTests !== null) {
          Object.entries(categoryTests).forEach(([testName, result]: [string, any]) => {
            tests.push({
              id: `${category}-${testName}`,
              name: `${category}: ${testName}`,
              status: result.status === 'success' ? 'pass' : 
                     result.status === 'error' ? 'fail' : 'warning',
              duration: result.duration,
              message: result.message || result.error,
              details: result.details,
              timestamp: result.timestamp
            });
          });
        }
      });
    }

    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result: any, index: number) => {
        tests.push({
          id: `result-${index}`,
          name: result.endpoint || result.name || `Test ${index + 1}`,
          status: result.status === 'pass' ? 'pass' : 
                 result.status === 'fail' ? 'fail' : 'warning',
          message: result.message,
          details: result
        });
      });
    }

    return tests;
  };

  const calculateSummary = (tests: TestResult[]) => {
    return {
      total: tests.length,
      passed: tests.filter(t => t.status === 'pass').length,
      failed: tests.filter(t => t.status === 'fail').length,
      warnings: tests.filter(t => t.status === 'warning').length
    };
  };

  const runAllTests = async () => {
    for (const suite of testSuites) {
      if (!runningTests.has(suite.id)) {
        await runTestSuite(suite.id);
        // Small delay between test suites
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': case 'completed': return 'border-green-500 bg-green-500/10';
      case 'fail': case 'failed': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'running': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-600 bg-gray-600/10';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <FileCheck className="w-8 h-8 mr-3 text-blue-500" />
              System Testing Dashboard
            </h1>
            <p className="text-zinc-400 mt-2">
              Comprehensive testing suite for all system components
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={runAllTests}
              disabled={runningTests.size > 0}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
            >
              {runningTests.size > 0 ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Run All Tests
            </button>
          </div>
        </div>

        {/* Test Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {testSuites.map((suite) => {
            const IconComponent = suite.icon;
            const isRunning = runningTests.has(suite.id);
            const summary = calculateSummary(suite.tests);

            return (
              <motion.div
                key={suite.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${getStatusColor(suite.status)} ${
                  selectedSuite === suite.id ? 'ring-2 ring-blue-500' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSuite(selectedSuite === suite.id ? null : suite.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <IconComponent className="w-6 h-6 mr-3 text-blue-500" />
                    <h3 className="text-lg font-semibold">{suite.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(suite.status)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        runTestSuite(suite.id);
                      }}
                      disabled={isRunning}
                      className="p-1 hover:bg-zinc-700 rounded"
                    >
                      {isRunning ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <p className="text-zinc-400 text-sm mb-4">{suite.description}</p>
                
                {suite.tests.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">
                      {summary.total} tests
                    </span>
                    <div className="flex space-x-3">
                      {summary.passed > 0 && (
                        <span className="text-green-500">✓ {summary.passed}</span>
                      )}
                      {summary.failed > 0 && (
                        <span className="text-red-500">✗ {summary.failed}</span>
                      )}
                      {summary.warnings > 0 && (
                        <span className="text-yellow-500">⚠ {summary.warnings}</span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Test Details */}
        {selectedSuite && (
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {testSuites.find(s => s.id === selectedSuite)?.name} Results
              </h2>
              <button
                onClick={() => setSelectedSuite(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {testSuites.find(s => s.id === selectedSuite)?.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg"
                >
                  <div className="flex items-center">
                    {getStatusIcon(test.status)}
                    <div className="ml-3">
                      <h4 className="font-medium">{test.name}</h4>
                      {test.message && (
                        <p className="text-sm text-zinc-400 mt-1">{test.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-zinc-400">
                    {test.duration && <div>{test.duration}ms</div>}
                    {test.timestamp && (
                      <div>{new Date(test.timestamp).toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center text-zinc-400 py-8">
                  No test results yet. Click "Run All Tests" or the refresh button on a test suite.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="mt-8 bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Test Runs</h2>
            <div className="space-y-2">
              {testHistory.slice(0, 5).map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between p-3 bg-zinc-800 rounded"
                >
                  <div>
                    <span className="font-medium">
                      {testSuites.find(s => s.id === run.suiteId)?.name}
                    </span>
                    <span className="text-zinc-400 ml-2">
                      {new Date(run.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-green-500">✓ {run.summary.passed}</span>
                    <span className="text-red-500">✗ {run.summary.failed}</span>
                    {run.summary.warnings > 0 && (
                      <span className="text-yellow-500">⚠ {run.summary.warnings}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}