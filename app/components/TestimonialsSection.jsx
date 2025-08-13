"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for ProfileCard
const ProfileCard = dynamic(() => import('./ProfileCard'), {
  loading: () => <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>,
  ssr: false
});

const testimonials = [
  {
    name: 'R. Stephen',
    role: 'Mechanical Engineer',
    company: 'TechCorp Industries',
    image: '/images/testimonial-1.jpg',
    quote: 'The integration of AI with our robotics systems has revolutionized our manufacturing process. The precision and efficiency gains are remarkable.',
    socialLinks: {
      linkedin: '#',
      twitter: '#'
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
    quote: 'Implementation was seamless, and the results exceeded our expectations. The AI-driven automation has transformed our operations completely.',
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
    quote: 'The future of industrial automation is here. This technology has given us a competitive edge in an increasingly demanding market.',
    socialLinks: {
      linkedin: '#',
      twitter: '#'
    },
    stats: {
      projects: 34,
      experience: '12+ years',
      location: 'Chicago'
    }
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="w-full py-20 px-4 bg-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Section Title */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-6">
          WHAT PEOPLE SAY ABOUT OUR<br />AI SERVICE & TECHNOLOGY
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto">
          Hear from industry professionals who have experienced the power of our AI and robotics solutions.
        </p>
      </div>
      
      {/* Testimonials Carousel */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Main Card */}
        <div className="relative">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Card */}
              <div className="flex-shrink-0">
                <ProfileCard
                  {...testimonials[activeIndex]}
                  variant="default"
                  className="w-64"
                />
              </div>
              
              {/* Quote */}
              <div className="flex-1 text-center md:text-left">
                <div className="text-4xl text-primary/20 mb-4">"</div>
                <p className="text-lg md:text-xl text-zinc-300 italic mb-6">
                  {testimonials[activeIndex].quote}
                </p>
                <div className="font-orbitron">
                  <div className="text-white font-bold">
                    {testimonials[activeIndex].name}
                  </div>
                  <div className="text-zinc-400 text-sm">
                    {testimonials[activeIndex].role}
                  </div>
                  {testimonials[activeIndex].company && (
                    <div className="text-zinc-500 text-xs">
                      {testimonials[activeIndex].company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
            <button
              onClick={prevTestimonial}
              className="glass-button rounded-full p-3 pointer-events-auto"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="glass-button rounded-full p-3 pointer-events-auto"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 