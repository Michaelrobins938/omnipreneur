// @ts-nocheck
/**
 * Mobile Optimization Testing Script
 * 
 * This script tests the application on various mobile devices and screen sizes
 * to ensure proper responsive design and touch interactions.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Mobile device configurations
const MOBILE_DEVICES = [
  {
    name: 'iPhone 12 Pro',
    viewport: { width: 390, height: 844, deviceScaleFactor: 3 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPhone SE',
    viewport: { width: 375, height: 667, deviceScaleFactor: 2 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Samsung Galaxy S21',
    viewport: { width: 384, height: 854, deviceScaleFactor: 2.8 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
  },
  {
    name: 'iPad Pro',
    viewport: { width: 1024, height: 1366, deviceScaleFactor: 2 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Samsung Galaxy Tab',
    viewport: { width: 768, height: 1024, deviceScaleFactor: 2 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
  }
];

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Homepage Load',
    path: '/',
    tests: ['viewport', 'touch-targets', 'font-sizes', 'image-scaling']
  },
  {
    name: 'Dashboard Navigation',
    path: '/dashboard',
    tests: ['navigation', 'sidebar', 'responsive-cards', 'touch-targets']
  },
  {
    name: 'AI Chat Interface',
    path: '/dashboard', // Assuming chat is on dashboard
    tests: ['chat-input', 'message-display', 'touch-interactions', 'keyboard-handling']
  },
  {
    name: 'Analytics Dashboard',
    path: '/dashboard',
    tests: ['chart-responsiveness', 'data-tables', 'filters', 'touch-interactions']
  },
  {
    name: 'Forms and Input',
    path: '/contact',
    tests: ['form-fields', 'validation', 'touch-targets', 'keyboard-interactions']
  }
];

class MobileTester {
  constructor() {
    this.browser = null;
    this.results = {
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      deviceResults: {},
      issues: []
    };
  }

  async init() {
    console.log('🚀 Starting Mobile Optimization Testing...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      devtools: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async runAllTests() {
    await this.init();

    try {
      for (const device of MOBILE_DEVICES) {
        console.log(`\n📱 Testing on ${device.name}...`);
        this.results.deviceResults[device.name] = await this.testDevice(device);
      }

      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Testing failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async testDevice(device) {
    const page = await this.browser.newPage();
    const deviceResults = {
      device: device.name,
      scenarios: {},
      overallScore: 0,
      issues: []
    };

    try {
      // Set device viewport and user agent
      await page.setViewport(device.viewport);
      await page.setUserAgent(device.userAgent);

      // Enable mobile emulation
      const session = await page.target().createCDPSession();
      await session.send('Emulation.setDeviceMetricsOverride', {
        mobile: true,
        width: device.viewport.width,
        height: device.viewport.height,
        deviceScaleFactor: device.viewport.deviceScaleFactor,
        screenOrientation: { angle: 0, type: 'portraitPrimary' }
      });

      // Run tests for each scenario
      for (const scenario of TEST_SCENARIOS) {
        console.log(`  📋 Testing: ${scenario.name}`);
        deviceResults.scenarios[scenario.name] = await this.testScenario(page, scenario, device);
      }

      // Calculate overall score
      const scenarioScores = Object.values(deviceResults.scenarios);
      deviceResults.overallScore = scenarioScores.reduce((sum, s) => sum + s.score, 0) / scenarioScores.length;

    } catch (error) {
      console.error(`❌ Device testing failed for ${device.name}:`, error);
      deviceResults.issues.push({
        type: 'error',
        message: `Device testing failed: ${error.message}`,
        critical: true
      });
    } finally {
      await page.close();
    }

    return deviceResults;
  }

  async testScenario(page, scenario, device) {
    const scenarioResult = {
      name: scenario.name,
      score: 0,
      tests: {},
      issues: []
    };

    try {
      // Navigate to the page
      const baseUrl = process.env.TEST_URL || 'http://localhost:3000';
      await page.goto(`${baseUrl}${scenario.path}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Run each test
      for (const testName of scenario.tests) {
        console.log(`    🔍 Running: ${testName}`);
        scenarioResult.tests[testName] = await this.runTest(page, testName, device);
      }

      // Calculate scenario score
      const testScores = Object.values(scenarioResult.tests);
      scenarioResult.score = testScores.reduce((sum, t) => sum + t.score, 0) / testScores.length;

      // Collect issues
      scenarioResult.issues = testScores.flatMap(t => t.issues || []);

    } catch (error) {
      console.error(`❌ Scenario testing failed: ${scenario.name}`, error);
      scenarioResult.issues.push({
        type: 'error',
        message: `Scenario failed: ${error.message}`,
        critical: true
      });
    }

    return scenarioResult;
  }

  async runTest(page, testName, device) {
    const testResult = {
      name: testName,
      score: 0,
      passed: false,
      issues: []
    };

    try {
      switch (testName) {
        case 'viewport':
          await this.testViewport(page, testResult, device);
          break;
        case 'touch-targets':
          await this.testTouchTargets(page, testResult);
          break;
        case 'font-sizes':
          await this.testFontSizes(page, testResult);
          break;
        case 'image-scaling':
          await this.testImageScaling(page, testResult);
          break;
        case 'navigation':
          await this.testNavigation(page, testResult);
          break;
        case 'responsive-cards':
          await this.testResponsiveCards(page, testResult);
          break;
        case 'chat-input':
          await this.testChatInput(page, testResult);
          break;
        case 'form-fields':
          await this.testFormFields(page, testResult);
          break;
        default:
          testResult.score = 50; // Default score for unimplemented tests
      }
    } catch (error) {
      console.error(`❌ Test failed: ${testName}`, error);
      testResult.issues.push({
        type: 'error',
        message: `Test execution failed: ${error.message}`,
        critical: true
      });
    }

    return testResult;
  }

  async testViewport(page, result, device) {
    // Check if content fits within viewport
    const viewportWidth = device.viewport.width;
    const contentWidth = await page.evaluate(() => {
      return Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
      );
    });

    if (contentWidth <= viewportWidth + 10) { // Allow small tolerance
      result.score = 100;
      result.passed = true;
    } else {
      result.score = 30;
      result.issues.push({
        type: 'warning',
        message: `Content width (${contentWidth}px) exceeds viewport width (${viewportWidth}px)`,
        critical: false
      });
    }
  }

  async testTouchTargets(page, result) {
    // Check if interactive elements are large enough for touch
    const touchTargets = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]'));
      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          width: rect.width,
          height: rect.height,
          className: el.className,
          text: el.textContent?.slice(0, 30)
        };
      });
    });

    const minTouchSize = 44; // Apple's recommendation
    const smallTargets = touchTargets.filter(target => 
      target.width < minTouchSize || target.height < minTouchSize
    );

    if (smallTargets.length === 0) {
      result.score = 100;
      result.passed = true;
    } else {
      const ratio = (touchTargets.length - smallTargets.length) / touchTargets.length;
      result.score = Math.max(20, ratio * 100);
      
      result.issues.push({
        type: 'warning',
        message: `${smallTargets.length} touch targets are too small (< ${minTouchSize}px)`,
        critical: false,
        details: smallTargets.slice(0, 5) // Show first 5 examples
      });
    }
  }

  async testFontSizes(page, result) {
    // Check if text is readable on mobile
    const fontSizes = await page.evaluate(() => {
      const textElements = Array.from(document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, input, label'));
      return textElements
        .filter(el => el.textContent && el.textContent.trim().length > 0)
        .map(el => {
          const style = window.getComputedStyle(el);
          return {
            fontSize: parseFloat(style.fontSize),
            tag: el.tagName,
            text: el.textContent?.slice(0, 20)
          };
        });
    });

    const minFontSize = 16; // Recommended minimum for mobile
    const smallText = fontSizes.filter(item => item.fontSize < minFontSize);

    if (smallText.length === 0) {
      result.score = 100;
      result.passed = true;
    } else {
      const ratio = (fontSizes.length - smallText.length) / fontSizes.length;
      result.score = Math.max(30, ratio * 100);
      
      result.issues.push({
        type: 'warning',
        message: `${smallText.length} text elements have font size < ${minFontSize}px`,
        critical: false
      });
    }
  }

  async testImageScaling(page, result) {
    // Check if images scale properly
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => {
        const rect = img.getBoundingClientRect();
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: rect.width,
          displayHeight: rect.height,
          hasMaxWidth: window.getComputedStyle(img).maxWidth !== 'none'
        };
      });
    });

    const properlyScaledImages = images.filter(img => 
      img.hasMaxWidth || img.displayWidth <= img.naturalWidth
    );

    if (images.length === 0 || properlyScaledImages.length === images.length) {
      result.score = 100;
      result.passed = true;
    } else {
      const ratio = properlyScaledImages.length / images.length;
      result.score = Math.max(40, ratio * 100);
      
      result.issues.push({
        type: 'warning',
        message: `${images.length - properlyScaledImages.length} images may not scale properly on mobile`,
        critical: false
      });
    }
  }

  async testNavigation(page, result) {
    // Test mobile navigation functionality
    try {
      // Look for mobile menu button
      const mobileMenuButton = await page.$('[aria-label*="menu"], .mobile-menu, .hamburger, [data-mobile-menu]');
      
      if (!mobileMenuButton) {
        result.score = 50;
        result.issues.push({
          type: 'info',
          message: 'No mobile menu button found - navigation may not be optimized for mobile',
          critical: false
        });
        return;
      }

      // Test menu toggle
      await mobileMenuButton.click();
      await page.waitForTimeout(500);

      // Check if menu is visible
      const menuVisible = await page.evaluate(() => {
        const menu = document.querySelector('.mobile-menu, [data-mobile-menu], .nav-menu');
        return menu && window.getComputedStyle(menu).display !== 'none';
      });

      if (menuVisible) {
        result.score = 100;
        result.passed = true;
      } else {
        result.score = 30;
        result.issues.push({
          type: 'warning',
          message: 'Mobile menu button found but menu does not appear to open',
          critical: true
        });
      }

    } catch (error) {
      result.score = 20;
      result.issues.push({
        type: 'error',
        message: 'Failed to test mobile navigation',
        critical: true
      });
    }
  }

  async testResponsiveCards(page, result) {
    // Test if cards/components respond properly to screen size
    const cards = await page.evaluate(() => {
      const cardElements = Array.from(document.querySelectorAll('.card, [class*="card"], .dashboard-card, .widget'));
      return cardElements.map(card => {
        const rect = card.getBoundingClientRect();
        const style = window.getComputedStyle(card);
        return {
          width: rect.width,
          padding: style.padding,
          margin: style.margin,
          flexBasis: style.flexBasis,
          gridColumn: style.gridColumn
        };
      });
    });

    // Simple check - cards should not be too wide for mobile
    const viewportWidth = await page.viewport().width;
    const appropriateCards = cards.filter(card => card.width <= viewportWidth * 0.95);

    if (cards.length === 0) {
      result.score = 80; // No cards found, assume OK
      result.passed = true;
    } else if (appropriateCards.length === cards.length) {
      result.score = 100;
      result.passed = true;
    } else {
      const ratio = appropriateCards.length / cards.length;
      result.score = Math.max(30, ratio * 100);
      
      result.issues.push({
        type: 'warning',
        message: `${cards.length - appropriateCards.length} cards may be too wide for mobile`,
        critical: false
      });
    }
  }

  async testChatInput(page, result) {
    // Test chat interface on mobile
    try {
      const chatInput = await page.$('textarea[placeholder*="Ask"], input[placeholder*="chat"], .chat-input');
      
      if (!chatInput) {
        result.score = 50;
        result.issues.push({
          type: 'info',
          message: 'No chat input found on this page',
          critical: false
        });
        return;
      }

      // Test input responsiveness
      const inputRect = await chatInput.boundingBox();
      const viewportWidth = page.viewport().width;
      
      if (inputRect.width > viewportWidth * 0.9) {
        result.score = 30;
        result.issues.push({
          type: 'warning',
          message: 'Chat input appears too wide for mobile viewport',
          critical: false
        });
      } else {
        result.score = 100;
        result.passed = true;
      }

    } catch (error) {
      result.score = 20;
      result.issues.push({
        type: 'error',
        message: 'Failed to test chat input',
        critical: true
      });
    }
  }

  async testFormFields(page, result) {
    // Test form field usability on mobile
    const formFields = await page.evaluate(() => {
      const fields = Array.from(document.querySelectorAll('input, textarea, select'));
      return fields.map(field => {
        const rect = field.getBoundingClientRect();
        const style = window.getComputedStyle(field);
        return {
          type: field.type,
          width: rect.width,
          height: rect.height,
          padding: style.padding,
          fontSize: parseFloat(style.fontSize)
        };
      });
    });

    if (formFields.length === 0) {
      result.score = 80; // No forms found
      result.passed = true;
      return;
    }

    // Check field sizes
    const minHeight = 44; // Touch-friendly height
    const minFontSize = 16; // Prevents zoom on iOS
    
    const goodFields = formFields.filter(field => 
      field.height >= minHeight && field.fontSize >= minFontSize
    );

    if (goodFields.length === formFields.length) {
      result.score = 100;
      result.passed = true;
    } else {
      const ratio = goodFields.length / formFields.length;
      result.score = Math.max(30, ratio * 100);
      
      result.issues.push({
        type: 'warning',
        message: `${formFields.length - goodFields.length} form fields may not be touch-friendly`,
        critical: false
      });
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateSummary(),
      deviceResults: this.results.deviceResults,
      recommendations: this.generateRecommendations()
    };

    // Save to file
    const reportPath = path.join(__dirname, '../reports/mobile-test-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Generate HTML report
    await this.generateHTMLReport(report);

    console.log('\n📊 Mobile Testing Complete!');
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`🌐 HTML report: ${reportPath.replace('.json', '.html')}`);
    
    this.printSummary(report.summary);
  }

  calculateSummary() {
    const deviceScores = Object.values(this.results.deviceResults);
    const overallScore = deviceScores.reduce((sum, device) => sum + device.overallScore, 0) / deviceScores.length;
    
    const allIssues = deviceScores.flatMap(device => 
      Object.values(device.scenarios).flatMap(scenario => scenario.issues)
    );

    return {
      overallScore: Math.round(overallScore),
      devicesTestedTotal: deviceScores.length,
      criticalIssues: allIssues.filter(issue => issue.critical).length,
      warnings: allIssues.filter(issue => !issue.critical).length,
      recommendations: this.generateRecommendations().length
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const deviceResults = Object.values(this.results.deviceResults);
    
    // Analyze common issues across devices
    const allIssues = deviceResults.flatMap(device => 
      Object.values(device.scenarios).flatMap(scenario => scenario.issues)
    );

    // Group issues by type
    const issueTypes = {};
    allIssues.forEach(issue => {
      if (!issueTypes[issue.message]) {
        issueTypes[issue.message] = 0;
      }
      issueTypes[issue.message]++;
    });

    // Generate recommendations for common issues
    Object.entries(issueTypes).forEach(([message, count]) => {
      if (count >= 2) { // Issue appears on multiple devices
        recommendations.push({
          priority: count >= 4 ? 'high' : 'medium',
          issue: message,
          affectedDevices: count,
          suggestion: this.getRecommendationForIssue(message)
        });
      }
    });

    return recommendations;
  }

  getRecommendationForIssue(issueMessage) {
    const recommendations = {
      'touch targets are too small': 'Increase button and link sizes to at least 44x44px',
      'font size': 'Use minimum 16px font size for body text on mobile',
      'content width exceeds viewport': 'Implement responsive design with max-width: 100%',
      'images may not scale properly': 'Add max-width: 100% and height: auto to images',
      'Mobile menu button': 'Implement a mobile-friendly navigation menu',
      'form fields may not be touch-friendly': 'Increase form field height and font size'
    };

    for (const [key, suggestion] of Object.entries(recommendations)) {
      if (issueMessage.toLowerCase().includes(key.toLowerCase())) {
        return suggestion;
      }
    }

    return 'Review the specific issue and implement mobile-friendly improvements';
  }

  async generateHTMLReport(report) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Optimization Test Report</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 20px; line-height: 1.6; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .score { font-size: 2em; font-weight: bold; color: ${this.getScoreColor(report.summary.overallScore)}; }
        .device-result { border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .scenario { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 4px; }
        .issue { padding: 5px 10px; margin: 5px 0; border-radius: 4px; }
        .issue.warning { background: #fff3cd; border-left: 4px solid #ffc107; }
        .issue.error { background: #f8d7da; border-left: 4px solid #dc3545; }
        .recommendation { background: #d1ecf1; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #17a2b8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mobile Optimization Test Report</h1>
        <p><strong>Generated:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
        <div class="score">Overall Score: ${report.summary.overallScore}/100</div>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <ul>
            <li><strong>Devices Tested:</strong> ${report.summary.devicesTestedTotal}</li>
            <li><strong>Critical Issues:</strong> ${report.summary.criticalIssues}</li>
            <li><strong>Warnings:</strong> ${report.summary.warnings}</li>
        </ul>
    </div>

    <div class="recommendations">
        <h2>Recommendations</h2>
        ${report.recommendations.map(rec => `
            <div class="recommendation">
                <strong>${rec.priority.toUpperCase()} PRIORITY:</strong> ${rec.suggestion}<br>
                <small>Issue: ${rec.issue} (affects ${rec.affectedDevices} devices)</small>
            </div>
        `).join('')}
    </div>

    <div class="device-results">
        <h2>Device Results</h2>
        ${Object.entries(report.deviceResults).map(([deviceName, device]) => `
            <div class="device-result">
                <h3>${deviceName} - Score: ${Math.round(device.overallScore)}/100</h3>
                ${Object.entries(device.scenarios).map(([scenarioName, scenario]) => `
                    <div class="scenario">
                        <h4>${scenarioName} - Score: ${Math.round(scenario.score)}/100</h4>
                        ${scenario.issues.map(issue => `
                            <div class="issue ${issue.critical ? 'error' : 'warning'}">
                                ${issue.message}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const htmlPath = path.join(__dirname, '../reports/mobile-test-report.html');
    await fs.writeFile(htmlPath, html);
  }

  getScoreColor(score) {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  }

  printSummary(summary) {
    console.log(`\n📊 Overall Score: ${summary.overallScore}/100`);
    console.log(`🔍 Devices Tested: ${summary.devicesTestedTotal}`);
    console.log(`❌ Critical Issues: ${summary.criticalIssues}`);
    console.log(`⚠️  Warnings: ${summary.warnings}`);
    console.log(`💡 Recommendations: ${summary.recommendations}`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MobileTester();
  tester.runAllTests().catch(console.error);
}

module.exports = { MobileTester };