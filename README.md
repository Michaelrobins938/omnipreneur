# Omnipreneur Launch Bundle - Complete AI-Powered Business Platform

## 🚀 Overview

The Omnipreneur Launch Bundle is a comprehensive, production-ready platform that combines multiple AI-powered tools and business automation systems. This repository contains the complete ecosystem for launching and scaling digital businesses.

## 📦 What's Included

### Core Platform
- **Main Next.js Application** - Full-stack web application with modern UI
- **AI-Powered Tools** - Auto-rewrite engine, content spawner, niche discovery
- **Business Automation** - Affiliate portal, bundle builder, live dashboard
- **Payment Integration** - Stripe-powered checkout and subscription management

### Subprojects & Tools
- **Auto-Niche Engine** - AI-powered market research and niche discovery
- **Content Spawner** - Automated content generation system
- **Bundle Builder** - Digital product packaging and delivery
- **Affiliate Portal** - Complete affiliate management system
- **Live Dashboard** - Real-time business metrics and analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Prisma ORM, PostgreSQL
- **Payments**: Stripe API (v2025-06-30.basil)
- **AI/ML**: OpenAI API, LangChain, Custom AI Prompts
- **Deployment**: Vercel, GitHub Actions
- **Database**: PostgreSQL (with Prisma migrations)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Stripe account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/omnipreneur-launch-bundle.git
   cd omnipreneur-launch-bundle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/omnipreneur"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   OPENAI_API_KEY="sk-..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── app/                    # Main Next.js application
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── pages/                 # Additional pages
│   └── api/              # API endpoints
├── components/            # Shared components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
├── public/               # Static assets
├── styles/               # Additional styles
├── auto-niche-engine/    # AI niche discovery tool
├── content_spawner_complete/  # Content generation system
├── bundle_builder_complete/   # Digital product builder
├── affiliate_portal_complete/ # Affiliate management
├── live-dashboard/       # Business analytics
└── deployment_guides/    # Deployment documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omnipreneur"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# Email (Optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### Database Configuration

The project uses Prisma with PostgreSQL. Configure your database connection in the `DATABASE_URL` environment variable.

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Add all environment variables from `.env.local`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Core APIs
- `POST /api/auth/[...nextauth]` - Authentication
- `POST /api/payments/create-checkout` - Stripe checkout
- `POST /api/payments/webhook` - Stripe webhooks
- `GET /api/bundle` - Bundle management
- `POST /api/rewrite` - Content rewriting
- `POST /api/spawn` - Content generation

### Subproject APIs
- `GET /api/discover` - Niche discovery (Auto-Niche Engine)
- Various endpoints in subproject directories

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="ComponentName"
```

## 📊 Monitoring & Analytics

The platform includes:
- Real-time dashboard with business metrics
- Stripe webhook monitoring
- Error tracking and logging
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🆘 Support

For support and questions:
- Check the [deployment guides](deployment_guides/) directory
- Review the [DEVELOPER_README.md](DEVELOPER_README.md)
- Open an issue on GitHub

## 🎯 Roadmap

- [ ] Enhanced AI capabilities
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced automation workflows

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Build Time**: < 2 minutes
- **Bundle Size**: Optimized with Next.js 14 features
- **Database**: Optimized queries with Prisma

---

**Built with ❤️ by the Omnipreneur Team**

*Last updated: July 2025* 