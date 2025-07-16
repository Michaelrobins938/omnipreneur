# AI Prompt Stack - Landing Page

A modern, clean landing page for the AI Prompt Stack product suite built with Next.js and Tailwind CSS.

## Features

- **Hero Section**: Compelling headline and call-to-action
- **Tier Grid**: Four product tiers with pricing and features
- **How It Works**: 4-phase protocol explanation
- **Testimonials**: Customer testimonials with ratings
- **Final CTA**: Strong call-to-action section

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Lucide React Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
BONUS_PROMPT_PACK_V1/
├── components/
│   └── ui/
│       └── nav.tsx
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   └── stack.tsx
├── styles/
│   └── globals.css
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Design System

The landing page follows Apple-inspired design principles:
- Clean, minimal aesthetic
- Typography scale with Inter font
- Accent color: #0071e3
- Grid layouts with responsive design
- Smooth animations and transitions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint 