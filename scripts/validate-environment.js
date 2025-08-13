#!/usr/bin/env node

// Environment validation script
const { validateEnvironment } = require('../lib/validation/api-validator.ts');

console.log('🔍 Validating environment configuration...\n');

const { isValid, errors, warnings } = validateEnvironment();

if (errors.length > 0) {
  console.log('❌ ERRORS (must be fixed):');
  errors.forEach(error => console.log(`  - ${error}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (recommended to fix):');
  warnings.forEach(warning => console.log(`  - ${warning}`));
  console.log('');
}

if (isValid) {
  console.log('✅ Environment validation passed!');
  console.log('All required environment variables are configured.');
} else {
  console.log('❌ Environment validation failed!');
  console.log('Please fix the errors above before deploying.');
  process.exit(1);
}

// Additional checks
console.log('\n🔧 Additional configuration checks:');

// Check database connection
console.log('📊 Database URL:', process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing');

// Check AI services
console.log('🤖 OpenAI API Key:', process.env.OPENAI_API_KEY ? '✅ Configured' : '⚠️  Missing');
console.log('🧠 Anthropic API Key:', process.env.ANTHROPIC_API_KEY ? '✅ Configured' : '⚠️  Missing');

// Check caching
console.log('⚡ Redis URL:', process.env.REDIS_URL ? '✅ Configured' : '⚠️  Missing (optional)');

// Check WebSocket
console.log('🔌 WebSocket Port:', process.env.WEBSOCKET_PORT || '3001', '(default: 3001)');

// Check security
console.log('🔐 JWT Secret:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');
console.log('🔑 NextAuth Secret:', process.env.NEXTAUTH_SECRET ? '✅ Configured' : '❌ Missing');

console.log('\n🚀 Environment validation complete!');

if (!isValid) {
  process.exit(1);
}