#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPToolsTester {
  constructor() {
    this.colors = {
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      reset: '\x1b[0m',
      bold: '\x1b[1m'
    };
    this.results = {};
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  logHeader(message) {
    console.log(`\n${this.colors.bold}${this.colors.blue}${'='.repeat(60)}`);
    console.log(`${message}`);
    console.log(`${'='.repeat(60)}${this.colors.reset}\n`);
  }

  async testTool(name, command, expectedOutput = null) {
    try {
      this.log(`🧪 Testing ${name}...`, 'blue');
      const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
      this.results[name] = { status: '✅ Working', version: result.trim() };
      this.log(`✅ ${name} - ${result.trim()}`, 'green');
      return true;
    } catch (error) {
      this.results[name] = { status: '❌ Failed', error: error.message };
      this.log(`❌ ${name} - ${error.message}`, 'red');
      return false;
    }
  }

  async testDevelopmentTools() {
    this.logHeader('Testing Development Tools');
    
    const devTools = [
      { name: 'TypeScript', command: 'tsc --version' },
      { name: 'ESLint', command: 'eslint --version' },
      { name: 'Prettier', command: 'prettier --version' },
      { name: 'Jest', command: 'jest --version' },
      { name: 'Cypress', command: 'cypress --version' },
      { name: 'TypeScript Language Server', command: 'typescript-language-server --version' }
    ];

    for (const tool of devTools) {
      await this.testTool(tool.name, tool.command);
    }
  }

  async testTestingTools() {
    this.logHeader('Testing Testing & Quality Tools');
    
    const testingTools = [
      { name: 'Lighthouse', command: 'lighthouse --version' },
      { name: 'Pa11y', command: 'pa11y --version' },
      { name: 'Snyk', command: 'snyk --version' },
      { name: 'Artillery', command: 'artillery --version' },
      { name: 'Axe-core', command: 'axe-core --version' },
      { name: 'SonarQube Scanner', command: 'sonar-scanner --version' }
    ];

    for (const tool of testingTools) {
      await this.testTool(tool.name, tool.command);
    }
  }

  async testMCPPackages() {
    this.logHeader('Testing MCP Packages');
    
    const mcpPackages = [
      { name: 'Filesystem MCP', command: 'npx @modelcontextprotocol/server-filesystem --version' },
      { name: 'Sequential Thinking MCP', command: 'npx @modelcontextprotocol/server-sequential-thinking --version' },
      { name: 'Code Runner MCP', command: 'npx mcp-server-code-runner --version' },
      { name: 'Notion MCP', command: 'npx @notionhq/notion-mcp-server --version' },
      { name: 'Heroku MCP', command: 'npx @heroku/mcp-server --version' },
      { name: 'Sentry MCP', command: 'npx @sentry/mcp-server --version' }
    ];

    for (const pkg of mcpPackages) {
      await this.testTool(pkg.name, pkg.command);
    }
  }

  async testInfrastructureTools() {
    this.logHeader('Testing Infrastructure Tools');
    
    const infraTools = [
      { name: 'Git', command: 'git --version' },
      { name: 'npm', command: 'npm --version' },
      { name: 'Vercel', command: 'vercel --version' },
      { name: 'Docker', command: 'docker --version' },
      { name: 'PostgreSQL', command: 'psql --version' },
      { name: 'Redis', command: 'redis-cli --version' }
    ];

    for (const tool of infraTools) {
      await this.testTool(tool.name, tool.command);
    }
  }

  generateReport() {
    this.logHeader('Comprehensive MCP Tools Test Report');
    
    const categories = {
      'Development Tools': ['TypeScript', 'ESLint', 'Prettier', 'Jest', 'Cypress', 'TypeScript Language Server'],
      'Testing & Quality Tools': ['Lighthouse', 'Pa11y', 'Snyk', 'Artillery', 'Axe-core', 'SonarQube Scanner'],
      'MCP Packages': ['Filesystem MCP', 'Sequential Thinking MCP', 'Code Runner MCP', 'Notion MCP', 'Heroku MCP', 'Sentry MCP'],
      'Infrastructure Tools': ['Git', 'npm', 'Vercel', 'Docker', 'PostgreSQL', 'Redis']
    };

    let totalTools = 0;
    let workingTools = 0;

    for (const [category, tools] of Object.entries(categories)) {
      this.log(`\n${category}:`, 'bold');
      let categoryWorking = 0;
      
      for (const tool of tools) {
        const result = this.results[tool];
        if (result) {
          totalTools++;
          if (result.status.includes('✅')) {
            categoryWorking++;
            workingTools++;
          }
          this.log(`  ${result.status} ${tool} ${result.version ? `- ${result.version}` : ''}`);
        }
      }
      
      this.log(`  📊 ${categoryWorking}/${tools.length} working`, categoryWorking === tools.length ? 'green' : 'yellow');
    }

    this.log(`\n${'='.repeat(60)}`, 'blue');
    this.log(`📊 OVERALL STATUS: ${workingTools}/${totalTools} tools working`, workingTools === totalTools ? 'green' : 'yellow');
    this.log(`🎯 Success Rate: ${Math.round((workingTools / totalTools) * 100)}%`, 'bold');

    // Save detailed results
    const reportPath = path.join(process.cwd(), 'mcp-tools-test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    this.log(`\n📄 Detailed results saved to: ${reportPath}`, 'blue');
  }

  async runAllTests() {
    this.logHeader('🚀 Starting Comprehensive MCP Tools Test');
    
    await this.testDevelopmentTools();
    await this.testTestingTools();
    await this.testMCPPackages();
    await this.testInfrastructureTools();
    
    this.generateReport();
  }
}

// Run tests
const tester = new MCPToolsTester();
tester.runAllTests().catch(console.error); 