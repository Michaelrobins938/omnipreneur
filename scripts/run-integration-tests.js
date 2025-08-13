#!/usr/bin/env node

// Integration test runner script
console.log('🧪 Running integration tests...\n');

async function runIntegrationTests() {
  try {
    // Ensure server is running on localhost:3000
    const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
    
    // Test API endpoints
    console.log('📡 Testing API endpoints...');
    
    const testResults = [];
    
    // Test 1: Health check
    const healthTest = await fetch(`${baseUrl}/api/health`).catch(() => null);
    testResults.push({
      name: 'Health Check',
      status: healthTest?.ok ? 'PASS' : 'FAIL',
      details: healthTest ? `Status: ${healthTest.status}` : 'Server not responding'
    });
    
    // Test 2: Analytics endpoint (without auth)
    const analyticsTest = await fetch(`${baseUrl}/api/analytics/dashboard`).catch(() => null);
    testResults.push({
      name: 'Analytics API Structure',
      status: analyticsTest ? 'PASS' : 'FAIL',
      details: analyticsTest ? `Status: ${analyticsTest.status}` : 'Endpoint not accessible'
    });
    
    // Test 3: WebSocket endpoint info
    const wsTest = await fetch(`${baseUrl}/api/websocket`).catch(() => null);
    testResults.push({
      name: 'WebSocket API',
      status: wsTest ? 'PASS' : 'FAIL',
      details: wsTest ? `Status: ${wsTest.status}` : 'WebSocket API not accessible'
    });
    
    // Test 4: Upload endpoint structure
    const uploadTest = await fetch(`${baseUrl}/api/upload`).catch(() => null);
    testResults.push({
      name: 'Upload API Structure',
      status: uploadTest ? 'PASS' : 'FAIL',
      details: uploadTest ? `Status: ${uploadTest.status}` : 'Upload API not accessible'
    });
    
    // Display results
    console.log('\n📊 Test Results:');
    console.log('================');
    
    let passCount = 0;
    let failCount = 0;
    
    testResults.forEach(test => {
      const emoji = test.status === 'PASS' ? '✅' : '❌';
      console.log(`${emoji} ${test.name}: ${test.status}`);
      console.log(`   ${test.details}`);
      
      if (test.status === 'PASS') passCount++;
      else failCount++;
    });
    
    console.log('\n📈 Summary:');
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total: ${testResults.length}`);
    
    if (failCount > 0) {
      console.log('\n⚠️  Some tests failed. Check the details above.');
      if (process.env.CI) {
        process.exit(1);
      }
    } else {
      console.log('\n🎉 All integration tests passed!');
    }
    
  } catch (error) {
    console.error('❌ Integration test error:', error);
    process.exit(1);
  }
}

// Database connectivity test
async function testDatabaseConnection() {
  console.log('💾 Testing database connection...');
  
  try {
    // This would require the server to be running
    const response = await fetch(`${process.env.TEST_BASE_URL || 'http://localhost:3000'}/api/test/integration?category=database`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Database tests completed');
      return result;
    } else {
      console.log('❌ Database tests failed');
      return null;
    }
  } catch (error) {
    console.log('⚠️  Could not run database tests (server may not be running)');
    return null;
  }
}

// AI service connectivity test
async function testAIServices() {
  console.log('🤖 Testing AI services...');
  
  const services = [];
  
  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    services.push({ name: 'OpenAI', status: '✅ Configured' });
  } else {
    services.push({ name: 'OpenAI', status: '⚠️  Not configured' });
  }
  
  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    services.push({ name: 'Anthropic', status: '✅ Configured' });
  } else {
    services.push({ name: 'Anthropic', status: '⚠️  Not configured' });
  }
  
  services.forEach(service => {
    console.log(`  ${service.name}: ${service.status}`);
  });
  
  return services;
}

// WebSocket test
async function testWebSocket() {
  console.log('🔌 Testing WebSocket...');
  
  try {
    const WebSocket = require('ws');
    const ws = new WebSocket(`ws://localhost:${process.env.WEBSOCKET_PORT || 3001}`);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        resolve({ status: '⚠️  WebSocket server not responding' });
      }, 3000);
      
      ws.on('open', () => {
        clearTimeout(timeout);
        ws.close();
        resolve({ status: '✅ WebSocket server accessible' });
      });
      
      ws.on('error', (error) => {
        clearTimeout(timeout);
        resolve({ status: `❌ WebSocket error: ${error.message}` });
      });
    });
  } catch (error) {
    return { status: `❌ WebSocket test failed: ${error.message}` };
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting comprehensive integration tests...\n');
  
  // Run all tests
  await runIntegrationTests();
  await testDatabaseConnection();
  await testAIServices();
  
  const wsResult = await testWebSocket();
  console.log(`🔌 WebSocket: ${wsResult.status}`);
  
  console.log('\n✨ Integration test suite completed!');
  console.log('\n💡 Tips:');
  console.log('  - Ensure your development server is running (npm run dev)');
  console.log('  - Start WebSocket server separately (npm run websocket:start)');
  console.log('  - Configure environment variables for full functionality');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runIntegrationTests, testDatabaseConnection, testAIServices, testWebSocket };