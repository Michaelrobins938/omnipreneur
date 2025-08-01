"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle, 
  FaClock,
  FaServer,
  FaDatabase,
  FaGlobe,
  FaCog,
  FaChartLine,
  FaHistory
} from 'react-icons/fa';
import { 
  HiOutlineServer,
  HiOutlineDatabase,
  HiOutlineGlobe,
  HiOutlineCog,
  HiOutlineChartBar
} from 'react-icons/hi';

export default function Status() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      name: 'AutoRewrite Engine',
      status: 'operational',
      icon: HiOutlineCog,
      description: 'AI-powered content rewriting service',
      uptime: '99.99%',
      responseTime: '120ms'
    },
    {
      name: 'Content Spawner',
      status: 'operational',
      icon: HiOutlineGlobe,
      description: 'Viral content generation service',
      uptime: '99.98%',
      responseTime: '95ms'
    },
    {
      name: 'Bundle Builder',
      status: 'operational',
      icon: HiOutlineChartBar,
      description: 'Product packaging and optimization',
      uptime: '99.97%',
      responseTime: '150ms'
    },
    {
      name: 'Live Dashboard',
      status: 'operational',
      icon: HiOutlineServer,
      description: 'Real-time analytics and tracking',
      uptime: '99.99%',
      responseTime: '80ms'
    },
    {
      name: 'Affiliate Portal',
      status: 'operational',
      icon: HiOutlineDatabase,
      description: 'Referral and commission management',
      uptime: '99.96%',
      responseTime: '110ms'
    },
    {
      name: 'API Gateway',
      status: 'operational',
      icon: HiOutlineCog,
      description: 'Main API access point',
      uptime: '99.99%',
      responseTime: '45ms'
    }
  ];

  const incidents = [
    {
      id: 1,
      title: 'Scheduled Maintenance - AutoRewrite Engine',
      status: 'resolved',
      severity: 'low',
      description: 'Routine maintenance completed successfully. All services are now operational.',
      startTime: '2024-01-15T02:00:00Z',
      endTime: '2024-01-15T04:00:00Z',
      duration: '2 hours'
    },
    {
      id: 2,
      title: 'Performance Optimization - Content Spawner',
      status: 'resolved',
      severity: 'low',
      description: 'Performance improvements implemented. Response times improved by 15%.',
      startTime: '2024-01-10T10:00:00Z',
      endTime: '2024-01-10T12:00:00Z',
      duration: '2 hours'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return FaCheckCircle;
      case 'degraded':
        return FaExclamationTriangle;
      case 'outage':
        return FaTimesCircle;
      default:
        return FaClock;
    }
  };

  const overallStatus = 'operational';
  const overallUptime = '99.98%';

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
              <div className={`w-16 h-16 bg-gradient-to-br ${
                overallStatus === 'operational' ? 'from-green-500 to-emerald-500' :
                overallStatus === 'degraded' ? 'from-yellow-500 to-orange-500' :
                'from-red-500 to-pink-500'
              } rounded-2xl flex items-center justify-center shadow-lg`}>
                {(() => {
                  const Icon = getStatusIcon(overallStatus);
                  return <Icon className="w-8 h-8 text-white" />;
                })()}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              System
              <span className={`block bg-clip-text text-transparent ${
                overallStatus === 'operational' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                overallStatus === 'degraded' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                Status
              </span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Overall Status</h3>
                <p className={`text-2xl font-bold ${getStatusColor(overallStatus)}`}>
                  {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Uptime</h3>
                <p className="text-2xl font-bold text-green-400">{overallUptime}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Last Updated</h3>
                <p className="text-lg text-zinc-400">
                  {currentTime.toLocaleTimeString()}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Service Status
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Real-time status of all Omnipreneur AI Suite services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const StatusIcon = getStatusIcon(service.status);
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <p className="text-sm text-zinc-400">{service.description}</p>
                      </div>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-400">Uptime</p>
                      <p className="text-green-400 font-semibold">{service.uptime}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Response Time</p>
                      <p className="text-blue-400 font-semibold">{service.responseTime}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-20 bg-gradient-to-br from-zinc-900/80 to-black/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Recent Incidents
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Historical incidents and maintenance events.
            </p>
          </motion.div>

          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                    incident.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-zinc-400 mb-4">{incident.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400">Start Time</p>
                    <p className="text-white">{new Date(incident.startTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">End Time</p>
                    <p className="text-white">{new Date(incident.endTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Duration</p>
                    <p className="text-white">{incident.duration}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Get notified about service status updates and incidents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-zinc-800/60 border border-zinc-600/50 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 