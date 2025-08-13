// Brand configuration for Omnipreneur design system

export const brand = {
  // Primary brand colors
  primary: "#4f46e5", // indigo-600
  primaryLight: "#6366f1", // indigo-500
  primaryDark: "#3730a3", // indigo-800
  
  // Accent colors
  accent: "#06b6d4", // cyan-500
  accentLight: "#22d3ee", // cyan-400
  accentDark: "#0891b2", // cyan-600
  
  // Secondary colors
  secondary: "#9333ea", // purple-600
  secondaryLight: "#a855f7", // purple-500
  secondaryDark: "#7c3aed", // purple-700
  
  // Background colors
  darkBg: "#09090b", // zinc-950
  darkBgSecondary: "#18181b", // zinc-900
  darkBgTertiary: "#27272a", // zinc-800
  
  // Card colors
  card: "#1e1e1e",
  cardHover: "#2a2a2a",
  cardBorder: "#3f3f46", // zinc-700
  
  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "#e4e4e7", // zinc-200
  textTertiary: "#a1a1aa", // zinc-400
  textMuted: "#71717a", // zinc-500
  
  // Success/Error colors
  success: "#10b981", // emerald-500
  successLight: "#34d399", // emerald-400
  error: "#ef4444", // red-500
  errorLight: "#f87171", // red-400
  warning: "#f59e0b", // amber-500
  warningLight: "#fbbf24", // amber-400
  
  // Gradient definitions
  gradients: {
    primary: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
    accent: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
    glow: "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)",
    glass: "linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(30, 30, 30, 0.7) 100%)",
  },
  
  // Spacing scale
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem",  // 8px
    md: "1rem",    // 16px
    lg: "1.5rem",  // 24px
    xl: "2rem",    // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },
  
  // Border radius
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem",   // 8px
    lg: "0.75rem",  // 12px
    xl: "1rem",     // 16px
    "2xl": "1.5rem", // 24px
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    glow: "0 0 20px rgba(79, 70, 229, 0.3)",
    glowLg: "0 0 40px rgba(79, 70, 229, 0.4)",
  },
  
  // Transitions
  transitions: {
    fast: "150ms ease-out",
    normal: "300ms ease-out",
    slow: "500ms ease-out",
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      display: ["Space Grotesk", "Inter", "ui-sans-serif"],
      mono: ["Fira Code", "ui-monospace"],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  
  // Z-index scale
  zIndex: {
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
  },
};

// Utility functions
export const getBrandColor = (color: keyof typeof brand) => {
  return brand[color];
};

export const getGradient = (gradient: keyof typeof brand.gradients) => {
  return brand.gradients[gradient];
};

export const getSpacing = (size: keyof typeof brand.spacing) => {
  return brand.spacing[size];
};

export const getShadow = (shadow: keyof typeof brand.shadows) => {
  return brand.shadows[shadow];
};

// Theme helpers
export const createTheme = (overrides: Partial<typeof brand> = {}) => {
  return {
    ...brand,
    ...overrides,
  };
};

// Color palette for different contexts
export const colorPalettes = {
  // Primary palette for main UI elements
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#1e1b4b",
  },
  
  // Accent palette for highlights and CTAs
  accent: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
  },
  
  // Neutral palette for backgrounds and text
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
};

// Export default brand configuration
export default brand; 