'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, ArrowRight, Star, Zap, Users, Shield, Clock } from 'lucide-react'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Free",
      price: { monthly: "$0", yearly: "$0" },
      description: "Perfect for individuals getting started",
      features: [
        "Up to 50 tasks",
        "Basic AI suggestions",
        "Simple analytics",
        "Email support",
        "1 workspace",
        "Basic integrations"
      ],
      limitations: [
        "No advanced AI features",
        "Limited analytics",
        "No team collaboration",
        "No API access"
      ],
      popular: false,
      cta: "Get Started",
      color: "border-gray-200"
    },
    {
      name: "Pro",
      price: { monthly: "$9", yearly: "$90" },
      description: "For professionals who want to scale",
      features: [
        "Unlimited tasks",
        "Advanced AI features",
        "Detailed analytics",
        "Priority support",
        "Custom integrations",
        "5 workspaces",
        "Advanced automation",
        "Export data"
      ],
      limitations: [],
      popular: true,
      cta: "Start Free Trial",
      color: "border-blue-500 ring-2 ring-blue-500"
    },
    {
      name: "Team",
      price: { monthly: "$29", yearly: "$290" },
      description: "For teams that need collaboration",
      features: [
        "Everything in Pro",
        "Team workspaces",
        "Advanced permissions",
        "API access",
        "Dedicated support",
        "Custom branding",
        "Advanced security",
        "SLA guarantee"
      ],
      limitations: [],
      popular: false,
      cta: "Start Free Trial",
      color: "border-gray-200"
    },
    {
      name: "Enterprise",
      price: { monthly: "$99", yearly: "$990" },
      description: "For large organizations",
      features: [
        "Everything in Team",
        "Unlimited workspaces",
        "Custom integrations",
        "Dedicated account manager",
        "Custom training",
        "Advanced compliance",
        "White-label options",
        "24/7 phone support"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales",
      color: "border-gray-200"
    }
  ]

  const features = [
    {
      name: "AI Task Suggestions",
      free: "Basic",
      pro: "Advanced",
      team: "Advanced",
      enterprise: "Custom"
    },
    {
      name: "Analytics & Reports",
      free: "Basic",
      pro: "Advanced",
      team: "Advanced",
      enterprise: "Custom"
    },
    {
      name: "Team Collaboration",
      free: false,
      pro: false,
      team: true,
      enterprise: true
    },
    {
      name: "API Access",
      free: false,
      pro: false,
      team: true,
      enterprise: true
    },
    {
      name: "Custom Integrations",
      free: false,
      pro: "Limited",
      team: true,
      enterprise: true
    },
    {
      name: "Priority Support",
      free: false,
      pro: true,
      team: true,
      enterprise: true
    },
    {
      name: "Dedicated Support",
      free: false,
      pro: false,
      team: true,
      enterprise: true
    },
    {
      name: "SLA Guarantee",
      free: false,
      pro: false,
      team: true,
      enterprise: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow AI</span>
            </div>
            <Button variant="outline" onClick={() => signIn()}>
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you and your team. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <Badge variant="secondary" className="ml-2">Save 20%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'shadow-xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price[billingCycle]}
                  {plan.price[billingCycle] !== "$0" && (
                    <span className="text-lg text-gray-500 font-normal">
                      /{billingCycle === 'monthly' ? 'mo' : 'year'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-center text-gray-400">
                      <X className="h-4 w-4 mr-3" />
                      {limitation}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => signIn()}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare all features
            </h2>
            <p className="text-xl text-gray-600">
              See exactly what each plan includes
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold">Free</th>
                  <th className="text-center py-4 px-6 font-semibold">Pro</th>
                  <th className="text-center py-4 px-6 font-semibold">Team</th>
                  <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-6 font-medium">{feature.name}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.team === 'boolean' ? (
                        feature.team ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600">{feature.team}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">Yes, all paid plans include a 14-day free trial. No credit card required to start.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts required.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already working smarter with TaskFlow AI
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => signIn()}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
} 