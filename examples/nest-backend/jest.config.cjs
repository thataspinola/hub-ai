const project = (name, pattern) => ({
  displayName: name, testEnvironment: 'node', rootDir: __dirname,
  testMatch: [`<rootDir>/test/${pattern}`],
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  clearMocks: true, restoreMocks: true,
})
module.exports = {
  projects: [project('unit', '*.unit.spec.ts'), project('integration', '*.integration.spec.ts'), project('e2e', '*.e2e-spec.ts')],
  collectCoverageFrom: ['src/**/*.ts'], coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: { global: { branches: 80, functions: 90, lines: 90, statements: 90 } },
}
