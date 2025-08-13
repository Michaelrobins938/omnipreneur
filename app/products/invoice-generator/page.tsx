"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Target, 
  BarChart3,
  Receipt,
  Calendar,
  Sparkles,
  Download,
  CheckCircle,
  CreditCard,
  Settings,
  Users,
  Clock,
  Shield,
  Brain,
  Activity,
  PieChart,
  AlertTriangle,
  TrendingDown,
  Calculator,
  Percent,
  Timer
} from 'lucide-react';
import ProductPageTemplate from '../../components/ProductPageTemplate';

export default function InvoiceGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showOptimizationDashboard, setShowOptimizationDashboard] = useState(false);

  const handleOptimizeInvoice = async () => {
    setIsOptimizing(true);
    try {
      // Simulate API call to the enhanced invoice optimization endpoint
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock comprehensive AI optimization response
      const mockOptimization = {
        paymentPrediction: {
          probability: 0.78,
          estimatedCollectionDays: 25,
          confidence: 0.87
        },
        riskAssessment: {
          level: 'low',
          score: 23,
          factors: ['Good payment history', 'Stable company', 'Long-term relationship']
        },
        recommendations: [
          'Offer 2% early payment discount for payments within 10 days',
          'Send payment reminder 3 days before due date',
          'Include detailed breakdown to increase transparency'
        ],
        optimizationScore: 89,
        budgetOptimization: {
          projectedVariance: -0.05,
          suggestedAdjustments: ['Reduce payment terms from 30 to 21 days']
        },
        invoiceStructure: {
          subtotal: parseFloat(amount) || 5000,
          discounts: [{ type: 'early_payment', amount: 100, percentage: 2 }],
          total: (parseFloat(amount) || 5000) - 100
        }
      };
      
      setOptimizationData(mockOptimization);
      setShowOptimizationDashboard(true);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const templates = [
    { id: 'professional', name: 'Professional', icon: FileText },
    { id: 'modern', name: 'Modern', icon: Sparkles },
    { id: 'minimal', name: 'Minimal', icon: Target },
    { id: 'creative', name: 'Creative', icon: BarChart3 },
    { id: 'corporate', name: 'Corporate', icon: DollarSign },
    { id: 'freelance', name: 'Freelance', icon: Receipt }
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "AI Invoice Generation",
      description: "Intelligent invoice creation with automatic data extraction and smart formatting"
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Smart Templates",
      description: "Professional templates with customizable branding and automated calculations"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Payment Integration",
      description: "Seamless payment processing with multiple gateways and tracking"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Automated Billing",
      description: "Recurring invoices, payment reminders, and schedule management"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Financial Analytics",
      description: "Revenue tracking, financial insights, and performance metrics"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multi-Format Export",
      description: "PDF, Excel, cloud storage integration, and email automation"
    }
  ];

  const stats = [
    { label: "Invoices Generated", value: "500K+", icon: <FileText className="w-5 h-5" /> },
    { label: "Processing Speed", value: "3x Faster", icon: <Zap className="w-5 h-5" /> },
    { label: "Success Rate", value: "99.7%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Active Users", value: "75K+", icon: <Users className="w-5 h-5" /> }
  ];

  const pricingPlans = [
    {
      name: "Invoice Starter",
      price: "$15",
      features: [
        "Up to 50 invoices per month",
        "Basic templates",
        "PDF export",
        "Email support",
        "Standard analytics"
      ],
      popular: false
    },
    {
      name: "Invoice Professional",
      price: "$39",
      features: [
        "Up to 200 invoices per month",
        "Advanced templates",
        "Payment integration",
        "Priority support",
        "Custom branding",
        "Advanced analytics"
      ],
      popular: true,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Invoice Enterprise",
      price: "$99",
      features: [
        "Unlimited invoices",
        "Custom templates",
        "API access",
        "Dedicated support",
        "White-label solution",
        "Enterprise integrations"
      ],
      popular: false
    }
  ];

  const handleGenerateInvoice = async () => {
    if (!clientName.trim() || !amount.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate API call for invoice generation
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          template: selectedTemplate,
          clientName,
          amount: parseFloat(amount),
          description,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          includePaymentLink: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const data = await response.json();
      setInvoiceGenerated(data.data.invoiceUrl || 'Invoice generated successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      setInvoiceGenerated('Error generating invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setClientName('');
    setAmount('');
    setDescription('');
    setInvoiceGenerated('');
    setSelectedTemplate('professional');
  };

  const demoComponent = (
    <motion.div
      className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Generate Your Invoice</h3>
        <p className="text-zinc-400">Create professional invoices in seconds with AI-powered automation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Client Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Amount ($) *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 h-24 resize-none"
              placeholder="Describe your services or products"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4">
              <button
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <motion.div 
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generate Invoice</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="px-6 py-4 border-2 border-zinc-600 text-zinc-300 rounded-2xl font-semibold hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                Clear
              </button>
            </div>
            
            <button
              onClick={handleOptimizeInvoice}
              disabled={isOptimizing || !clientName || !amount}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>AI Payment Optimization</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview/Result */}
        <div className="bg-zinc-800/40 rounded-2xl p-6 border border-zinc-700/50">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-green-400" />
            <span>Invoice Preview</span>
          </h4>
          
          {invoiceGenerated ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm">{invoiceGenerated}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 py-2 px-4 rounded-xl text-sm hover:bg-green-500/30 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download PDF
                </button>
                <button className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 py-2 px-4 rounded-xl text-sm hover:bg-blue-500/30 transition-colors">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Send Invoice
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Fill in the details to generate your invoice</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const handleGetStarted = () => {
    // Redirect to signup or pricing
    window.location.href = '/auth/register';
  };

  const handleWatchDemo = () => {
    // Scroll to demo section
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const optimizationDashboard = showOptimizationDashboard && optimizationData && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-8"
    >
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
        AI Payment Optimization Results
      </h3>
      
      {/* Optimization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-6 h-6 text-green-400" />
            <span className="text-2xl font-bold text-green-400">
              {(optimizationData.paymentPrediction.probability * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-white font-semibold text-sm">Payment Probability</div>
          <div className="text-gray-400 text-xs">AI prediction confidence</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-6 h-6 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">
              {optimizationData.paymentPrediction.estimatedCollectionDays}
            </span>
          </div>
          <div className="text-white font-semibold text-sm">Collection Days</div>
          <div className="text-gray-400 text-xs">Expected timeline</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-yellow-400" />
            <span className={`text-2xl font-bold ${
              optimizationData.riskAssessment.level === 'low' ? 'text-green-400' :
              optimizationData.riskAssessment.level === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {optimizationData.riskAssessment.level.toUpperCase()}
            </span>
          </div>
          <div className="text-white font-semibold text-sm">Risk Level</div>
          <div className="text-gray-400 text-xs">Collection risk</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 text-purple-400" />
            <span className="text-2xl font-bold text-purple-400">
              {optimizationData.optimizationScore}
            </span>
          </div>
          <div className="text-white font-semibold text-sm">Optimization Score</div>
          <div className="text-gray-400 text-xs">AI efficiency rating</div>
        </motion.div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-green-400" />
            Invoice Structure Optimization
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white font-semibold">${optimizationData.invoiceStructure.subtotal.toLocaleString()}</span>
            </div>
            {optimizationData.invoiceStructure.discounts.map((discount: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">Early Payment Discount ({discount.percentage}%)</span>
                <span className="text-green-400 font-semibold">-${discount.amount}</span>
              </div>
            ))}
            <div className="border-t border-gray-600 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Optimized Total</span>
                <span className="text-purple-400 font-bold text-lg">${optimizationData.invoiceStructure.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-400" />
            AI Recommendations
          </h4>
          
          <div className="space-y-3">
            {optimizationData.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-blue-400 mr-2 mt-0.5" />
              <div>
                <div className="text-blue-400 font-semibold text-sm mb-1">Risk Factors</div>
                <div className="text-gray-300 text-xs">
                  {optimizationData.riskAssessment.factors.join(' • ')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <ProductPageTemplate
      title="Invoice Generator"
      subtitle="AI-Powered Professional Invoicing"
      description="Create stunning, professional invoices in seconds with AI-powered automation. Streamline your billing process and get paid faster than ever before."
      heroIcon={<FileText className="w-12 h-12" />}
      heroGradient="from-green-500 to-emerald-500"
      features={features}
      stats={stats}
      pricingPlans={pricingPlans}
      demoComponent={
        <div>
          {demoComponent}
          {optimizationDashboard}
        </div>
      }
      onGetStarted={handleGetStarted}
      onWatchDemo={handleWatchDemo}
      primaryColor="green"
      accentColor="emerald"
    />
  );
}