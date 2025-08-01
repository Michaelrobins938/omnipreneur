"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaRocket
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdAccessTime,
  MdSend,
  MdSecurity,
  MdSupport,
  MdSpeed
} from 'react-icons/md';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    interest: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: '',
          interest: 'general'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: MdEmail,
      title: 'Email Us',
      description: 'Get in touch with our team',
      contact: 'hello@omnipreneur.ai',
      href: 'mailto:hello@omnipreneur.ai',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: MdPhone,
      title: 'Call Us',
      description: 'Speak with our experts',
      contact: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MdLocationOn,
      title: 'Visit Us',
      description: 'Our headquarters',
      contact: 'San Francisco, CA',
      href: '#',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: MdAccessTime,
      title: 'Business Hours',
      description: 'When we\'re available',
      contact: 'Mon-Fri 9AM-6PM PST',
      href: '#',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance'
    },
    {
      icon: FaHeadset,
      title: '24/7 Support',
      description: 'Round-the-clock expert assistance'
    },
    {
      icon: FaRocket,
      title: 'Fast Response',
      description: 'Get answers within 24 hours'
    },
    {
      icon: FaCheckCircle,
      title: 'Guaranteed Satisfaction',
      description: '100% satisfaction guarantee'
    }
  ];

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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Get in
              <span className="block bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your business with AI? Our team of experts is here to help you implement the perfect solution.
            </p>
          </motion.div>

          {/* Contact Methods Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/30 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{method.title}</h3>
                      <p className="text-zinc-400 text-sm mb-1">{method.description}</p>
                      <a 
                        href={method.href}
                        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                      >
                        {method.contact}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl transform -rotate-1" />
              <form onSubmit={handleSubmit} className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-bold text-white mb-8">Send us a Message</h3>
                
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-3"
                  >
                    <FaCheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
                  >
                    <FaCheckCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Failed to send message. Please try again.</span>
                  </motion.div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">Company</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your company name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-3">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">Interest Area</label>
                    <select
                      value={formData.interest}
                      onChange={(e) => handleInputChange('interest', e.target.value)}
                      className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="demo">Request Demo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-3">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full bg-zinc-800/60 border border-zinc-600/50 rounded-2xl px-6 py-4 text-white placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 h-32 resize-none"
                      placeholder="Tell us about your project or questions..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <MdSend className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Right Side - Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Why Choose Us */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{feature.title}</h4>
                          <p className="text-zinc-400 text-sm">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Office Hours</h3>
                <div className="space-y-3 text-zinc-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Emergency Support</h3>
                <p className="text-zinc-400 mb-4">
                  For urgent technical issues outside business hours, contact our emergency support line.
                </p>
                <a 
                  href="tel:+15551234567"
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 