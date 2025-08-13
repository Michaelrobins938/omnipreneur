/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // Use different environments for different test files
  testEnvironmentOptions: {
    url: 'http://localhost'
  },
  
  // Projects configuration for different test types
  projects: [
    {
      displayName: 'API Tests',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/__tests__/api/**/*.(test|spec).(js|jsx|ts|tsx)',
        '<rootDir>/__tests__/lib/**/*.(test|spec).(js|jsx|ts|tsx)',
        '<rootDir>/__tests__/integration/**/*.(test|spec).(js|jsx|ts|tsx)'
      ]
    },
    {
      displayName: 'Component Tests',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/__tests__/components/**/*.(test|spec).(js|jsx|ts|tsx)'
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.components.js']
    }
  ],
  
  // Test patterns
  testMatch: [
    '<rootDir>/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/app/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/lib/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  
  // Coverage settings
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'middleware/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!next.config.js'
  ],
  
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1'
  },

  // Ignore patterns to avoid haste map collisions
  modulePathIgnorePatterns: [
    '<rootDir>/affiliate_portal_complete/',
    '<rootDir>/content_spawner_complete/',
    '<rootDir>/live-dashboard/',
    '<rootDir>/taskflow-ai/',
    '<rootDir>/organized/',
    '<rootDir>/bundle_builder_complete/',
    '<rootDir>/live-dashboard-app/',
    '<rootDir>/landing-page/',
    '<rootDir>/bundle-builder/',
    '<rootDir>/auto-niche-engine/'
  ],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Setup files
  setupFiles: ['<rootDir>/jest.env.js'],
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Global test variables
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  
  // Maximum worker processes
  maxWorkers: '50%',
  
  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Reporters
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/html-report',
      filename: 'report.html',
      expand: true
    }],
    ['jest-junit', {
      outputDirectory: './coverage',
      outputName: 'junit.xml'
    }]
  ],
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)