# Project Root — Architecture & Development Guidelines

Reusable Carbon Node starter, integrated as an isolated hub-ai package. Read README.md for the implemented HTTP handler/local runner and commands. It validates a generic object and acknowledges validation; no proposal API, AWS messaging or commercial integration is configured. Built with Node.js >= 22.14.0, CommonJS modules, and a layered architecture.

## Layer Documentation

Each layer has its own `AGENTS.md` with detailed code patterns, file naming, and export conventions:

| Path              | AGENTS.md                                            | Description                                    |
| ----------------- | ---------------------------------------------------- | ---------------------------------------------- |
| `src/`            | [src/AGENTS.md](src/AGENTS.md)                       | Architecture overview, dependency flow, naming |
| `src/api/`        | [src/api/AGENTS.md](src/api/AGENTS.md)               | External HTTP API calls                        |
| `src/controller/` | [src/controller/AGENTS.md](src/controller/AGENTS.md) | Business orchestration & activities            |
| `src/error/`      | [src/error/AGENTS.md](src/error/AGENTS.md)           | Custom error classes                           |
| `src/factory/`    | [src/factory/AGENTS.md](src/factory/AGENTS.md)       | Payload construction & data transformation     |
| `src/property/`   | [src/property/AGENTS.md](src/property/AGENTS.md)     | Constants, env config, JSON schemas            |
| `src/service/`    | [src/service/AGENTS.md](src/service/AGENTS.md)       | Infrastructure services (SQS, SNS, validation) |
| `logger/`         | [logger/AGENTS.md](logger/AGENTS.md)                 | Pino logger singleton                          |

## Test Suite Documentation

| Path              | AGENTS.md                                            | Description                                   |
| ----------------- | ---------------------------------------------------- | --------------------------------------------- |
| `__test__/`       | [**test**/AGENTS.md](__test__/AGENTS.md)             | Test suite overview, Jest config, conventions |
| `__test__/mocks/` | [**test**/mocks/AGENTS.md](__test__/mocks/AGENTS.md) | Centralized mock data & mock patterns         |
| `__test__/src/`   | [**test**/src/AGENTS.md](__test__/src/AGENTS.md)     | Unit test patterns per source layer           |
| `__test__/utils/` | [**test**/utils/AGENTS.md](__test__/utils/AGENTS.md) | Local runner & test utilities                 |

## Project Structure

```
app/
├── index.js              # Lambda handler entry point
├── package.json
├── jest.config.js
├── logger/               # Pino logger singleton
│   └── index.js
├── src/
│   ├── api/              # External API integrations
│   ├── controller/       # Business flow orchestration
│   ├── error/            # Custom error classes
│   ├── factory/          # Pure data transformation
│   ├── property/         # Constants & configuration
│   └── service/          # Infrastructure services
└── __test__/             # Jest test suite
```

## Lambda Handler (`index.js`)

```js
module.exports.handler = async (event) => {
  // 1. Parse JSON body from event
  // 2. Extract carbon-trace-id header
  // 3. Call controller.request.process(parsedInput, traceId)
  // 4. Return { statusCode, body, headers }
};
```

- Single entry point exported as `handler`.
- Delegates all logic to the controller layer.
- Only handles JSON parsing and API Gateway response formatting.

## Key Technologies

- **Runtime**: Node.js >= 22.14.0
- **HTTP Client**: Axios with mTLS (TLS 1.3)
- **Validation**: AJV + ajv-formats + custom CPF format
- **Logging**: Pino with custom formatters
- **Messaging**: AWS SDK v3 (SNS, SQS)
- **Data Conversion**: json2xml / xml-js for Dynamics
- **Testing**: Jest (90% statements, lines, functions and branches)
- **Module System**: CommonJS (`require`/`exports`)

## Development Conventions

### Adding a New Feature (end-to-end checklist)

1. **Property**: Add constants, endpoints, messaging configs, and JSON schemas in `src/property/index.js`.
2. **Factory**: Create pure payload factories for data transformations:
   - API payloads in `src/factory/api/{domain}/` mirroring API structure.
   - Controller & activity payloads (e.g., event detail builders) in `src/factory/controller/` and `src/factory/controller/activity/`.
   - Service commands & messaging payloads in `src/factory/service/{transport}/{serviceName}/`.
   - Handler response builders (e.g., batch item failures, HTTP responses) in `src/factory/responseFactory.js`.
3. **API**: Create endpoint in `src/api/{domain}/` with standard HTTP template.
4. **Activity**: Create `{action}Activity.js` in `src/controller/activity/` with `exports.execute`, consuming payload factories.
5. **Postpone activity** (if non-critical): Create `postpone{Action}Activity.js` with messaging service fallback.
6. **Service** (if new messaging need): Create service in `src/service/{transport}/`, consuming service command factories.
7. **Service factory**: Create message/command factories in `src/factory/service/`.
8. **Controller**: Wire the new activity into the orchestration pipeline in `{domain}Controller.js`.
9. **Barrel exports**: Register in every `index.js` in the chain across `src/factory/`, `src/controller/`, and `src/service/`.
10. **Tests**: Add tests in `__test__/` mirroring the source structure, including factory unit tests and mock builders.

### Error Handling Strategy

- **Critical operations** (proposal submission): Throw on failure → HTTP 500.
- **Non-critical operations** (marketing consent, lead update): Catch → postpone to messaging service → log warn.
- **Validation failures**: Throw `ValidationError` → HTTP 400.
- **External API failures**: Throw `ExternalApiError` with sanitized error data.

### Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct — same-project require bound to a namespace
const service = require("../../service");
const errors = require("../../error");
const factory = require("../../factory");
const CONSTANT = require("../../property");

// ❌ Wrong — no destructuring on same-project requires
const { ValidationError } = require("../../error");
```

Destructuring is reserved for third-party packages (e.g., `const { Client } = require('@aws-sdk/client-{transport}')`).

### Testing

- Tests live in `__test__/` mirroring `src/` structure.
- Mocks in `__test__/mocks/` — one mock file per external dependency.
- Coverage thresholds: 90% statements, lines, functions and branches.
- Run: `npm test` | Watch: `npm run tdd` | Coverage: `npm run coverage`.

## Current executable flow

The concrete export is controller.request.process; placeholder controllers/activities are retained only as .js.template files under templates/. The default input schema requires an object without imposing domain fields. HTTP validation failures remain ValidationError (400); internal errors return sanitized 500. Never log input bodies or raw error messages. SQS/SNS/EventBridge patterns below are design references, not registered handlers.
