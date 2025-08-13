// Jest environment setup
// This file runs before jest.setup.js and sets up environment variables

// Test environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// Authentication & Security
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.NEXTAUTH_SECRET = 'test-nextauth-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Database
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/omnipreneur_test'
process.env.REDIS_URL = 'redis://localhost:6379/1'

// AI Services (use test keys or mock services)
process.env.OPENAI_API_KEY = 'test-openai-key'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
process.env.GOOGLE_AI_API_KEY = 'test-google-ai-key'

// Email Services
process.env.SMTP_HOST = 'localhost'
process.env.SMTP_PORT = '1025'
process.env.SMTP_USER = 'test'
process.env.SMTP_PASS = 'test'
process.env.FROM_EMAIL = 'test@example.com'

// Payment Services
process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing'
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_fake_key_for_testing'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_webhook_secret'

// File Storage
process.env.AWS_ACCESS_KEY_ID = 'test-access-key'
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key'
process.env.AWS_REGION = 'us-east-1'
process.env.AWS_S3_BUCKET = 'test-bucket'

// External APIs
process.env.GOOGLE_ANALYTICS_ID = 'G-TEST123456'
process.env.SENTRY_DSN = 'https://test@sentry.io/test'

// Rate Limiting
process.env.RATE_LIMIT_ENABLED = 'false'
process.env.REDIS_RATE_LIMIT_URL = 'redis://localhost:6379/2'

// Feature Flags
process.env.FEATURE_REAL_TIME_ANALYTICS = 'true'
process.env.FEATURE_EMAIL_AUTOMATION = 'true'
process.env.FEATURE_FILE_UPLOAD = 'true'
process.env.FEATURE_BUNDLE_BUILDER = 'true'

// Testing Configuration
process.env.TEST_TIMEOUT = '30000'
process.env.TEST_DB_RESET = 'true'
process.env.MOCK_EXTERNAL_APIS = 'true'

// Disable certain features in tests
process.env.DISABLE_ANALYTICS = 'true'
process.env.DISABLE_TELEMETRY = 'true'
process.env.DISABLE_SENTRY = 'true'

// Logging
process.env.LOG_LEVEL = 'error' // Reduce log noise in tests