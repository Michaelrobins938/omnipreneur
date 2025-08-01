"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaRocket, 
  FaHeart, 
  FaGlobe,
  FaGraduationCap,
  FaBriefcase,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaLightbulb,
  FaHandshake
} from 'react-icons/fa';
import { 
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineGlobe,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineLocationMarker
} from 'react-icons/hi';

export default function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments', count: 12 },
    { id: 'engineering', name: 'Engineering', count: 5 },
    { id: 'marketing', name: 'Marketing', count: 3 },
    { id: 'sales', name: 'Sales', count: 2 },
    { id: 'design', name: 'Design', count: 2 }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior AI Engineer',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Join our AI team to develop cutting-edge machine learning models for content generation and optimization.',
      requirements: [
        'Strong background in machine learning and NLP',
        'Experience with Python, TensorFlow, and PyTorch',
        'Knowledge of transformer architectures and fine-tuning',
        'Experience with cloud platforms (AWS, GCP)',
        'Excellent problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity',
        'Flexible work arrangements',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Professional development budget'
      ]
    },
    {
      id: 2,
      title: 'Product Marketing Manager',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Lead product marketing initiatives for our AI-powered content creation suite.',
      requirements: [
        'Experience in B2B SaaS marketing',
        'Strong analytical and creative skills',
        'Experience with content marketing and SEO',
        'Familiarity with AI/ML products',
        'Excellent written and verbal communication'
      ],
      benefits: [
        'Competitive salary and equity',
        'Remote work flexibility',
        'Health, dental, and vision insurance',
        'Professional development opportunities',
        'Generous PTO policy'
      ]
    },
    {
      id: 3,
      title: 'Senior Frontend Developer',
      department: 'engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Build beautiful, responsive user interfaces for our AI-powered applications.',
      requirements: [
        'Expert in React, TypeScript, and modern JavaScript',
        'Experience with Next.js and server-side rendering',
        'Strong understanding of UI/UX principles',
        'Experience with state management (Redux, Zustand)',
        'Knowledge of performance optimization'
      ],
      benefits: [
        'Competitive salary and equity',
        'Flexible work arrangements',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Professional development budget'
      ]
    },
    {
      id: 4,
      title: 'Enterprise Sales Representative',
      department: 'sales',
      location: 'New York, NY',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive enterprise sales and build relationships with Fortune 500 companies.',
      requirements: [
        'Proven track record in B2B enterprise sales',
        'Experience selling SaaS or AI products',
        'Strong consultative selling skills',
        'Experience with CRM systems (Salesforce)',
        'Excellent presentation and negotiation skills'
      ],
      benefits: [
        'Competitive base salary + commission',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Professional development opportunities',
        'Generous PTO policy'
      ]
    },
    {
      id: 5,
      title: 'UX/UI Designer',
      department: 'design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Create intuitive and beautiful user experiences for our AI-powered products.',
      requirements: [
        'Strong portfolio demonstrating UX/UI skills',
        'Experience with Figma and design systems',
        'Understanding of user research and testing',
        'Experience with web and mobile design',
        'Knowledge of accessibility standards'
      ],
      benefits: [
        'Competitive salary and equity',
        'Remote work flexibility',
        'Health, dental, and vision insurance',
        'Professional development opportunities',
        'Generous PTO policy'
      ]
    }
  ];

  const companyValues = [
    {
      icon: HiOutlineAcademicCap,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI and technology.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HiOutlineUsers,
      title: 'Team Collaboration',
      description: 'We believe in the power of diverse teams working together.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HiOutlineHeart,
      title: 'Customer Focus',
      description: 'Everything we do is driven by customer success and satisfaction.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: HiOutlineGlobe,
      title: 'Global Impact',
      description: 'We\'re building tools that empower creators worldwide.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    {
      icon: FaStar,
      title: 'Competitive Compensation',
      description: 'Above-market salaries and equity packages'
    },
    {
      icon: FaHeart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision coverage'
    },
    {
      icon: FaGraduationCap,
      title: 'Learning & Growth',
      description: 'Professional development budget and learning opportunities'
    },
    {
      icon: FaGlobe,
      title: 'Flexible Work',
      description: 'Remote work options and flexible schedules'
    },
    {
      icon: FaRocket,
      title: 'Career Growth',
      description: 'Clear career paths and advancement opportunities'
    },
    {
      icon: FaUsers,
      title: 'Great Team',
      description: 'Work with talented, passionate individuals'
    }
  ];

  const filteredJobs = jobOpenings.filter(job => 
    selectedDepartment === 'all' || job.department === selectedDepartment
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_80%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUsers className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Join Our
              <span className="block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Team
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
              Help us build the future of AI-powered content creation. Join a team of passionate innovators 
              working to empower creators worldwide.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>View Open Positions</span>
                <FaArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Values
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Work With Us
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              We invest in our people because they're our greatest asset.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Open Positions
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Find your next opportunity to make an impact.
            </p>
          </motion.div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {departments.map((department) => (
              <button
                key={department.id}
                onClick={() => setSelectedDepartment(department.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedDepartment === department.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700/60'
                }`}
              >
                {department.name} ({department.count})
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                      <span className="flex items-center space-x-1">
                        <FaBriefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaClock className="w-4 h-4" />
                        <span>{job.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaGraduationCap className="w-4 h-4" />
                        <span>{job.experience}</span>
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
                    Apply Now
                  </button>
                </div>
                
                <p className="text-zinc-400 mb-6">{job.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2 text-zinc-400">
                          <FaCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-2 text-zinc-400">
                          <FaCheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <p className="text-zinc-400 text-lg">No positions found in this department.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Join Us?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Don't see a position that fits? Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Submit Resume</span>
                <FaArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-zinc-600 text-zinc-300 rounded-full font-semibold text-lg hover:border-green-500 hover:text-green-400 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Contact Recruiting</span>
                <FaHandshake className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 