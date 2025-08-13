'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText,
  Settings,
  Shield,
  Zap,
  Database,
  Key,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  summary: string;
  tags: string[];
  authentication: 'required' | 'optional' | 'none';
  rateLimit?: {
    requests: number;
    window: string;
  };
  subscription?: 'free' | 'pro' | 'enterprise';
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: any;
  }>;
  requestBody?: {
    contentType: string;
    schema: any;
    example: any;
  };
  responses: Array<{
    status: number;
    description: string;
    schema?: any;
    example?: any;
  }>;
  examples: Array<{
    name: string;
    request: any;
    response: any;
  }>;
}

interface APISection {
  title: string;
  description: string;
  endpoints: APIEndpoint[];
}

// API Documentation data generated from frontend implementations
const apiDocumentation: APISection[] = [
  {
    title: 'Admin Management',
    description: 'Administrative endpoints for managing affiliate programs and platform operations',
    endpoints: [
      {
        path: '/api/affiliates/admin',
        method: 'GET',
        description: 'Retrieve all affiliate accounts with detailed statistics and status information',
        summary: 'Get affiliate accounts',
        tags: ['Admin', 'Affiliates'],
        authentication: 'required',
        subscription: 'free',
        rateLimit: { requests: 100, window: '1h' },
        parameters: [
          {
            name: 'page',
            type: 'number',
            required: false,
            description: 'Page number for pagination',
            example: 1
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: 'Number of items per page (max 100)',
            example: 20
          },
          {
            name: 'search',
            type: 'string',
            required: false,
            description: 'Search by name, email, or affiliate code',
            example: 'john@example.com'
          },
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Filter by affiliate status',
            example: 'APPROVED'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Successfully retrieved affiliate accounts',
            example: {
              success: true,
              data: {
                affiliates: [
                  {
                    id: 'aff_123',
                    affiliateCode: 'PARTNER_001',
                    status: 'APPROVED',
                    user: {
                      name: 'John Doe',
                      email: 'john@example.com'
                    },
                    stats: {
                      totalClicks: 1250,
                      conversions: 45,
                      totalEarnings: 2500.00
                    }
                  }
                ],
                pagination: {
                  page: 1,
                  limit: 20,
                  total: 150,
                  pages: 8
                }
              }
            }
          },
          {
            status: 401,
            description: 'Authentication required',
            example: {
              success: false,
              error: { message: 'Admin access required' }
            }
          }
        ],
        examples: [
          {
            name: 'Get pending affiliates',
            request: { method: 'GET', url: '/api/affiliates/admin?status=PENDING&limit=10' },
            response: { success: true, data: { affiliates: [], pagination: {} } }
          }
        ]
      },
      {
        path: '/api/affiliates/admin',
        method: 'POST',
        description: 'Perform administrative actions on affiliate accounts (approve, reject, suspend, activate)',
        summary: 'Manage affiliate accounts',
        tags: ['Admin', 'Affiliates'],
        authentication: 'required',
        subscription: 'free',
        requestBody: {
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['approve', 'reject', 'suspend', 'activate'] },
              affiliateId: { type: 'string' },
              reason: { type: 'string' },
              newCommissionRate: { type: 'number' }
            },
            required: ['action', 'affiliateId']
          },
          example: {
            action: 'approve',
            affiliateId: 'aff_123',
            newCommissionRate: 0.15
          }
        },
        responses: [
          {
            status: 200,
            description: 'Action completed successfully',
            example: {
              success: true,
              data: {
                affiliateId: 'aff_123',
                action: 'approve',
                status: 'APPROVED'
              }
            }
          }
        ],
        examples: [
          {
            name: 'Approve affiliate',
            request: {
              method: 'POST',
              body: { action: 'approve', affiliateId: 'aff_123' }
            },
            response: { success: true, data: { status: 'APPROVED' } }
          }
        ]
      }
    ]
  },
  {
    title: 'Analytics & Insights',
    description: 'Advanced analytics endpoints with AI-powered insights and performance metrics',
    endpoints: [
      {
        path: '/api/analytics/dashboard',
        method: 'GET',
        description: 'Get comprehensive dashboard analytics including usage, performance, and AI insights',
        summary: 'Dashboard analytics',
        tags: ['Analytics', 'Dashboard'],
        authentication: 'required',
        subscription: 'pro',
        parameters: [
          {
            name: 'withInsights',
            type: 'boolean',
            required: false,
            description: 'Include AI-powered insights',
            example: true
          },
          {
            name: 'timeRange',
            type: 'string',
            required: false,
            description: 'Time range for analytics',
            example: '30d'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Dashboard analytics retrieved successfully',
            example: {
              success: true,
              data: {
                totalUsers: 1250,
                revenue: 45000.00,
                insights: [
                  {
                    type: 'growth',
                    message: 'Revenue increased by 25% this month',
                    confidence: 0.92
                  }
                ]
              }
            }
          }
        ],
        examples: [
          {
            name: 'Get dashboard with insights',
            request: { method: 'GET', url: '/api/analytics/dashboard?withInsights=true' },
            response: { success: true, data: { totalUsers: 1250 } }
          }
        ]
      },
      {
        path: '/api/analytics/revenue',
        method: 'GET',
        description: 'Detailed revenue analytics and financial performance metrics',
        summary: 'Revenue analytics',
        tags: ['Analytics', 'Revenue'],
        authentication: 'required',
        subscription: 'pro',
        parameters: [
          {
            name: 'range',
            type: 'string',
            required: false,
            description: 'Time range (7d, 30d, 90d, 1y)',
            example: '30d'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Revenue data retrieved successfully'
          }
        ],
        examples: []
      }
    ]
  },
  {
    title: 'Lead Management',
    description: 'Lead capture, scoring, and nurturing with AI-powered recommendations',
    endpoints: [
      {
        path: '/api/leads/capture',
        method: 'POST',
        description: 'Capture new leads with automatic scoring and segmentation',
        summary: 'Capture new lead',
        tags: ['Leads', 'CRM'],
        authentication: 'required',
        subscription: 'pro',
        requestBody: {
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              company: { type: 'string' },
              source: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } }
            },
            required: ['name', 'email']
          },
          example: {
            name: 'Jane Smith',
            email: 'jane@company.com',
            company: 'Tech Corp',
            source: 'website',
            tags: ['enterprise', 'demo-request']
          }
        },
        responses: [
          {
            status: 201,
            description: 'Lead captured successfully',
            example: {
              success: true,
              data: {
                id: 'lead_456',
                name: 'Jane Smith',
                email: 'jane@company.com',
                score: 85,
                status: 'NEW'
              }
            }
          }
        ],
        examples: [
          {
            name: 'Capture enterprise lead',
            request: {
              method: 'POST',
              body: {
                name: 'Jane Smith',
                email: 'jane@company.com',
                company: 'Tech Corp',
                tags: ['enterprise']
              }
            },
            response: { success: true, data: { id: 'lead_456', score: 85 } }
          }
        ]
      }
    ]
  }
];

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-700 flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">{title}</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className={`language-${language} text-zinc-300`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

interface EndpointDocProps {
  endpoint: APIEndpoint;
}

function EndpointDoc({ endpoint }: EndpointDocProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      case 'PATCH': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubscriptionIcon = (subscription?: string) => {
    switch (subscription) {
      case 'pro': return <Zap className="w-3 h-3 text-yellow-500" />;
      case 'enterprise': return <Shield className="w-3 h-3 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getMethodColor(endpoint.method)}`}>
                {endpoint.method}
              </span>
              {endpoint.subscription && getSubscriptionIcon(endpoint.subscription)}
              {endpoint.authentication === 'required' && (
                <Key className="w-3 h-3 text-amber-500" />
              )}
            </div>
            <code className="text-blue-400 font-mono">{endpoint.path}</code>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-zinc-400">{endpoint.summary}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            )}
          </div>
        </div>
        
        <p className="text-zinc-300 mt-2">{endpoint.description}</p>
        
        <div className="flex items-center space-x-4 mt-3">
          {endpoint.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
              {tag}
            </span>
          ))}
          {endpoint.rateLimit && (
            <span className="text-xs text-zinc-500">
              Rate limit: {endpoint.rateLimit.requests}/{endpoint.rateLimit.window}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-zinc-800"
        >
          <div className="p-6 space-y-6">
            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Parameters</h4>
                <div className="space-y-2">
                  {endpoint.parameters.map((param) => (
                    <div key={param.name} className="flex items-start justify-between py-2 border-b border-zinc-800/50">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <code className="text-blue-400">{param.name}</code>
                          <span className="text-xs text-zinc-500">{param.type}</span>
                          {param.required && (
                            <span className="text-xs text-red-400">required</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{param.description}</p>
                      </div>
                      {param.example && (
                        <code className="text-green-400 text-sm ml-4">
                          {JSON.stringify(param.example)}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {endpoint.requestBody && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Request Body</h4>
                <CodeBlock
                  code={JSON.stringify(endpoint.requestBody.example, null, 2)}
                  language="json"
                  title={endpoint.requestBody.contentType}
                />
              </div>
            )}

            {/* Responses */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Responses</h4>
              <div className="space-y-4">
                {endpoint.responses.map((response) => (
                  <div key={response.status} className="border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        response.status < 300 ? 'bg-green-100 text-green-800' :
                        response.status < 400 ? 'bg-blue-100 text-blue-800' :
                        response.status < 500 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {response.status}
                      </span>
                      <span className="text-zinc-300">{response.description}</span>
                    </div>
                    {response.example && (
                      <CodeBlock
                        code={JSON.stringify(response.example, null, 2)}
                        language="json"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {endpoint.examples.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Examples</h4>
                <div className="space-y-4">
                  {endpoint.examples.map((example, index) => (
                    <div key={index} className="border border-zinc-800 rounded-lg p-4">
                      <h5 className="font-medium text-white mb-3">{example.name}</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-medium text-zinc-400 mb-2">Request</h6>
                          <CodeBlock
                            code={JSON.stringify(example.request, null, 2)}
                            language="json"
                          />
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-zinc-400 mb-2">Response</h6>
                          <CodeBlock
                            code={JSON.stringify(example.response, null, 2)}
                            language="json"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function APIDocsGenerator() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">API Documentation</h1>
              <p className="text-zinc-400">Complete reference for all Omnipreneur APIs</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-zinc-400">API Status: Operational</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-400">Version: 1.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-400">Auth: Bearer Token</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 p-1 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            {apiDocumentation.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(index)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === index
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {apiDocumentation[activeSection].title}
            </h2>
            <p className="text-zinc-400 mb-6">
              {apiDocumentation[activeSection].description}
            </p>
          </div>

          <div className="space-y-6">
            {apiDocumentation[activeSection].endpoints.map((endpoint, index) => (
              <EndpointDoc key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-zinc-400">Check out our guides and examples to get started quickly.</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-colors">
                <FileText className="w-4 h-4" />
                <span>View Guides</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Interactive Playground</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}