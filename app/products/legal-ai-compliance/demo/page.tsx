"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Shield, CheckCircle, BarChart3, AlertTriangle, FileText } from 'lucide-react';

export default function LegalComplianceDemoPage() {
  const [input, setInput] = useState('Describe our current data retention and consent policies for EU users.');
  const [output, setOutput] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [stepIdx, setStepIdx] = useState(0);

  const processingSteps = [
    'Parsing policy context and scope...',
    'Mapping text to GDPR/CCPA articles...',
    'Evaluating consent, DSAR, and deletion coverage...',
    'Scoring risk per framework...',
    'Generating prioritized recommendations...'
  ];

  const runDemo = async () => {
    setLoading(true);
    setImprovements([]);
    setSteps([]);
    setStepIdx(0);
    setOutput('');
    setAnalysis(null);

    for (let i = 0; i < processingSteps.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500 + i * 200));
      setSteps((prev) => [...prev, processingSteps[i]]);
      setStepIdx(i + 1);
    }

    // Synthesize demo output
    const demo = {
      overall: '90%',
      gdpr: 92,
      ccpa: 88,
      risks: [
        { title: 'Consent granularity', severity: 'Medium' },
        { title: 'DSAR turnaround', severity: 'Low' }
      ],
      recommendations: [
        'Implement granular consent per processing purpose',
        'Automate DSAR intake and SLA monitoring',
        'Refine data deletion workflow for backups'
      ]
    };

    setOutput(
      'Compliance analysis complete. Overall status is Strong with targeted improvements recommended for consent handling and DSAR automation.'
    );
    setImprovements(demo.recommendations);
    setAnalysis(demo);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <section className="container mx-auto px-6 pt-20 pb-8">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white">
          Legal AI Compliance Demo
        </motion.h1>
        <p className="text-zinc-400 mt-2">Interactive demo showcasing compliance analysis quality comparable to NOVUS.</p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Your Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 p-3"
            />
            <button
              onClick={runDemo}
              disabled={loading}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" /> Run Compliance Demo
                </>
              )}
            </button>

            {steps.length > 0 && (
              <div className="mt-6 space-y-2">
                {steps.map((s, i) => (
                  <div key={i} className="text-sm text-zinc-300 flex items-center">
                    <div className={`mr-2 h-2 w-2 rounded-full ${i < stepIdx ? 'bg-green-400' : 'bg-zinc-600'}`} />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Results</h2>
            {output ? (
              <div className="space-y-4">
                <div className="p-4 bg-black/40 border border-zinc-800 rounded-lg text-zinc-200">{output}</div>
                {analysis && (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between text-sm text-zinc-300">
                        <span>Overall</span>
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysis.overall}</div>
                    </div>
                    <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between text-sm text-zinc-300">
                        <span>GDPR</span>
                        <Shield className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysis.gdpr}%</div>
                    </div>
                    <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                      <div className="flex items-center justify-between text-sm text-zinc-300">
                        <span>CCPA</span>
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysis.ccpa}%</div>
                    </div>
                  </div>
                )}

                {improvements.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center text-white font-semibold mb-2">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                      Priority Recommendations
                    </div>
                    <ul className="space-y-2">
                      {improvements.map((it, i) => (
                        <li key={i} className="text-sm text-zinc-300 flex items-start">
                          <span className="mt-1 mr-2 h-1.5 w-1.5 rounded-full bg-green-400" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-zinc-400 text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                Enter your policies and run the demo to see analysis here.
              </div>
            )}
          </motion.div>
        </div>

        <motion.div className="max-w-3xl mx-auto text-center mt-12" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-3">Ready for the full Legal Compliance suite?</h2>
          <p className="text-zinc-400 mb-6">Unlock advanced checks, full framework coverage, reporting, and APIs.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/products/legal-ai-compliance#pricing" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold">
              View Pricing
            </Link>
            <Link href="/auth/register" className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold text-zinc-300 hover:border-blue-500 hover:text-blue-400">
              Create Account
            </Link>
          </div>
          <div className="mt-2 text-xs text-green-300/80">Demo showcases capabilities — full, real-time analysis requires a subscription.</div>
        </motion.div>
      </section>
    </div>
  );
}



