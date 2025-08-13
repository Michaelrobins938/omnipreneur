#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class MCPVerifier {
  constructor() {
    this.results = {
      packages: {},
      envVars: {},
      functionality: {},
      services: {}
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logHeader(message) {
    console.log(`\n${colors.bold}${colors.blue}${'='.repeat(50)}`);
    console.log(`${message}`);
    console.log(`${'='.repeat(50)}${colors.reset}\n`);
  }

  async checkPackage(packageName, command = null) {
    try {
      const testCommand = command || `npx ${packageName} --version`;
      execSync(testCommand, { stdio: 'pipe' });
      this.results.packages[packageName] = { status: '✅ Installed', command: testCommand };
      this.log(`✅ ${packageName} - Installed`, 'green');
      return true;
    } catch (error) {
      this.results.packages[packageName] = { status: '❌ Not installed', error: error.message };
      this.log(`❌ ${packageName} - Not installed`, 'red');
      return false;
    }
  }

  checkEnvironmentVariable(varName) {
    const value = process.env[varName];
    if (value) {
      this.results.envVars[varName] = { status: '✅ Set', value: value.substring(0, 10) + '...' };
      this.log(`✅ ${varName} - Set`, 'green');
      return true;
    } else {
      this.results.envVars[varName] = { status: '❌ Not set' };
      this.log(`❌ ${varName} - Not set`, 'red');
      return false;
    }
  }

  async testServiceConnection(serviceName, testFunction) {
    try {
      await testFunction();
      this.results.services[serviceName] = { status: '✅ Connected' };
      this.log(`✅ ${serviceName} - Connected`, 'green');
      return true;
    } catch (error) {
      this.results.services[serviceName] = { status: '❌ Connection failed', error: error.message };
      this.log(`❌ ${serviceName} - Connection failed: ${error.message}`, 'red');
      return false;
    }
  }

  async runVerification() {
    this.logHeader('MCP Server Verification Tool');
    
    // Check core MCP packages
    this.logHeader('1. Core MCP Packages');
    await this.checkPackage('@modelcontextprotocol/server-filesystem');
    await this.checkPackage('@modelcontextprotocol/server-sequential-thinking');
    await this.checkPackage('mcp-server-code-runner');
    await this.checkPackage('@notionhq/notion-mcp-server');

    // Check development tools
    this.logHeader('2. Development Tools');
    await this.checkPackage('typescript', 'tsc --version');
    await this.checkPackage('eslint', 'eslint --version');
    await this.checkPackage('prettier', 'prettier --version');
    await this.checkPackage('jest', 'jest --version');
    await this.checkPackage('cypress', 'cypress --version');

    // Check CLI tools
    this.logHeader('3. CLI Tools');
    await this.checkPackage('git', 'git --version');
    await this.checkPackage('npm', 'npm --version');
    await this.checkPackage('vercel', 'vercel --version');
    await this.checkPackage('heroku', 'heroku --version');
    await this.checkPackage('aws', 'aws --version');
    await this.checkPackage('stripe', 'stripe --version');

    // Check environment variables
    this.logHeader('4. Environment Variables');
    const requiredEnvVars = [
      'NOTION_TOKEN',
      'VERCEL_TOKEN',
      'STRIPE_SECRET_KEY',
      'SENTRY_AUTH_TOKEN',
      'HEROKU_API_KEY',
      'OPENAI_API_KEY',
      'FIGMA_ACCESS_TOKEN',
      'RESEND_API_KEY',
      'DATABASE_URL',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_DEFAULT_REGION'
    ];

    requiredEnvVars.forEach(varName => {
      this.checkEnvironmentVariable(varName);
    });

    // Test service connections
    this.logHeader('5. Service Connections');
    
    // Test Notion connection
    await this.testServiceConnection('Notion', async () => {
      if (process.env.NOTION_TOKEN) {
        const response = await fetch('https://api.notion.com/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28'
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        throw new Error('NOTION_TOKEN not set');
      }
    });

    // Test Vercel connection
    await this.testServiceConnection('Vercel', async () => {
      if (process.env.VERCEL_TOKEN) {
        const response = await fetch('https://api.vercel.com/v1/user', {
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        throw new Error('VERCEL_TOKEN not set');
      }
    });

    // Test Stripe connection
    await this.testServiceConnection('Stripe', async () => {
      if (process.env.STRIPE_SECRET_KEY) {
        const response = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        throw new Error('STRIPE_SECRET_KEY not set');
      }
    });

    // Generate report
    this.generateReport();
  }

  generateReport() {
    this.logHeader('6. Verification Report');
    
    const totalPackages = Object.keys(this.results.packages).length;
    const installedPackages = Object.values(this.results.packages).filter(p => p.status.includes('✅')).length;
    
    const totalEnvVars = Object.keys(this.results.envVars).length;
    const setEnvVars = Object.values(this.results.envVars).filter(e => e.status.includes('✅')).length;
    
    const totalServices = Object.keys(this.results.services).length;
    const connectedServices = Object.values(this.results.services).filter(s => s.status.includes('✅')).length;

    this.log(`📦 Packages: ${installedPackages}/${totalPackages} installed`, installedPackages === totalPackages ? 'green' : 'yellow');
    this.log(`🔧 Environment Variables: ${setEnvVars}/${totalEnvVars} set`, setEnvVars === totalEnvVars ? 'green' : 'yellow');
    this.log(`🌐 Services: ${connectedServices}/${totalServices} connected`, connectedServices === totalServices ? 'green' : 'yellow');

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'mcp-verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'blue');

    // Provide next steps
    this.logHeader('7. Next Steps');
    if (installedPackages < totalPackages) {
      this.log('To install missing packages:', 'yellow');
      this.log('npm install -g @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-sequential-thinking mcp-server-code-runner @notionhq/notion-mcp-server', 'blue');
    }
    
    if (setEnvVars < totalEnvVars) {
      this.log('To set environment variables:', 'yellow');
      this.log('Create a .env file with the required variables or set them in your system', 'blue');
    }
  }
}

// Run verification
const verifier = new MCPVerifier();
verifier.runVerification().catch(console.error); 