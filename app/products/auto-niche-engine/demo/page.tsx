"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, TrendingUp, Target, DollarSign, BarChart3, CheckCircle } from 'lucide-react';

export default function AutoNicheDemoPage() {
  const [keyword, setKeyword] = useState('productivity planner');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const processing = [
    'Collecting market signals and historical demand...',
    'Scoring competition and keyword difficulty...',
    'Forecasting revenue and profit potential...',
    'Finding related breakout trends and long-tails...',
    'Compiling competitors and pricing insights...'
  ];

  const runDemo = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setResult(null);
    setSteps([]);
    setProgress(0);
    for (let i = 0; i < processing.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 500 + i * 200));
      setSteps((prev) => [...prev, processing[i]]);
      setProgress(Math.round(((i + 1) / processing.length) * 100));
    }
    setResult({
      niche: keyword,
      profitScore: 91,
      competitionLevel: 'Medium',
      revenuePotential: '$12,400/month',
      marketSize: '420K searches/month',
      keywordDifficulty: 42,
      trends: [
        { keyword: `${keyword} template`, volume: '160K', trend: '+12%' },
        { keyword: `${keyword} printable`, volume: '110K', trend: '+8%' },
        { keyword: `${keyword} notion`, volume: '90K', trend: '+15%' }
      ],
      competitors: [
        { name: 'PlannerPro', rating: 4.4, reviews: 1450, price: '$12.99' },
        { name: 'FocusTrack', rating: 4.2, reviews: 980, price: '$9.99' },
        { name: 'ElitePlan', rating: 4.6, reviews: 2050, price: '$14.99' }
      ],
      recommendations: [
        'Target "template" and "printable" long-tails in listings',
        'Price at $11.99 with value-added bundles',
        'Differentiate with habit-tracking and weekly reviews',
        'Promote via Pinterest and TikTok for breakout traffic'
      ]
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <section className="container mx-auto px-6 pt-20 pb-8">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-white">
          Auto Niche Engine Demo
        </motion.h1>
        <p className="text-zinc-400 mt-2">Interactive niche discovery with processing steps, market metrics, competitors, and a clear action plan.</p>
      </section>

      <section className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Your Niche</h2>
            <div className="flex gap-3">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., productivity planner"
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100"
              />
              <button onClick={runDemo} disabled={loading || !keyword.trim()} className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" /> Analyze Demo
                  </>
                )}
              </button>
            </div>
            {steps.length > 0 && (
              <div className="mt-6 space-y-2">
                {steps.map((s, i) => (
                  <div key={i} className="text-sm text-zinc-300 flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-green-400" />
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
                {/* Progress summary */}
                <div>
                  <div className="flex items-center justify-between text-sm text-zinc-300 mb-2">
                    <span>Processing</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded">
                    <div className="h-2 rounded bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>Profit Score</span><DollarSign className="w-4 h-4 text-green-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.profitScore}</div>
                  </div>
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>Market Size</span><BarChart3 className="w-4 h-4 text-blue-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.marketSize}</div>
                  </div>
                  <div className="p-4 bg-zinc-800/40 border border-zinc-700 rounded-lg">
                    <div className="flex items-center justify-between text-sm text-zinc-300"><span>Revenue</span><TrendingUp className="w-4 h-4 text-purple-400" /></div>
                    <div className="text-2xl font-bold text-white">{result.revenuePotential}</div>
                  </div>
                </div>

                {/* Trends */}
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2 flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-purple-400" /> Rising Trends</div>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm">
                    {result.trends.map((t: any, i: number) => (
                      <div key={i} className="p-3 bg-black/30 rounded border border-zinc-700">
                        <div className="text-zinc-200 font-medium">{t.keyword}</div>
                        <div className="text-zinc-400">{t.volume} • {t.trend}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competitors */}
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2 flex items-center"><Target className="w-4 h-4 mr-2 text-green-400" /> Top Competitors</div>
                  <div className="space-y-2 text-sm">
                    {result.competitors.map((c: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-black/30 rounded border border-zinc-700">
                        <div>
                          <div className="text-zinc-200 font-medium">{c.name}</div>
                          <div className="text-zinc-400">{c.reviews} reviews • {c.rating}★</div>
                        </div>
                        <div className="text-zinc-200 font-semibold">{c.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <div className="flex items-center text-white font-semibold mb-2"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Action Plan</div>
                  <ul className="space-y-2">
                    {result.recommendations.map((r: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-300 flex items-start"><span className="mt-1 mr-2 h-1.5 w-1.5 rounded-full bg-green-400" />{r}</li>
                    ))}
                  </ul>
                  {/* Expanded listing suggestions and GTM */}
                  {result.optimizedTitle && (
                    <div className="mt-3 bg-black/30 border border-zinc-700 rounded-lg p-4">
                      <div className="font-semibold text-white mb-2">Listing Suggestions</div>
                      <div className="text-zinc-200 mb-1"><span className="text-zinc-400">Title:</span> {result.optimizedTitle}</div>
                      <div className="text-zinc-200 mb-1"><span className="text-zinc-400">Price:</span> {result.priceRecommendation}</div>
                      <div className="text-zinc-200"><span className="text-zinc-400">SEO Snippet:</span> {result.seoSnippet}</div>
                      {result.primaryKeywords && (
                        <div className="mt-2 text-sm text-zinc-300"><span className="text-zinc-400">Keywords:</span> {result.primaryKeywords.join(', ')}</div>
                      )}
                    </div>
                  )}
                  {result.audienceSegments && (
                    <div className="mt-3 text-sm text-zinc-300"><span className="text-zinc-400">Audience:</span> {result.audienceSegments.join(', ')}</div>
                  )}
                  {result.goToMarket && (
                    <div className="mt-3 text-sm text-zinc-300"><span className="text-zinc-400">Go-to-market:</span>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        {result.goToMarket.map((g: string, i: number) => (
                          <li key={i} className="text-zinc-300">{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-zinc-400 text-center py-12">Enter a keyword and run the demo to view results.</div>
            )}
          </motion.div>
        </div>

        <motion.div className="max-w-3xl mx-auto text-center mt-12" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold mb-3">Ready for the full Auto Niche Engine?</h2>
          <p className="text-zinc-400 mb-6">Unlock real-time market data, exports, and API access.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/products/auto-niche-engine#pricing" className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold">View Pricing</Link>
            <Link href="/auth/register" className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold text-zinc-300 hover:border-green-500 hover:text-green-400">Create Account</Link>
          </div>
          <div className="mt-2 text-xs text-green-300/80">Demo showcases capabilities — full data and features require a subscription.</div>
        </motion.div>
      </section>
    </div>
  );
}


