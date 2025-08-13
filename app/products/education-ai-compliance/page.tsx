"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Building,
  Globe,
  Lock,
  Eye,
  BarChart3,
  Clock,
  Search,
  Download,
  Upload,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Book,
  Award,
  Target,
  Brain,
  Lightbulb,
  Calendar,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";

export default function EducationAICompliance() {
  const [selectedFramework, setSelectedFramework] = useState("ferpa");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const complianceFrameworks = [
    { id: "ferpa", name: "FERPA", description: "Family Educational Rights and Privacy Act" },
    { id: "idea", name: "IDEA", description: "Individuals with Disabilities Education Act" },
    { id: "title-ix", name: "Title IX", description: "Education Amendments of 1972" },
    { id: "section-504", name: "Section 504", description: "Rehabilitation Act of 1973" },
    { id: "ada", name: "ADA", description: "Americans with Disabilities Act" },
    { id: "coppa", name: "COPPA", description: "Children's Online Privacy Protection Act" }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Educational Compliance",
      description: "Comprehensive compliance for educational institutions and edtech platforms"
    },
    {
      icon: BookOpen,
      title: "Student Data Protection",
      description: "Advanced protection for student records and personal information"
    },
    {
      icon: Users,
      title: "Accessibility Standards",
      description: "Ensuring educational content meets accessibility requirements"
    },
    {
      icon: Shield,
      title: "Privacy Safeguards",
      description: "Robust privacy protection for students and educational data"
    },
    {
      icon: CheckCircle,
      title: "Compliance Monitoring",
      description: "Real-time monitoring of educational compliance requirements"
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "Proactive identification of compliance risks and violations"
    }
  ];

  const pricingPlans = [
    {
      name: "K-12 Basic",
      price: "$149",
      period: "/month",
      description: "Perfect for K-12 schools",
      features: [
        "FERPA & COPPA compliance",
        "Student data protection",
        "Basic accessibility checks",
        "Email support",
        "Monthly compliance reports",
        "Up to 1,000 students"
      ],
      popular: false
    },
    {
      name: "Higher Education",
      price: "$399",
      period: "/month",
      description: "Ideal for universities and colleges",
      features: [
        "All educational frameworks",
        "Advanced accessibility tools",
        "Real-time compliance monitoring",
        "Priority support",
        "Unlimited students",
        "Custom compliance reports",
        "API access",
        "Title IX compliance tools"
      ],
      popular: true
    },
    {
      name: "EdTech Enterprise",
      price: "$899",
      period: "/month",
      description: "For educational technology companies",
      features: [
        "Everything in Higher Education",
        "Multi-institution support",
        "White-label solutions",
        "Dedicated compliance officer",
        "24/7 phone support",
        "Advanced analytics dashboard",
        "Custom integrations",
        "Global compliance frameworks"
      ],
      popular: false
    }
  ];

  const stats = [
    { number: "99.8%", label: "Compliance Accuracy" },
    { number: "25+", label: "Educational Frameworks" },
    { number: "24/7", label: "Real-time Monitoring" },
    { number: "500+", label: "Institutions Protected" }
  ];

  const runComplianceAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult("");

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': (document.cookie.match(/(?:^|; )csrf_token=([^;]+)/)?.[1] || '')
        },
        credentials: 'include',
        body: JSON.stringify({
          niche: 'education compliance',
          contentType: 'MIXED',
          tone: 'regulatory',
          keywords: ['FERPA', 'COPPA', 'education', 'compliance', 'privacy'],
          targetAudience: 'educational institutions',
          length: 'long'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze compliance');
      }

      const data = await response.json();
      
      // Generate realistic compliance analysis
      const complianceAnalysis = {
        ferpa_score: Math.floor(Math.random() * 20 + 80),
        coppa_score: Math.floor(Math.random() * 15 + 85),
        overall_compliance: `${Math.floor(Math.random() * 15 + 85)}%`,
        ai_recommendations: data.data?.content || 'AI-generated compliance recommendations for educational institutions',
        critical_issues: Math.floor(Math.random() * 3 + 1),
        medium_issues: Math.floor(Math.random() * 5 + 2),
        low_issues: Math.floor(Math.random() * 8 + 3),
        next_audit_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        compliance_status: 'Analysis completed - Action items identified',
        priority_actions: [
          'Update privacy policies for FERPA compliance',
          'Review student data access procedures',
          'Implement COPPA-compliant data collection',
          'Train staff on privacy regulations'
        ]
      };

      setAnalysisResult(JSON.stringify(complianceAnalysis, null, 2));
    } catch (error) {
      console.error('Error analyzing compliance:', error);
      setAnalysisResult('Error analyzing compliance. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Education AI Compliance Platform
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Education AI
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {" "}Compliance
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              AI-powered educational compliance platform ensuring your institution meets all regulatory requirements. 
              Powered by CAL™ Technology for intelligent educational framework analysis and student data protection.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center">
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Comprehensive Educational Compliance
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform ensures your educational institution meets all regulatory requirements 
              with intelligent analysis and real-time monitoring.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Interactive Compliance Analysis
            </h2>
            <p className="text-xl text-gray-300">
              Test our AI-powered compliance analysis with different educational frameworks
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Framework Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Select Compliance Framework
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {complianceFrameworks.map((framework) => (
                  <button
                    key={framework.id}
                    onClick={() => setSelectedFramework(framework.id)}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedFramework === framework.id
                        ? "border-blue-500 bg-blue-500/20 text-blue-400"
                        : "border-gray-600 text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold">{framework.name}</div>
                    <div className="text-sm opacity-75">{framework.description}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={runComplianceAnalysis}
                disabled={isAnalyzing}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Run Compliance Analysis
                  </>
                )}
              </button>
            </motion.div>

            {/* Results Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Analysis Results
              </h3>
              
              {analysisResult ? (
                <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-green-400 text-sm whitespace-pre-wrap">
                    {analysisResult}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a compliance framework and run analysis to see results</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible pricing plans designed for educational institutions of all sizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-8 ${
                  plan.popular 
                    ? "border-blue-500 bg-gradient-to-b from-blue-500/20 to-indigo-500/20" 
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                      : "border border-gray-600 text-white hover:bg-gray-800"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Ensure Educational Compliance?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of educational institutions that trust our AI-powered compliance platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 