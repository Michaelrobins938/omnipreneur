#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPSetup {
  constructor() {
    this.colors = {
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      reset: '\x1b[0m',
      bold: '\x1b[1m'
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  logHeader(message) {
    console.log(`\n${this.colors.bold}${this.colors.blue}${'='.repeat(50)}`);
    console.log(`${message}`);
    console.log(`${'='.repeat(50)}${this.colors.reset}\n`);
  }

  async installPackage(packageName, global = false) {
    try {
      const installCommand = global ? `npm install -g ${packageName}` : `npm install ${packageName}`;
      this.log(`Installing ${packageName}...`, 'blue');
      execSync(installCommand, { stdio: 'inherit' });
      this.log(`✅ ${packageName} installed successfully`, 'green');
      return true;
    } catch (error) {
      this.log(`❌ Failed to install ${packageName}: ${error.message}`, 'red');
      return false;
    }
  }

  async installMCPServers() {
    this.logHeader('Installing MCP Servers');
    
    const mcpPackages = [
      '@modelcontextprotocol/server-filesystem',
      '@modelcontextprotocol/server-sequential-thinking',
      'mcp-server-code-runner',
      '@notionhq/notion-mcp-server'
    ];

    for (const pkg of mcpPackages) {
      await this.installPackage(pkg, true);
    }
  }

  async installDevelopmentTools() {
    this.logHeader('Installing Development Tools');
    
    const devTools = [
      'typescript',
      'eslint',
      'prettier',
      'jest',
      'cypress'
    ];

    for (const tool of devTools) {
      await this.installPackage(tool, true);
    }
  }

  async installCLITools() {
    this.logHeader('Installing CLI Tools');
    
    const cliTools = [
      'vercel',
      'heroku',
      'stripe'
    ];

    for (const tool of cliTools) {
      await this.installPackage(tool, true);
    }
  }

  createEnvTemplate() {
    this.logHeader('Creating Environment Variables Template');
    
    const envTemplate = `# MCP Server Environment Variables
# Copy this to .env file and fill in your actual values

# Notion API
NOTION_TOKEN=your_notion_integration_token_here

# Vercel
VERCEL_TOKEN=your_vercel_token_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Sentry
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
SENTRY_ORG=your_sentry_org_here
SENTRY_PROJECT=your_sentry_project_here

# Heroku
HEROKU_API_KEY=your_heroku_api_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Figma
FIGMA_ACCESS_TOKEN=your_figma_access_token_here

# Resend (Email)
RESEND_API_KEY=your_resend_api_key_here

# Database
DATABASE_URL=your_database_url_here

# AWS
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_DEFAULT_REGION=your_aws_region_here

# Google PageSpeed
GOOGLE_PAGESPEED_API_KEY=your_google_pagespeed_api_key_here

# Snyk
SNYK_TOKEN=your_snyk_token_here

# SonarQube
SONAR_TOKEN=your_sonarqube_token_here

# CloudFront
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id_here

# Redis
REDIS_URL=your_redis_url_here

# PGPASSWORD (for PostgreSQL)
PGPASSWORD=your_postgres_password_here
`;

    const envPath = path.join(process.cwd(), '.env.example');
    fs.writeFileSync(envPath, envTemplate);
    this.log(`✅ Environment template created: ${envPath}`, 'green');
    this.log('📝 Please copy this to .env and fill in your actual values', 'yellow');
  }

  createSetupInstructions() {
    this.logHeader('Setup Instructions');
    
    const instructions = `
# MCP Server Setup Instructions

## 1. Environment Variables
- Copy .env.example to .env
- Fill in your actual API keys and tokens
- Never commit .env to version control

## 2. Verify Installation
Run the verification script:
\`\`\`bash
node mcp-verification.js
\`\`\`

## 3. Test Functionality
Run the test script:
\`\`\`bash
node test-mcp-servers.js
\`\`\`

## 4. Required API Keys

### Notion
1. Go to https://www.notion.so/my-integrations
2. Create a new integration
3. Copy the Internal Integration Token
4. Add to NOTION_TOKEN in .env

### Vercel
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy the token
4. Add to VERCEL_TOKEN in .env

### Stripe
1. Go to https://dashboard.stripe.com/apikeys
2. Copy the Secret key
3. Add to STRIPE_SECRET_KEY in .env

### Sentry
1. Go to https://sentry.io/settings/account/api/auth-tokens/
2. Create a new token
3. Add to SENTRY_AUTH_TOKEN in .env

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to OPENAI_API_KEY in .env

## 5. Testing Your Setup

After setting up environment variables, run:
\`\`\`bash
node test-mcp-servers.js
\`\`\`

This will test all your MCP servers and external integrations.

## 6. Troubleshooting

If you encounter issues:
1. Check that all packages are installed: \`npm list -g\`
2. Verify environment variables are set: \`echo $NOTION_TOKEN\`
3. Test individual services using the verification script
4. Check the detailed reports generated by the test scripts
`;

    const instructionsPath = path.join(process.cwd(), 'MCP_SETUP_INSTRUCTIONS.md');
    fs.writeFileSync(instructionsPath, instructions);
    this.log(`✅ Setup instructions created: ${instructionsPath}`, 'green');
  }

  async runSetup() {
    this.logHeader('MCP Server Setup');
    
    try {
      await this.installMCPServers();
      await this.installDevelopmentTools();
      await this.installCLITools();
      this.createEnvTemplate();
      this.createSetupInstructions();
      
      this.logHeader('Setup Complete!');
      this.log('✅ MCP servers have been installed', 'green');
      this.log('📝 Please configure your environment variables', 'yellow');
      this.log('🧪 Run the test scripts to verify everything works', 'blue');
      
    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, 'red');
    }
  }
}

// Run setup
const setup = new MCPSetup();
setup.runSetup().catch(console.error); 