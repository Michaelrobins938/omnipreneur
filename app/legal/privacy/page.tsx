'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Share2,
  Globe,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Information You Provide",
          items: [
            "Account registration information (name, email, password)",
            "Profile information (bio, company, website, location)",
            "Payment information (processed securely through Stripe)",
            "Content you create, upload, or generate using our services",
            "Communications with our support team",
            "Feedback, reviews, and survey responses"
          ]
        },
        {
          subtitle: "Information We Collect Automatically",
          items: [
            "Usage data (pages visited, features used, time spent)",
            "Device information (browser type, operating system, IP address)",
            "Performance data (load times, error logs, crash reports)",
            "Analytics data (user interactions, conversion metrics)",
            "Cookies and similar tracking technologies"
          ]
        },
        {
          subtitle: "Information from Third Parties",
          items: [
            "OAuth authentication data (Google, GitHub, etc.)",
            "Payment processing information from Stripe",
            "Analytics data from integrated services",
            "Affiliate referral information"
          ]
        }
      ]
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        {
          subtitle: "Service Provision",
          items: [
            "Provide and maintain our AI-powered content generation services",
            "Process payments and manage subscriptions",
            "Authenticate your identity and secure your account",
            "Deliver customer support and respond to inquiries",
            "Send service-related notifications and updates"
          ]
        },
        {
          subtitle: "Service Improvement",
          items: [
            "Analyze usage patterns to improve our algorithms",
            "Develop new features and enhance existing functionality",
            "Conduct research and development for AI improvements",
            "Optimize performance and user experience",
            "Train our AI models (with anonymized data only)"
          ]
        },
        {
          subtitle: "Communication",
          items: [
            "Send important service announcements",
            "Provide educational content and best practices",
            "Share product updates and new features",
            "Deliver marketing communications (with your consent)",
            "Conduct user research and feedback collection"
          ]
        },
        {
          subtitle: "Legal and Security",
          items: [
            "Comply with legal obligations and regulations",
            "Protect against fraud, abuse, and security threats",
            "Enforce our Terms of Service and policies",
            "Resolve disputes and investigate violations",
            "Maintain data security and system integrity"
          ]
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: Share2,
      content: [
        {
          subtitle: "We Do Not Sell Your Personal Information",
          items: [
            "We never sell, rent, or trade your personal information to third parties",
            "Your content and generated materials remain confidential",
            "We do not share your data for advertising purposes"
          ]
        },
        {
          subtitle: "Service Providers",
          items: [
            "Payment processing (Stripe) - for transaction processing only",
            "Cloud hosting (AWS/Vercel) - for service infrastructure",
            "Analytics services - for anonymized usage statistics",
            "Email services - for transactional communications",
            "Customer support tools - for assistance and troubleshooting"
          ]
        },
        {
          subtitle: "Legal Requirements",
          items: [
            "Response to legal process (subpoenas, court orders)",
            "Compliance with law enforcement requests",
            "Protection of our rights and property",
            "Emergency situations involving safety",
            "Regulatory compliance (GDPR, CCPA, etc.)"
          ]
        },
        {
          subtitle: "Business Transfers",
          items: [
            "Merger, acquisition, or sale of assets",
            "Bankruptcy or reorganization proceedings",
            "Due diligence processes (with strict confidentiality)"
          ]
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security and Protection",
      icon: Lock,
      content: [
        {
          subtitle: "Technical Safeguards",
          items: [
            "End-to-end encryption for sensitive data",
            "Secure HTTPS connections for all communications",
            "Advanced authentication and access controls",
            "Regular security audits and penetration testing",
            "Automated backup and disaster recovery systems"
          ]
        },
        {
          subtitle: "Organizational Measures",
          items: [
            "Strict employee access controls and training",
            "Regular security awareness programs",
            "Incident response and breach notification procedures",
            "Third-party security assessments",
            "Compliance with industry security standards"
          ]
        },
        {
          subtitle: "Data Retention",
          items: [
            "Account data: Retained while your account is active",
            "Generated content: Stored according to your preferences",
            "Usage analytics: Anonymized and retained for 2 years",
            "Payment records: Retained for 7 years for tax compliance",
            "Support communications: Retained for 3 years"
          ]
        }
      ]
    },
    {
      id: "your-rights",
      title: "Your Privacy Rights",
      icon: Shield,
      content: [
        {
          subtitle: "Access and Control",
          items: [
            "Access your personal information and account data",
            "Update or correct inaccurate information",
            "Download your data in a portable format",
            "Delete your account and associated data",
            "Opt-out of marketing communications"
          ]
        },
        {
          subtitle: "GDPR Rights (EU Residents)",
          items: [
            "Right to erasure ('right to be forgotten')",
            "Right to data portability",
            "Right to restrict processing",
            "Right to object to processing",
            "Right to lodge a complaint with supervisory authorities"
          ]
        },
        {
          subtitle: "CCPA Rights (California Residents)",
          items: [
            "Know what personal information is collected",
            "Delete personal information held by us",
            "Opt-out of the sale of personal information",
            "Non-discrimination for exercising privacy rights"
          ]
        }
      ]
    },
    {
      id: "cookies-tracking",
      title: "Cookies and Tracking Technologies",
      icon: Globe,
      content: [
        {
          subtitle: "Essential Cookies",
          items: [
            "Authentication and session management",
            "Security and fraud prevention",
            "Core functionality and preferences",
            "Load balancing and performance"
          ]
        },
        {
          subtitle: "Analytics Cookies",
          items: [
            "Usage statistics and performance metrics",
            "Feature adoption and user behavior",
            "Error tracking and debugging",
            "A/B testing and optimization"
          ]
        },
        {
          subtitle: "Cookie Control",
          items: [
            "Manage cookie preferences in your browser",
            "Opt-out of non-essential cookies",
            "Clear cookies and reset preferences",
            "Review our Cookie Policy for details"
          ]
        }
      ]
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: Globe,
      content: [
        {
          subtitle: "Data Processing Locations",
          items: [
            "Primary servers located in the United States",
            "Backup systems in multiple geographic regions",
            "CDN infrastructure for global performance",
            "Compliance with local data protection laws"
          ]
        },
        {
          subtitle: "Transfer Safeguards",
          items: [
            "Standard Contractual Clauses (SCCs)",
            "Adequacy decisions where applicable",
            "Additional safeguards for sensitive data",
            "Regular review of transfer mechanisms"
          ]
        }
      ]
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      icon: Shield,
      content: [
        {
          subtitle: "Age Restrictions",
          items: [
            "Our services are not intended for children under 13",
            "We do not knowingly collect information from children",
            "Parents can request deletion of child's information",
            "We will delete accounts if we learn they belong to children"
          ]
        }
      ]
    },
    {
      id: "changes-updates",
      title: "Policy Changes and Updates",
      icon: FileText,
      content: [
        {
          subtitle: "Notification Process",
          items: [
            "Email notification for material changes",
            "In-app notifications for policy updates",
            "Website banner for immediate changes",
            "30-day notice period for significant modifications"
          ]
        },
        {
          subtitle: "Continued Use",
          items: [
            "Continued use constitutes acceptance of changes",
            "Right to terminate account if you disagree",
            "Previous versions available upon request"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-zinc-400 mb-2">
              Your privacy is our priority. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-zinc-500">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/settings/privacy"
              className="flex items-center space-x-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-medium text-white">Privacy Settings</h3>
                <p className="text-sm text-zinc-400">Manage your privacy preferences</p>
              </div>
            </Link>
            
            <Link
              href="/legal/data-request"
              className="flex items-center space-x-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <Download className="w-5 h-5 text-green-400" />
              <div>
                <h3 className="font-medium text-white">Download Data</h3>
                <p className="text-sm text-zinc-400">Export your personal information</p>
              </div>
            </Link>
            
            <Link
              href="/legal/data-deletion"
              className="flex items-center space-x-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="font-medium text-white">Delete Account</h3>
                <p className="text-sm text-zinc-400">Remove your data permanently</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors text-zinc-300 hover:text-white"
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.content.map((subsection, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-white mb-3">{subsection.subtitle}</h3>
                    <ul className="space-y-2">
                      {subsection.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 mt-8"
        >
          <div className="text-center">
            <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
            <p className="text-zinc-400 mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
              
              <Link
                href="/legal/terms"
                className="inline-flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Terms of Service
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-500">
                Omnipreneur AI<br />
                Email: privacy@omnipreneur.ai<br />
                Address: [Your Business Address]
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}