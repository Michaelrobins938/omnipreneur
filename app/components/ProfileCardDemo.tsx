"use client"
import React from 'react';
import ProfileCard from './ProfileCard';

const ProfileCardDemo = () => {
  const sampleProfiles = [
    {
      name: 'R. Stephen',
      role: 'Mechanical Engineer',
      company: 'TechCorp Industries',
      image: '/images/testimonial-1.jpg',
      quote: 'The integration of AI with our robotics systems has revolutionized our manufacturing process.',
      socialLinks: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      stats: {
        projects: 47,
        experience: '8+ years',
        location: 'San Francisco'
      }
    },
    {
      name: 'S. George',
      role: 'IT Professional',
      company: 'Digital Solutions Inc.',
      image: '/images/testimonial-2.jpg',
      quote: 'Implementation was seamless, and the results exceeded our expectations.',
      socialLinks: {
        linkedin: '#',
        website: '#'
      },
      stats: {
        projects: 23,
        experience: '5+ years',
        location: 'New York'
      }
    },
    {
      name: 'A. Martinez',
      role: 'Operations Director',
      company: 'Global Manufacturing',
      image: '/images/testimonial-3.jpg',
      quote: 'The future of industrial automation is here. This technology has given us a competitive edge.',
      socialLinks: {
        linkedin: '#',
        twitter: '#'
      },
      stats: {
        projects: 34,
        experience: '12+ years',
        location: 'Chicago'
      }
    }
  ];

  return (
    <section className="w-full py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6">
          TEAM PROFILES
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
          Meet our expert team of AI professionals and industry leaders.
        </p>
      </div>
      
      {/* Profile Cards Grid */}
      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Default Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Default Profile Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProfiles.map((profile, index) => (
              <ProfileCard
                key={index}
                {...profile}
                variant="default"
              />
            ))}
          </div>
        </div>

        {/* Detailed Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Detailed Profile Cards</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sampleProfiles.slice(0, 2).map((profile, index) => (
              <ProfileCard
                key={`detailed-${index}`}
                {...profile}
                variant="detailed"
              />
            ))}
          </div>
        </div>

        {/* Minimal Cards */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Minimal Profile Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleProfiles.map((profile, index) => (
              <ProfileCard
                key={`minimal-${index}`}
                {...profile}
                variant="minimal"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCardDemo; 