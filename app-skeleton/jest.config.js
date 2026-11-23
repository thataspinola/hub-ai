/** @type {import('jest').Config} */
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__test__/**/*.test.js', '<rootDir>/__test__/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/', '/__test__/mocks/', '/__test__/utils/'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: ['index.js', 'src/**/*.js', 'logger/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: { global: { statements: 90, branches: 90, functions: 90, lines: 90 } },
}
