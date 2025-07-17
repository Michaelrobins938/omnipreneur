<<<<<<< HEAD
# 🚀 Omnipreneur AI Suite

A comprehensive AI-powered digital product creation and monetization system with enterprise-grade features, modern architecture, and production-ready optimizations.

## ✨ Features

- **Multi-Agent AI Orchestration** - Claude, GPT-4, Command R+, Mistral integration
- **Content Generation Engine** - 100+ viral content pieces in one click
- **Bundle Builder** - Gumroad/Etsy-ready ZIP packaging with AI optimization
- **AutoRewrite Engine** - Tone reframing and content optimization
- **Live Dashboard** - Real-time analytics and performance tracking
- **Affiliate Portal** - Referral link generation and tracking
- **Payment Integration** - Stripe-powered subscription management
- **Email Automation** - Nodemailer with templated communications
- **Security First** - JWT authentication, rate limiting, CSP headers

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: JWT with bcrypt
- **Payments**: Stripe integration
- **Email**: Nodemailer with SMTP
- **AI**: OpenAI, Claude, OpenRouter APIs
- **Performance**: Turbo, Image optimization, Code splitting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- API keys for AI services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd omnipreneur-ai-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Production Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t omnipreneur-ai-suite .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 omnipreneur-ai-suite
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run test` - Run Jest tests
- `npm run analyze` - Analyze bundle size

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── pages/                 # Pages Router (legacy)
│   └── api/              # API endpoints
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── analytics.ts      # Analytics tracking
│   ├── email.ts          # Email functionality
│   └── utils.ts          # General utilities
├── prisma/               # Database schema
├── public/               # Static assets
└── components/           # Shared components
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - API endpoint protection
- **CSP Headers** - Content Security Policy
- **Input Validation** - Request sanitization
- **Environment Variables** - Secure configuration
- **HTTPS Enforcement** - Production security

## 📊 Performance Optimizations

- **Code Splitting** - Dynamic imports for better loading
- **Image Optimization** - WebP/AVIF formats
- **Bundle Analysis** - Size monitoring
- **Caching Strategies** - Static and dynamic caching
- **CDN Integration** - Global content delivery
- **Lazy Loading** - Component-level optimization

## 🤖 AI Integration

### Supported Models
- **OpenAI GPT-4** - Advanced text generation
- **Claude 3 Opus** - Content optimization
- **OpenRouter** - Multi-model access
- **Custom Prompts** - Specialized workflows

### Features
- Content rewriting and optimization
- Marketing copy generation
- SEO optimization
- Bundle description creation
- Affiliate link optimization

## 💳 Payment Integration

### Stripe Features
- Subscription management
- One-time payments
- Webhook handling
- Customer portal
- Payment analytics

### Plans
- **Free** - Basic features
- **Pro** - Advanced AI features
- **Enterprise** - Custom solutions

## 📧 Email System

### Templates
- Welcome emails
- Payment confirmations
- Feature notifications
- Support communications

### Features
- SMTP integration
- HTML templates
- Automated workflows
- Delivery tracking

## 🔍 Analytics & Monitoring

### Metrics Tracked
- User engagement
- Feature usage
- Conversion rates
- Performance metrics
- Error tracking

### Tools
- Custom analytics
- Performance monitoring
- Error reporting
- User behavior tracking

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] CDN setup complete
- [ ] Monitoring enabled
- [ ] Backup strategy implemented
- [ ] Security audit completed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@omnipreneur.com or create an issue in the repository.

---

**Built with ❤️ by the Omnipreneur Team** 
=======
# Omnipreneur AI Suite Landing Page

A professional, high-converting landing page for the Omnipreneur AI Suite - a complete digital product empire powered by Claude 4 Opus and CAL™ technology.

## 🚀 Features

- **6 Claude-4 Powered Tools**: Complete AI-powered business-in-a-box
- **Emotional Journey Flow**: "Build. Package. Publish. Profit." visual journey
- **Urgency & Scarcity**: Launch week specials and limited licenses
- **Product Walkthrough**: 90-second demo integration
- **Dynamic Social Proof**: Real-time counters and testimonials
- **Professional Design**: Apple-quality aesthetics with modern UI

## 🛠 Tech Stack

- **Framework**: Next.js 14.2.30
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Language**: TypeScript
- **UI Components**: Custom component library

## 📦 Tools Included

1. **Bundle Builder Pro** - AI-powered digital product bundle creation
2. **Content Spawner Pro** - Generate 100+ content pieces in one click
3. **AutoRewrite Engine Pro** - 8 rewrite modes for professional content transformation
4. **Affiliate Portal Pro** - Complete affiliate management system
5. **Live Dashboard Pro** - Real-time analytics and monitoring
6. **AutoNiche Engine Pro** - KDP niche discovery with CAL™ validation

## 🎯 Key Features

- **Emotional Benefit Sentences**: Each tool has compelling emotional hooks
- **Visual Journey Flow**: Step-by-step progression through the suite
- **Urgency Elements**: Launch week specials and limited availability
- **Product Demo Integration**: Video walkthrough section
- **Social Proof**: Dynamic counters and testimonials
- **Responsive Design**: Optimized for all devices

## 🚀 Deployment

The landing page is deployed on Vercel with automatic deployments from GitHub.

### Production URL
https://landing-page-gtfaiuzp9-michaels-projects-19e37f0b.vercel.app

## 📁 Project Structure

```
landing-page/
├── components/          # Reusable UI components
│   ├── atoms/          # Basic components (buttons, icons)
│   ├── molecules/      # Compound components
│   ├── organisms/      # Complex page sections
│   └── ui/            # Base UI components
├── pages/             # Next.js pages
│   ├── api/           # API routes
│   ├── demos/         # Tool demo pages
│   └── index.tsx      # Main landing page
├── lib/               # Utilities and configurations
├── public/            # Static assets
└── styles/            # Global styles
```

## 🎨 Design System

- **Typography**: Apple-inspired font hierarchy
- **Colors**: Professional gradient system
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth hover effects and transitions
- **Components**: Atomic design methodology

## 📈 Performance

- **Build Time**: ~24 seconds
- **Bundle Size**: Optimized with CSS inlining
- **Lighthouse Score**: 90+ across all metrics
- **SEO Optimized**: Meta tags and structured data

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📝 License

This project is proprietary software for the Omnipreneur AI Suite.

## 🤝 Contributing

This is a private project for the Omnipreneur AI Suite landing page.

---

**Built with ❤️ for the digital product revolution** 
>>>>>>> a91fd0ee40786a9a996619e0687997f6bb8935d8
