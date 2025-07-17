'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "User-First Design",
      description: "Every feature is built with our users in mind. We believe in creating tools that actually make work easier."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Innovation",
      description: "We're constantly exploring new ways to leverage AI and technology to solve real productivity challenges."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Impact",
      description: "We're building tools that help teams around the world work more efficiently and achieve their goals."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our product design to our customer support."
    }
  ]

  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      bio: "Former product manager at Google, passionate about AI and productivity tools.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "AI researcher with 10+ years experience in machine learning and software engineering.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mike Rodriguez",
      role: "Head of Design",
      bio: "Design leader focused on creating intuitive and beautiful user experiences.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Wang",
      role: "Head of Growth",
      bio: "Growth expert helping teams scale and reach their full potential.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ]

  const milestones = [
    {
      year: "2024",
      title: "TaskFlow AI Launched",
      description: "Our AI-powered task management platform goes live with advanced automation features."
    },
    {
      year: "2023",
      title: "Company Founded",
      description: "TaskFlow AI was founded with a mission to revolutionize how teams work together."
    },
    {
      year: "2022",
      title: "Research Begins",
      description: "Our team started researching AI applications for productivity and task management."
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
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            About TaskFlow AI
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing how teams
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> work together</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            We're building the future of productivity by combining the power of AI with intuitive design. 
            Our mission is to help teams work smarter, not harder.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At TaskFlow AI, we believe that great work happens when teams have the right tools and insights. 
              We're on a mission to democratize AI-powered productivity for teams of all sizes.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              By combining cutting-edge AI technology with intuitive design, we're creating a platform that 
              not only helps you manage tasks but also provides intelligent insights to improve your workflow.
            </p>
            <div className="flex items-center space-x-4">
              <Button>
                Join Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">10,000+</div>
              <div className="text-xl mb-2">Active Users</div>
              <div className="text-blue-100">Trusting TaskFlow AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600">
            The passionate people behind TaskFlow AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <Badge variant="secondary">{member.role}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our company's history
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">500,000+</div>
            <div className="text-gray-600">Tasks Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Join us in shaping the future of work
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a user, partner, or potential team member, we'd love to hear from you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 