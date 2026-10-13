import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  { rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }] } },
  { files: ['**/*.cjs', '__tests__/**'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
  globalIgnores(['.next/**', 'dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts', 'tooling/web-code-reviewer/**', 'examples/**', 'resources/**', '.github/**']),
])
