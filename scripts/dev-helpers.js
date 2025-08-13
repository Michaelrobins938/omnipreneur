#!/usr/bin/env node

/**
 * Development Helper Script for Omnipreneur AI Suite
 * Makes Claude Code's development work easier by providing common utilities
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DevHelper {
  constructor() {
    this.rootDir = process.cwd();
  }

  // Quick project status check
  checkStatus() {
    console.log('🔍 Omnipreneur AI Suite Status Check\n');
    
    console.log('📦 Dependencies:');
    try {
      execSync('npm list --depth=0', { stdio: 'pipe' });
      console.log('✅ All dependencies installed');
    } catch (error) {
      console.log('❌ Missing dependencies - run: npm install');
    }

    console.log('\n🗄️ Database:');
    try {
      execSync('npx prisma db pull', { stdio: 'pipe' });
      console.log('✅ Database connection working');
    } catch (error) {
      console.log('❌ Database connection failed - check DATABASE_URL');
    }

    console.log('\n🔧 TypeScript:');
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ TypeScript compiles without errors');
    } catch (error) {
      console.log('❌ TypeScript errors found - run: npm run type-check');
    }

    console.log('\n📊 Current Phase: Core API Development (40% complete)');
    console.log('🎯 Next Priority: Complete Stripe webhooks & Content APIs');
  }

  // Generate API endpoint template
  generateApiEndpoint(resourceName, methods = ['GET', 'POST']) {
    const routePath = path.join(this.rootDir, 'app', 'api', resourceName, 'route.ts');
    
    if (fs.existsSync(routePath)) {
      console.log(`❌ API route already exists: ${routePath}`);
      return;
    }

    const template = this.createApiTemplate(resourceName, methods);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(routePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(routePath, template);
    console.log(`✅ Created API endpoint: ${routePath}`);
    console.log(`🔧 TODO: Implement the actual business logic for ${resourceName}`);
  }

  createApiTemplate(resourceName, methods) {
    const methodTemplates = {
      GET: `
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement ${resourceName} listing/retrieval logic
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // Placeholder response
    return NextResponse.json({
      success: true,
      data: [],
      message: '${resourceName} retrieved successfully'
    });
  } catch (error) {
    console.error('${resourceName} GET error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to retrieve ${resourceName}' } },
      { status: 500 }
    );
  }
}`,
      POST: `
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // TODO: Add input validation with Zod
    // TODO: Implement ${resourceName} creation logic
    
    // Placeholder response
    return NextResponse.json({
      success: true,
      data: { id: 'placeholder' },
      message: '${resourceName} created successfully'
    });
  } catch (error) {
    console.error('${resourceName} POST error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create ${resourceName}' } },
      { status: 500 }
    );
  }
}`
    };

    return `import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API Route: /api/${resourceName}
 * 
 * TODO: Add proper input validation with Zod
 * TODO: Add rate limiting
 * TODO: Add subscription checks if needed
 * TODO: Add comprehensive error handling
 * TODO: Add logging for audit trail
 */
${methods.map(method => methodTemplates[method] || '').join('\n')}`;
  }

  // List all TODO items across the codebase
  findTodos() {
    console.log('📋 TODO Items in Codebase\n');
    
    const searchDirs = ['app', 'lib', 'components'];
    let todoCount = 0;

    searchDirs.forEach(dir => {
      const dirPath = path.join(this.rootDir, dir);
      if (fs.existsSync(dirPath)) {
        this.searchTodosInDir(dirPath, '', (file, line, todo) => {
          console.log(`📝 ${file}:${line} - ${todo}`);
          todoCount++;
        });
      }
    });

    console.log(`\n📊 Total TODOs found: ${todoCount}`);
    
    if (todoCount > 0) {
      console.log('\n🎯 Priority TODOs based on Development Plan:');
      console.log('1. Complete Stripe webhook integration');
      console.log('2. Implement content generation APIs');
      console.log('3. Add bundle management APIs');
      console.log('4. Create affiliate link management');
    }
  }

  searchTodosInDir(dirPath, relativePath, callback) {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const relativeItemPath = path.join(relativePath, item);
      
      if (fs.statSync(itemPath).isDirectory()) {
        this.searchTodosInDir(itemPath, relativeItemPath, callback);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
        const content = fs.readFileSync(itemPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('TODO:') || line.includes('FIXME:') || line.includes('XXX:')) {
            callback(relativeItemPath, index + 1, line.trim());
          }
        });
      }
    });
  }

  // Create environment template
  createEnvTemplate() {
    const envPath = path.join(this.rootDir, '.env.example');
    
    const envTemplate = `# Omnipreneur AI Suite Environment Variables
# Copy this file to .env.local and fill in your actual values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/omnipreneur"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"

# Stripe (Test Mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AI Services
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."

# Email Service (Gmail/SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional: Redis (for caching)
REDIS_URL="redis://localhost:6379"

# Optional: Monitoring
SENTRY_DSN="https://..."

# Development
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="another-super-secret-key"
`;

    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Created .env.example template');
    console.log('🔧 Copy to .env.local and fill in your actual values');
  }

  // Quick database operations
  dbOperations() {
    console.log('🗄️ Database Operations\n');
    
    console.log('🔄 Available commands:');
    console.log('  npx prisma generate     - Generate Prisma client');
    console.log('  npx prisma db push      - Push schema to database');
    console.log('  npx prisma db pull      - Pull schema from database');
    console.log('  npx prisma studio       - Open Prisma Studio');
    console.log('  npx prisma migrate dev  - Create and apply migration');
    
    console.log('\n📊 Current schema includes:');
    console.log('  ✅ User management (authentication, profiles)');
    console.log('  ✅ Subscription system (Stripe integration)');
    console.log('  ✅ Content management (pieces, categories)');
    console.log('  ✅ Bundle system (products, templates)');
    console.log('  ✅ Affiliate tracking (links, clicks, commissions)');
    console.log('  ✅ Analytics (events, usage, performance)');
  }

  // Show development priorities
  showPriorities() {
    console.log('🎯 Development Priorities for Claude Code\n');
    
    console.log('📊 Current Status: Phase 1 - Core API Development (40%)');
    console.log('🎯 Target: Complete Phase 1 by Aug 15, 2025\n');
    
    console.log('🔥 IMMEDIATE PRIORITIES (This Week):');
    console.log('1. ⚡ Complete Stripe webhook integration');
    console.log('   - File: app/api/payments/webhooks/route.ts');
    console.log('   - Handle payment_intent.succeeded events');
    console.log('   - Update subscription status in database');
    
    console.log('\n2. 🤖 Implement content generation APIs');
    console.log('   - File: app/api/content/generate/route.ts');
    console.log('   - Integrate with OpenAI/Claude APIs');
    console.log('   - Add usage tracking and limits');
    
    console.log('\n3. 📦 Start bundle management APIs');
    console.log('   - File: app/api/bundles/create/route.ts');
    console.log('   - Bundle creation with AI-generated descriptions');
    console.log('   - Template system for different bundle types');
    
    console.log('\n📋 NEXT WEEK PRIORITIES:');
    console.log('4. 🔗 Affiliate link management system');
    console.log('5. 📈 Enhanced analytics and reporting');
    console.log('6. 👤 User dashboard backend APIs');
    
    console.log('\n💡 DEVELOPMENT TIPS:');
    console.log('- Use existing auth middleware: requireAuth()');
    console.log('- Follow error response format in coding standards');
    console.log('- Test each endpoint before moving to next');
    console.log('- Update progress tracker after major milestones');
    console.log('- All APIs should include proper TypeScript types');
  }
}

// CLI Interface
const command = process.argv[2];
const helper = new DevHelper();

switch (command) {
  case 'status':
    helper.checkStatus();
    break;
  case 'generate-api':
    const resourceName = process.argv[3];
    if (!resourceName) {
      console.log('Usage: node dev-helpers.js generate-api <resource-name>');
      process.exit(1);
    }
    helper.generateApiEndpoint(resourceName);
    break;
  case 'todos':
    helper.findTodos();
    break;
  case 'env':
    helper.createEnvTemplate();
    break;
  case 'db':
    helper.dbOperations();
    break;
  case 'priorities':
    helper.showPriorities();
    break;
  default:
    console.log('🚀 Omnipreneur AI Suite - Development Helper\n');
    console.log('Available commands:');
    console.log('  node dev-helpers.js status      - Check project status');
    console.log('  node dev-helpers.js generate-api <name> - Generate API endpoint template');
    console.log('  node dev-helpers.js todos       - Find all TODO items');
    console.log('  node dev-helpers.js env         - Create .env.example template');
    console.log('  node dev-helpers.js db          - Database operations guide');
    console.log('  node dev-helpers.js priorities  - Show development priorities');
    console.log('\n🎯 Quick start: node dev-helpers.js priorities');
}