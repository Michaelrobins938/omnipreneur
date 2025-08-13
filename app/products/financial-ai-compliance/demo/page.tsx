"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, DollarSign, TrendingUp, CheckCircle, Search } from 'lucide-react';

export default function FinancialComplianceDemoPage() {
  const [input, setInput] = useState('Analyze quarterly financial controls and reporting accuracy for SOX readiness.');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const processing = [
    'Gathering control inventory and mapping to SOX sections...',
    'Evaluating change management and access controls...',
    'Checking financial statement assertions...',
    'Running anomaly detection and risk scoring...',
    'Generating recommendations and remediation plan...'
  ];

  const runDemo = async () => {
    setLoading(true);
    setSteps([]);
    setResult(null);
    for (let i = 0; i < processing.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500 + i * 200));
      setSteps((prev) => [...prev, processing[i]]);
    }
    setResult({
      soxScore: 96,
      financialScore: 98,
      riskScore: 12,
      recommendations: [
        'Automate quarterly access reviews with evidence capture',
        'Enforce pre-deployment approvals for hotfixes',
        'Increase audit log retention to 12 months'
      ]
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <section className="container mx-auto px-6 pt-20 pb-8">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white">
          Financial Compliance Analyzer Demo
        </motion.h1>
        <p className="text-zinc-400 mt-2">Interactive demo aligned to NOVUS demo quality: processing steps, metrics, and recommendations.</p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Your Input</h2>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 p-3" />
            <button onClick={runDemo} disabled={loading} className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center justify-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Run Financial Demo
                </>
              )}
            </button>
            {steps.length > 0 && (
              <div className="mt-6 space-y-2">
                {steps.map((s, i) => (
                  <div key={i} className="text-sm text-zinc-300 flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Results</h2>
            {result ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>SOX</span><Shield className="w-4 h-4 text-green-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.soxScore}%</div>
                  </div>
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>Financial</span><DollarSign className="w-4 h-4 text-blue-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.financialScore}%</div>
                  </div>
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>Risk</span><TrendingUp className="w-4 h-4 text-purple-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.riskScore}%</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-white font-semibold mb-2"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Recommendations</div>
                  <ul className="space-y-2">
                    {result.recommendations.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-start"><span className="mt-1 mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-zinc-400 text-center py-12">Run the demo to view results.</div>
            )}
          </motion.div>
        </div>

        <motion.div className="max-w-3xl mx-auto text-center mt-12" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-3">Ready for the full Financial Compliance suite?</h2>
          <p className="text-zinc-400 mb-6">Unlock automated evidence, real-time monitoring, and API access.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/products/financial-ai-compliance#pricing" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-semibold">View Pricing</Link>
            <Link href="/auth/register" className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold text-zinc-300 hover:border-emerald-500 hover:text-emerald-400">Create Account</Link>
          </div>
          <div className="mt-2 text-xs text-emerald-300/80">Demo showcases capabilities — full, real-time analysis requires a subscription.</div>
        </motion.div>
      </section>
    </div>
  );
}



