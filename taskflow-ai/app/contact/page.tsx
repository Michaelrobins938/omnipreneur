'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Globe,
  Zap
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: ''
    })
  }

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: "hello@taskflow.ai",
      description: "We'll get back to you within 24 hours"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm EST"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      value: "San Francisco, CA",
      description: "Visit us in the heart of Silicon Valley"
    }
  ]

  const departments = [
    {
      title: "Sales",
      description: "Questions about pricing and plans",
      email: "sales@taskflow.ai",
      response: "Within 2 hours"
    },
    {
      title: "Support",
      description: "Technical help and troubleshooting",
      email: "support@taskflow.ai",
      response: "Within 4 hours"
    },
    {
      title: "Partnerships",
      description: "Business development and integrations",
      email: "partnerships@taskflow.ai",
      response: "Within 24 hours"
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
            <Button variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Get in Touch
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            We'd love to hear from you
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Have a question, feedback, or want to learn more about TaskFlow AI? 
            Our team is here to help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {info.icon}
                </div>
                <CardTitle className="text-lg">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-gray-900 mb-2">{info.value}</p>
                <p className="text-gray-600">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Your company (optional)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us more..."
                    className="w-full p-3 border border-input rounded-md resize-none h-32"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Department Contacts */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact the right team
              </h2>
              <p className="text-gray-600 mb-6">
                Not sure who to contact? Here's who handles what:
              </p>
            </div>
            
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{dept.title}</h3>
                      <p className="text-gray-600 mb-2">{dept.description}</p>
                      <p className="text-sm text-gray-500">Response time: {dept.response}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      {dept.email}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">How quickly do you respond?</h3>
              <p className="text-gray-600">We aim to respond to all inquiries within 24 hours, with most getting a response within 4 hours during business hours.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Do you offer custom solutions?</h3>
              <p className="text-gray-600">Yes! We work with enterprise customers to create custom integrations and solutions tailored to their specific needs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I schedule a demo?</h3>
              <p className="text-gray-600">Absolutely! Our sales team can walk you through a personalized demo of TaskFlow AI. Just let us know your use case.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What support do you offer?</h3>
              <p className="text-gray-600">We offer email support for all plans, with priority support for Pro+ plans and dedicated support for Enterprise customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 mr-3" />
            <h2 className="text-3xl font-bold">Office Hours</h2>
          </div>
          <p className="text-xl mb-4 opacity-90">
            Monday - Friday: 8:00 AM - 6:00 PM EST
          </p>
          <p className="text-lg opacity-80">
            We're here to help you succeed with TaskFlow AI
          </p>
        </div>
      </section>
    </div>
  )
} 