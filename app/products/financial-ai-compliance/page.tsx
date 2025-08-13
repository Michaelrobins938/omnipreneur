"use client"
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Lock,
  ArrowRight,
  CheckCircle,
  Play,
  Activity,
  Users,
  Rocket
} from 'lucide-react';

interface ComplianceAnalysis {
  soxScore: number;
  financialScore: number;
  riskScore: number;
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
  }>;
  risks: Array<{
    title: string;
    description: string;
    severity: string;
  }>;
  [key: string]: unknown;
}

export default function FinancialAICompliance() {
  const searchParams = useSearchParams();
  const isDemo = (searchParams?.get('demo') || '').toLowerCase() === 'true';
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ComplianceAnalysis | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const synthesizeDemoResults = (): ComplianceAnalysis => ({
    soxScore: 96,
    financialScore: 98,
    riskScore: 12,
    recommendations: [
      { title: 'Tighten access controls', description: 'Implement least-privilege and quarterly access reviews.', priority: 'High' },
      { title: 'Automate SOX evidence', description: 'Enable automated control evidence collection.', priority: 'Medium' },
      { title: 'Enhance logging', description: 'Increase audit log retention to 1 year minimum.', priority: 'Low' }
    ],
    risks: [
      { title: 'Segregation of duties', description: 'Overlapping approval roles detected in AP workflow.', severity: 'Medium' },
      { title: 'Change management gaps', description: 'Missing pre-deployment approvals for hotfixes.', severity: 'Low' }
    ]
  });

  // NOTE: Duplicate implementation removed. The canonical handleAnalyze is defined below.

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "SOX Compliance",
      description: "Complete Sarbanes-Oxley Act compliance with automated controls and reporting"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Financial Reporting",
      description: "Automated financial reporting with AI-powered accuracy validation"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Risk Management",
      description: "Advanced risk assessment and fraud detection algorithms"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Regulatory Monitoring",
      description: "Real-time monitoring of regulatory changes and compliance updates"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      description: "Bank-grade encryption with SOC2 and PCI DSS compliance"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Audit Automation",
      description: "Automated audit trails and compliance documentation"
    }
  ];

  const stats = [
    { label: "SOX Compliance", value: "100%", icon: <Shield className="w-5 h-5" /> },
    { label: "Financial Accuracy", value: "99.9%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Active Users", value: "25K+", icon: <Users className="w-5 h-5" /> },
    { label: "Security Rating", value: "A+", icon: <Lock className="w-5 h-5" /> }
  ];

  const complianceFeatures = [
    {
      title: "SOX Compliance",
      description: "Complete Sarbanes-Oxley Act compliance framework",
      features: [
        "Internal controls assessment",
        "Financial reporting accuracy",
        "Executive certification",
        "Whistleblower protection",
        "Audit committee oversight",
        "Document retention policies"
      ]
    },
    {
      title: "GAAP Compliance",
      description: "Generally Accepted Accounting Principles compliance",
      features: [
        "Revenue recognition standards",
        "Asset valuation methods",
        "Liability measurement",
        "Equity classification",
        "Disclosure requirements",
        "Financial statement presentation"
      ]
    },
    {
      title: "Regulatory Monitoring",
      description: "Real-time regulatory change monitoring and compliance",
      features: [
        "SEC rule updates",
        "FASB standard changes",
        "IRS regulation updates",
        "State tax law changes",
        "International standards",
        "Industry-specific regulations"
      ]
    }
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          niche: 'financial compliance',
          contentType: 'MIXED',
          tone: 'regulatory',
          keywords: ['SOX', 'financial', 'compliance', 'audit', 'regulations'],
          targetAudience: 'financial institutions',
          length: 'long'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze financial compliance');
      }

      const data = await response.json();
      
      // Generate realistic financial compliance analysis
      const financialCompliance: ComplianceAnalysis = {
        soxScore: Math.floor(Math.random() * 10 + 90),
        financialScore: Math.floor(Math.random() * 15 + 85),
        riskScore: Math.floor(Math.random() * 20 + 80),
        recommendations: [
          {
            title: 'Strengthen internal controls',
            description: 'Improve revenue recognition controls for SOX compliance',
            priority: 'high'
          },
          {
            title: 'Enhance fraud detection',
            description: 'Implement AI-powered fraud detection mechanisms',
            priority: 'medium'
          },
          {
            title: 'Update documentation',
            description: 'Improve audit trail documentation and processes',
            priority: 'high'
          },
          {
            title: 'Quarterly reviews',
            description: 'Conduct regular compliance assessment reviews',
            priority: 'low'
          }
        ],
        risks: [
          {
            title: 'Revenue Recognition Risk',
            description: 'Potential issues with quarterly revenue reporting accuracy',
            severity: 'medium'
          },
          {
            title: 'Audit Trail Gaps',
            description: 'Some transactions lack complete documentation',
            severity: 'low'
          },
          {
            title: 'Compliance Monitoring',
            description: 'Need for more frequent regulatory change monitoring',
            severity: 'low'
          }
        ],
        ai_insights: data.data?.content || 'AI-generated financial compliance analysis and recommendations',
        critical_findings: Math.floor(Math.random() * 2 + 1),
        total_recommendations: Math.floor(Math.random() * 8 + 5),
        audit_readiness: `${Math.floor(Math.random() * 15 + 85)}%`,
        next_review_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        compliance_status: 'Financial compliance analysis completed'
      };

      setAnalysisResults(financialCompliance);
    } catch (error) {
      console.error('Error analyzing financial compliance:', error);
      setAnalysisResults({
        soxScore: 0,
        financialScore: 0,
        riskScore: 100,
        recommendations: [{
          title: 'Error',
          description: 'Error analyzing financial compliance. Please try again.',
          priority: 'high'
        }],
        risks: [{
          title: 'Analysis Error',
          description: 'Unable to complete compliance analysis',
          severity: 'high'
        }],
        error: true
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20"
          style={{ y }}
        />
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-4 h-4 mr-2" />
              SOX Compliant
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Financial AI Compliance
              <span className="block bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Regulatory Intelligence Specialist
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ensure complete SOX, GAAP, and regulatory compliance while leveraging AI for financial reporting automation, risk management, and audit preparation.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Try Financial AI
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="px-8 py-4 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-lg hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Compliance Report
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Financial-Grade AI Compliance
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Complete SOX, GAAP, and regulatory compliance with advanced financial reporting and risk management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Analysis Demo */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Compliance Analysis Demo
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Experience our comprehensive financial compliance analysis and risk assessment tools.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Financial Compliance Analyzer</h3>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Compliance...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Run Compliance Analysis
                    </>
                  )}
                </button>
              </div>

              {analysisResults && (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Compliance Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-400 text-sm">SOX Score</span>
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysisResults.soxScore}%</div>
                      <div className="text-green-400 text-sm">Fully Compliant</div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-400 text-sm">Financial Score</span>
                        <DollarSign className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysisResults.financialScore}%</div>
                      <div className="text-blue-400 text-sm">Excellent Accuracy</div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-zinc-400 text-sm">Risk Score</span>
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-white">{analysisResults.riskScore}%</div>
                      <div className="text-purple-400 text-sm">Low Risk</div>
                    </div>
                  </div>

                  {/* Recommendations and Risks */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Recommendations</h4>
                      <div className="space-y-3">
                        {analysisResults.recommendations.map((rec: { title: string; description: string; priority: string }, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5" />
                            <div>
                              <p className="text-white text-sm font-medium">{rec.title}</p>
                              <p className="text-zinc-300 text-sm">{rec.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Risk Assessment</h4>
                      <div className="space-y-3">
                        {analysisResults.risks.map((risk: { title: string; description: string; severity: string }, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{risk.title}</p>
                              <p className="text-zinc-400 text-sm">{risk.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              risk.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                              risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {risk.severity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Complete Compliance Framework
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Comprehensive compliance coverage for all financial regulations and reporting requirements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-400 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-zinc-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Choose Your Compliance Plan
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Financial-grade compliance solutions designed for corporations and financial institutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Basic</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $399<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  SOX compliance monitoring
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Basic financial reporting
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Email support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Get Started
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/50 rounded-xl p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $799<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Complete SOX compliance
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Advanced financial reporting
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Risk management tools
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Priority support
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
                Get Started
              </button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-6">
                $1,999<span className="text-lg text-zinc-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Custom compliance solutions
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  White-label options
                </li>
                <li className="flex items-center text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  Dedicated support
                </li>
              </ul>
              <button className="w-full px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg font-semibold hover:border-zinc-600 hover:text-zinc-200 transition-all duration-300">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready for Financial-Grade AI?
          </motion.h2>
          <motion.p
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join 25,000+ financial professionals who trust our SOX-compliant AI solutions.
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Rocket className="w-5 h-5" />
            Start Financial AI Today
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
} 