# Omnipreneur AI Suite - Market Ready Web Application

## 🚀 Overview

The Omnipreneur AI Suite is a comprehensive, production-ready web application built with Next.js 15, React 18.3.1, and TypeScript. This organized monorepo contains multiple AI-powered modules and tools designed for entrepreneurs and content creators.

## 📁 Project Structure

```
organized/
├── main-app/                 # Core Next.js application
│   ├── app/                 # Next.js 15 app directory
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and configurations
│   ├── pages/               # API routes and pages
│   ├── public/              # Static assets
│   ├── styles/              # Global styles and CSS
│   ├── utils/               # Helper functions
│   └── prisma/              # Database schema and migrations
├── modules/                 # Individual AI tools and applications
│   ├── auto-niche-engine/   # KDP niche discovery tool
│   ├── auto_rewrite_engine_project/ # Content rewriting engine
│   ├── affiliate_portal_complete/ # Affiliate management system
│   ├── bundle_builder_complete/ # Digital product bundler
│   ├── content_spawner_complete/ # Content generation tool
│   ├── live-dashboard/      # Real-time analytics dashboard
│   ├── live-dashboard-app/  # Dashboard application
│   ├── taskflow-ai/         # AI-powered task management
│   ├── landing-page/        # Marketing landing pages
│   └── bundle-builder/      # Product bundle creator
├── documentation/           # Project documentation and guides
├── deployment/              # Deployment scripts and configurations
├── assets/                  # Shared assets and resources
└── backups/                 # Backup files and archives
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18.3.1, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI/UX**: Apple-quality design principles, glassmorphism, animations
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel, Docker support
- **AI Integration**: OpenAI, LangChain, custom AI workflows

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone and navigate to the organized directory:**
   ```bash
   cd organized/main-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🏗️ Production Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker Deployment
```bash
# Build the Docker image
docker build -t omnipreneur-ai-suite .

# Run the container
docker run -p 3000:3000 omnipreneur-ai-suite
```

## 📦 Available Modules

### Core Application (`main-app/`)
- **Modern UI/UX**: Apple-quality design with glassmorphism effects
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, structured data, sitemap
- **Performance**: Optimized images, lazy loading, code splitting

### AI Tools (`modules/`)
1. **Auto Niche Engine**: KDP market research and niche discovery
2. **Content Rewrite Engine**: AI-powered content rewriting
3. **Affiliate Portal**: Complete affiliate management system
4. **Bundle Builder**: Digital product creation and bundling
5. **Content Spawner**: Automated content generation
6. **Live Dashboard**: Real-time analytics and monitoring
7. **TaskFlow AI**: Intelligent task management
8. **Landing Pages**: High-converting marketing pages

## 🎨 Design Features

- **Premium UI/UX**: Apple-quality design principles
- **Glassmorphism**: Modern glass effects and transparency
- **Smooth Animations**: Framer Motion powered transitions
- **Gradient Backgrounds**: Dynamic, animated gradients
- **Responsive Design**: Perfect on all devices
- **Dark Mode**: Elegant dark theme with light mode support
- **Accessibility**: WCAG 2.1 AA compliant

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

### Testing
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Building
```bash
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run linting
npm run type-check    # TypeScript type checking
```

## 📚 Documentation

All documentation is organized in the `documentation/` directory:
- API Documentation
- User Guides
- Deployment Instructions
- Architecture Diagrams
- Best Practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `documentation/`
- Review deployment guides in `deployment/`

## 🚀 Roadmap

- [ ] Additional AI modules
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-tenant support
- [ ] API marketplace
- [ ] White-label solutions

---

**Built with ❤️ for entrepreneurs and content creators** 