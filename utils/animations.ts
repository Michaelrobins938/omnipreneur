// Animation presets for the Omnipreneur design system

export const animations = {
  // Fade animations
  fadeIn: {
    opacity: 0,
    animation: 'fadeIn 0.3s ease-out forwards',
  },
  
  fadeInUp: {
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'fadeInUp 0.5s ease-out forwards',
  },
  
  fadeInDown: {
    opacity: 0,
    transform: 'translateY(-20px)',
    animation: 'fadeInDown 0.5s ease-out forwards',
  },
  
  // Scale animations
  scaleIn: {
    opacity: 0,
    transform: 'scale(0.9)',
    animation: 'scaleIn 0.3s ease-out forwards',
  },
  
  scalePulse: {
    animation: 'scalePulse 2s ease-in-out infinite',
  },
  
  // Slide animations
  slideInRight: {
    opacity: 0,
    transform: 'translateX(20px)',
    animation: 'slideInRight 0.5s ease-out forwards',
  },
  
  slideInLeft: {
    opacity: 0,
    transform: 'translateX(-20px)',
    animation: 'slideInLeft 0.5s ease-out forwards',
  },
  
  // Pulse animations
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  pulseSlow: {
    animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  
  // Glow animations
  glow: {
    animation: 'glow 2s ease-in-out infinite',
  },
  
  // Float animation
  float: {
    animation: 'float 6s ease-in-out infinite',
  },
  
  // Shimmer animation
  shimmer: {
    animation: 'shimmer 2s linear infinite',
  },
  
  // Loading animation
  loading: {
    animation: 'loading 1.5s infinite',
  },
};

// Stagger animation delays
export const stagger = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  
  item: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  },
};

// Page transition animations
export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Hover animations
export const hoverAnimations = {
  lift: {
    transition: 'transform 0.2s ease-out',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  
  scale: {
    transition: 'transform 0.2s ease-out',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  
  glow: {
    transition: 'box-shadow 0.2s ease-out',
    '&:hover': {
      boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)',
    },
  },
};

// Utility functions
export const createStaggerDelay = (index: number, delay: number = 0.1) => ({
  animationDelay: `${index * delay}s`,
});

export const createFadeInDelay = (delay: number = 0) => ({
  animation: 'fadeIn 0.3s ease-out forwards',
  animationDelay: `${delay}s`,
});

export const createSlideInDelay = (direction: 'left' | 'right' | 'up' | 'down', delay: number = 0) => {
  const animations = {
    left: 'slideInLeft',
    right: 'slideInRight',
    up: 'fadeInUp',
    down: 'fadeInDown',
  };
  
  return {
    animation: `${animations[direction]} 0.5s ease-out forwards`,
    animationDelay: `${delay}s`,
  };
}; 