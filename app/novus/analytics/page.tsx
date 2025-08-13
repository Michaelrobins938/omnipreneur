// app/novus/analytics/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ProductAccessControl from '@/app/components/ProductAccessControl';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data for analytics
const mockUsageData = [
  { date: '2023-01-01', count: 12 },
  { date: '2023-01-02', count: 19 },
  { date: '2023-01-03', count: 15 },
  { date: '2023-01-04', count: 25 },
  { date: '2023-01-05', count: 18 },
  { date: '2023-01-06', count: 22 },
  { date: '2023-01-07', count: 28 },
];

const mockImprovementData = [
  { metric: 'Readability', value: 85 },
  { metric: 'Structure', value: 78 },
  { metric: 'Safety', value: 92 },
  { metric: 'Token Efficiency', value: 73 },
];

const mockSuccessRateData = [
  { date: '2023-01-01', rate: 95 },
  { date: '2023-01-02', rate: 92 },
  { date: '2023-01-03', rate: 97 },
  { date: '2023-01-04', rate: 89 },
  { date: '2023-01-05', rate: 94 },
  { date: '2023-01-06', rate: 96 },
  { date: '2023-01-07', rate: 93 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function NovusAnalytics() {
  const [usageData, setUsageData] = useState(mockUsageData);
  const [improvementData, setImprovementData] = useState(mockImprovementData);
  const [successRateData, setSuccessRateData] = useState(mockSuccessRateData);

  return (
    <ProductAccessControl
      productId="novus-protocol"
      productName="NOVUS Protocol"
      requiredPlans={['PRO', 'ENTERPRISE']} // Analytics only for Pro/Enterprise
      demoMode={true}
    >
      <div className="min-h-screen bg-zinc-950 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">NOVUS Analytics</h1>
            <p className="text-zinc-400">Performance metrics and insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Success Rate</h3>
              <div className="text-3xl font-bold text-green-400">94.2%</div>
              <p className="text-sm text-zinc-400 mt-1">Last 30 days</p>
            </div>
            
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Avg. Improvement</h3>
              <div className="text-3xl font-bold text-blue-400">+78%</div>
              <p className="text-sm text-zinc-400 mt-1">Across all metrics</p>
            </div>
            
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Total Runs</h3>
              <div className="text-3xl font-bold text-purple-400">1,247</div>
              <p className="text-sm text-zinc-400 mt-1">Last 30 days</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Usage Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#27272a', borderColor: '#3f3f46' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Success Rate Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" domain={[80, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#27272a', borderColor: '#3f3f46' }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Improvement by Metric</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={improvementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {improvementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#27272a', borderColor: '#3f3f46' }}
                      itemStyle={{ color: 'white' }}
                      formatter={(value) => [`${value}%`, 'Improvement']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-zinc-800/30 rounded-2xl p-6 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Top Performing Area</span>
                    <span className="font-medium text-green-400">Safety +92%</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Prompts consistently include ethical guidelines and bias prevention
                  </p>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Greatest Improvement</span>
                    <span className="font-medium text-blue-400">Structure +78%</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Better use of lists, sections, and clear organization
                  </p>
                </div>
                
                <div className="p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Opportunity Area</span>
                    <span className="font-medium text-yellow-400">Token Efficiency +73%</span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Some prompts could be more concise while maintaining quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProductAccessControl>
  );
}