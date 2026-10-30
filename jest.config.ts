import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/app/api/**',
  ],

  coverageThreshold: { global: { branches: 90, functions: 90, lines: 90, statements: 90 } },

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Ignore dist/
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/tooling/web-code-reviewer/',
    '<rootDir>/resources/frontend/evaluations/',
    '<rootDir>/__tests__/e2e/',
    '<rootDir>/__tests__/config/',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
