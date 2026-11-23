/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "node",
  collectCoverage: false,
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 85,
      functions: 85,
      lines: 85,
    },
  },
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/localRunner.js",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/coverage/**",
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/__test__/",
    "<rootDir>/.*.config.js$",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/__test__/mocks",
    "<rootDir>/__test__/utils",
  ],
  testMatch: [
    "**/__tests__/**/*.(mjs|js|ts)?",
    "**/?(*.)+(spec|test).(mjs|js|ts)?",
  ],
};

module.exports = config;
