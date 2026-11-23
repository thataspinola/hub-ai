# `__test__/` — Jest Test Suite Root

Unit test suite for the Lambda handler and all `src/` layers. Tests live in `__test__/` mirroring the `src/` folder hierarchy. Mocks are centralized under `__test__/mocks/` and utilities under `__test__/utils/`.

## Subfolder Documentation

| Path                      | AGENTS.md                                          | Description                             |
| ------------------------- | -------------------------------------------------- | --------------------------------------- |
| `__test__/mocks/`         | [mocks/AGENTS.md](mocks/AGENTS.md)                 | Centralized mock data & mock patterns   |
| `__test__/src/`           | [src/AGENTS.md](src/AGENTS.md)                     | Unit test patterns per source layer     |
| `__test__/utils/`         | [utils/AGENTS.md](utils/AGENTS.md)                 | Local runner & test utilities           |
| `__test__/utils/factory/` | [utils/factory/AGENTS.md](utils/factory/AGENTS.md) | Local runner & test utilities factories |

## Structure Overview

```
__test__/
├── index.test.js               # Lambda handler tests (root entry point)
├── mocks/                      # All mock data (centralized)
│   ├── index.mock.js           # Central barrel — single import for all mocks
│   ├── handler.mock.js         # Lambda event input/output fixtures
│   ├── logger.mock.js          # Logger error/warn message builder helpers
│   ├── {layerName}.mock.js     # One mock per external Lambda layer dependency
│   └── src/                    # Mirrors src/ — one mock file per source module
│       ├── api/{domain}/.../index.mock.js
│       ├── controller/{controllerName}.mock.js
│       ├── controller/activity/{activityName}.mock.js
│       ├── factory/{factoryName}.mock.js
│       ├── factory/api/{domain}/.../endpointFactory.mock.js
│       ├── factory/controller/{factoryName}.mock.js
│       ├── factory/service/{transport}/{service}/sendMessageFactory.mock.js
│       ├── property/{schemaName}.mock.js
│       └── service/{serviceName}.mock.js
├── src/                        # Mirrors src/ — one test per source module
│   ├── api/{domain}/.../{endpointName}/index.test.js
│   ├── controller/{controllerName}.test.js
│   ├── controller/activity/{activityName}.test.js
│   ├── error/{errorClassName}.test.js
│   ├── factory/{factoryName}.test.js
│   ├── factory/api/{domain}/.../endpointFactory.test.js
│   ├── factory/controller/activity/{factoryName}.test.js
│   ├── factory/service/{transport}/{service}/sendMessageFactory.test.js
│   ├── property/{schemaName}.test.js
│   └── service/{serviceName}.test.js
└── utils/
│   ├── factory/{transport}MockedLambdaPayloadFactory.js
    └── localRunner.js          # Manual local invocation helper
```

## Jest Configuration

Defined in `jest.config.js` at project root:

- **Test environment**: `node`
- **Test match**: `**/__tests__/**/*.(mjs|js|ts)?`, `**/?(*.)+(spec|test).(mjs|js|ts)?`
- **Ignored from test discovery**: `__test__/mocks`, `__test__/utils`
- **Ignored from coverage**: `__test__/`, config files, `localRunner.js`
- **Coverage thresholds**: 90% statements, lines, functions and branches
- **Commands**: `npm test` | `npm run tdd` | `npm run coverage`

## Handler Test (`index.test.js`)

The root `index.test.js` tests the Lambda handler (`index.js`) directly.

### Pattern

```js
const MOCKS = require("./mocks/index.mock"); // Single mock import
const controller = require("../src/controller"); // Real module, then mocked
const factory = require("../src/factory");
const app = require("../index"); // System under test

jest.mock("../src/controller"); // Auto-mock entire barrel
jest.mock("../src/factory");
jest.mock("../logger", () => ({
  // Inline manual mock for logger
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));
```

### Key conventions

- **Single `MOCKS` import**: All test files import mocks via `require('./mocks/index.mock')` (or relative path to it). Never inline mock data in test files.
- **MOCK values via method calls only**: Always access mock data through function calls (`MOCKS.HANDLER.VALID_INPUT_PAYLOAD()`), **never** directly reference the underlying variables or constants. Every mock export is a factory function — this guarantees a fresh copy per invocation and prevents cross-test state leakage.
- **Expected values must come from mocks**: Every literal value used inside `expect(...)` assertions (including nested values inside `expect.objectContaining({...})`, `expect.arrayContaining([...])`, `toEqual(...)`, `toBe(...)`, `toThrow(...)`, etc.) must be sourced either from the input payload the test just built (e.g. `validPayload.foo`) or from a `MOCKS.*` factory. Never hardcode a literal in a `.test.js` file when the same value already exists in — or belongs in — a `.mock.js` file.
- **Mocks reuse data, never duplicate it**: Inside `.mock.js` files, derive dependent values from a single source (e.g. build "expected result" fixtures by transforming the corresponding "input payload" fixture, share scalar constants across variants via named `_VALUE` constants). If the same literal would appear in two mock exports, extract it to a single constant/factory instead. Changing an input mock must automatically propagate to every dependent expected-result mock.
- **`toEqual` + `expect.objectContaining` over attribute-by-attribute `toBe`**: When asserting on multiple properties of an object returned by the system under test, prefer a single `expect(result).toEqual(expect.objectContaining({...}))` (nesting `expect.objectContaining` for sub-objects and `expect.arrayContaining` for arrays) over a sequence of `expect(result.a).toBe(...)`, `expect(result.b).toBe(...)`. Reserve individual `toBe` / `toHaveProperty` calls for single-scalar assertions or negative assertions (e.g. `expect(result.proposta).not.toHaveProperty('seguros')`).
- **`jest.mock()` at top level**: Mock entire barrel modules (`../src/controller`, `../src/factory`, etc.) before any test runs.
- **Logger mock**: Always inline-mock `pino` (or `../logger`) with `jest.fn()` stubs for `info`, `error`, `warn`, `debug`, `silent`, and `child`.
- **`afterEach` cleanup**: Every test file includes `jest.clearAllMocks()`, `jest.restoreAllMocks()`, `jest.resetModules()`.
- **`beforeAll`/`beforeEach`**: Set default mock implementations for the happy path. Override per-test with `mockImplementationOnce`.
- **Assertion style**: `await expect(...).resolves.toEqual(...)` for async success; `await expect(() => ...).rejects.toThrow(...)` for async failure; `expect(() => ...).toThrow(...)` for sync failure.
- **Spy pattern**: `jest.spyOn(service.logger, 'error')` to assert logging calls without replacing the mock.
- **Pino/logger** mock: **Must** be done with ```jest.mock('pino', () => {
  const info = jest.fn()
  const error = jest.fn()
  const warn = jest.fn()
  const debug = jest.fn()
  const silent = jest.fn()
  const child = jest.fn(() => ({ info, error, warn, debug, silent, child }))

      return () => ({
      	info,
      	error,
      	warn,
      	debug,
      	silent,
      	child,
      })

  })```

## File Naming

| File type   | Convention             | Example                     |
| ----------- | ---------------------- | --------------------------- |
| Test file   | `{moduleName}.test.js` | `requestController.test.js` |
| Mock file   | `{moduleName}.mock.js` | `requestController.mock.js` |
| Barrel mock | `index.mock.js`        | `mocks/index.mock.js`       |
| Utility     | `{utilityName}.js`     | `localRunner.js`            |

## Common Definitions

- **`MOCKS`**: The conventionally-named variable holding the centralized mock barrel. Always `const MOCKS = require('...path.../mocks/index.mock')`.
- **`CONSTANT`**: Used for property imports: `const CONSTANT = require('...path.../src/property')`.
- **Mock return factories**: All mock values are exported as **zero-arg functions** (factory pattern) that return fresh copies via spread (`{ ...VALUE }`). This prevents cross-test contamination.
- **`mockImplementationOnce`**: Used to override the default `beforeEach` mock for a specific failure scenario in a single test.

## Module Imports (`require`)

Same rule as the `src/` layers: do **not** use destructuring assignment when requiring same-project files (test mocks, `src/*`, `logger/`). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct — same-project requires bound to a namespace
const MOCKS = require("./mocks/index.mock");
const controller = require("../src/controller");
const service = require("../src/service");
const factory = require("../src/factory");
const errors = require("../src/error");
const CONSTANT = require("../src/property");

// ❌ Wrong — no destructuring on same-project requires
const { ValidationError } = require("../src/error");
const { HANDLER } = require("./mocks/index.mock");
```

Destructuring is reserved for third-party packages (e.g., `const { mockClient } = require('aws-sdk-client-mock')`, `const { Client, Command } = require('@aws-sdk/client-{transport}')`).
