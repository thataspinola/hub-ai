# `__test__/mocks/` — Centralized Mock Data

All mock data for the test suite lives here. Mock files mirror the `src/` folder structure and provide factory functions that return fresh copies of test fixtures.

## Structure

```
mocks/
├── index.mock.js                   # Central barrel — exports all mocks under namespaced keys
├── handler.mock.js                 # Lambda event payloads & expected handler responses
├── logger.mock.js                  # Logger error/warn message builder helpers
├── {layerName}.mock.js             # One mock per external Lambda layer dependency
└── src/                            # Mirrors src/ — one mock file per source module
    ├── api/
    │   └── {domain}/.../index.mock.js
    ├── controller/
    │   ├── {controllerName}.mock.js
    │   └── activity/
    │       └── {activityName}.mock.js
    ├── factory/
    │   ├── {factoryName}.mock.js
    │   ├── api/{domain}/.../endpointFactory.mock.js
    │   ├── controller/
    │   │   ├── {controllerFactoryName}.mock.js
    │   │   └── activity/{activityFactoryName}.mock.js
    │   └── service/
    │       └── {transport}/{serviceName}/sendMessageFactory.mock.js
    ├── property/
    │   └── {schemaName}.mock.js
    └── service/
        ├── {serviceName}.mock.js
        └── {transport}/
            └── {serviceName}.mock.js
```

## Central Barrel (`index.mock.js`)

Single entry point that re-exports every mock file under a **SCREAMING_SNAKE_CASE** namespace key:

```js
exports.NAMESPACE_KEY = require("./path/to/moduleName.mock");
```

One entry per mock file. The key follows a naming convention that mirrors the source module's layer and path.

**CRITICAL RESTRICTION**: `index.mock.js` at the mocks root is the **only** barrel file allowed. Sub-folders must **NOT** contain their own `index.mock.js` or any other file acting as a sub-barrel that re-exports sibling mocks. Every mock file is registered individually and directly in the root `index.mock.js`.

### Naming Convention for Barrel Keys

Derive the key from the source module's **layer** and **path**, using `SCREAMING_SNAKE_CASE`:

| Pattern                                      | Description                                        |
| -------------------------------------------- | -------------------------------------------------- |
| `HANDLER`                                    | Lambda event & response mocks                      |
| `CONTROLLER_{NAME}`                          | Controller-level mock (named after the controller) |
| `CONTROLLER_ACTIVITY_{ACTION}`               | Activity mock (named after the activity action)    |
| `FACTORY_{NAME}`                             | Root-level factory mock                            |
| `FACTORY_API_{DOMAIN}_{ENDPOINT}`            | API payload factory mock                           |
| `FACTORY_CONTROLLER_{NAME}`                  | Controller report factory mock                     |
| `FACTORY_SERVICE_{TRANSPORT}_{SERVICE}_{OP}` | Service message factory mock                       |
| `API_{DOMAIN}_{ENDPOINT}`                    | API endpoint mock                                  |
| `SERVICE_{NAME}`                             | Service mock                                       |
| `SERVICE_LOGGER`                             | Logger mock                                        |
| `LAYER_{NAME}`                               | External layer mock (token, dynamics, etc.)        |

Inspect the existing `index.mock.js` for current registrations.

## Mock File Patterns

### Factory Function Pattern (mandatory)

Every exported mock value is a **zero-argument function** returning a **fresh copy**:

```js
const VALUE = { leadId: "abc-123", protocol: "037820002101" };

exports.SOME_VALID_RETURN = () => {
  return { ...VALUE }; // Spread to prevent cross-test mutation
};
```

- **Never export raw values** — always wrap in `() => { return ... }`.
- Use `{ ...obj }` spread for objects or `JSON.stringify`/`JSON.parse` for deep copies when needed.
- Primitive values can be returned directly: `return 'mockedToken'`.

### Export Naming Convention

Mock export names follow a `SCREAMING_SNAKE_CASE` pattern describing their purpose:

| Segment           | Meaning                                             | Example                                          |
| ----------------- | --------------------------------------------------- | ------------------------------------------------ |
| Method name       | Source method being tested                          | `GETHTTPPOSTREQUESTPAYLOAD`                      |
| `VALID`/`INVALID` | Whether the data represents a valid or invalid case | `VALID_RETURN`, `INVALID_INPUTPAYLOAD`           |
| `INPUT`/`RETURN`  | Whether it's an input to or output from the method  | `EXECUTE_VALID_PARSEDINPUT`, `POST_VALID_RETURN` |
| Scenario suffix   | Additional context for the scenario                 | `_MISSING_LEADID`, `_WITH_VDOCODE`               |

Full examples:

- `EXECUTE_VALID_PARSEDINPUT()` — valid input for an activity's `execute` method
- `POST_VALID_RETURN()` — expected return from an API `.post()` call
- `GETHTTPPOSTREQUESTPAYLOAD_INVALID_INPUTPAYLOAD_MISSING_LEADID()` — factory input missing `leadId`
- `SENDMESSAGECOMMAND_VALID_RESPONSE()` — AWS SDK command response

### File Naming

```
{sourceModuleName}.mock.js
```

- Mirrors the source file it provides mocks for: `responseFactory.js` → `responseFactory.mock.js`
- API endpoint mocks use `index.mock.js` matching the source barrel: `api/ef-dynamics/v1/proposalLeadEndpoint/index.mock.js`

### Module-Shared Mocks

**DO NOT** create `shared.mock.js` or equivalent

### Logger messages Mocks

**MUST BE**: All mock related with messages send as parameter to logger methods need to be defined in logger.mock.js

### Cross-Mock References

Mocks can import other mocks to compose realistic data chains.

**CRITICAL RESTRICTION**: Mock files must **NEVER** `require` the barrel `index.mock.js`. The barrel is exclusively consumed by test files. When a mock needs data from another mock, it must `require` the specific mock file directly using a relative path:

```js
// CORRECT — direct relative path to the specific mock file
const HANDLER_MOCKS = require("../../handler.mock");
const FACTORY_MOCKS = require("../../factory/controller/requestControllerFactory.mock");
const API_MOCKS = require("../../api/ef-credit-proposal/.../index.mock");

// WRONG — never require the barrel from a mock file
const MOCKS = require("../../index.mock"); // FORBIDDEN
```

This prevents circular dependency chains (`index.mock.js` → `someMock.mock.js` → `index.mock.js`) and keeps the dependency graph acyclic.

### Cross-Mock Reference Constant Naming

When a mock file `require`s another mock file, the constant name must follow this pattern:

```
{BARREL_KEY}_MOCKS
```

Where `{BARREL_KEY}` is the **SCREAMING_SNAKE_CASE** key that the referenced mock file uses (or would use) in the root `index.mock.js` barrel, and `_MOCKS` is a mandatory suffix.

Examples:

```js
// handler.mock.js → barrel key is HANDLER
const HANDLER_MOCKS = require("../../handler.mock");

// tokenLayer.mock.js → barrel key is LAYER_TOKEN
const LAYER_TOKEN_MOCKS = require("../../../tokenLayer.mock");

// factory/controller/requestControllerFactory.mock.js → barrel key is FACTORY_CONTROLLER_REQUEST
const FACTORY_CONTROLLER_REQUEST_MOCKS = require("../../factory/controller/requestControllerFactory.mock");

// api/ef-credit-proposal/.../solicitaEndpoint/index.mock.js → barrel key is API_EFCREDITPROPOSAL_API_SOLICITA_ENDPOINT
const API_EFCREDITPROPOSAL_API_SOLICITA_ENDPOINT_MOCKS = require("../../api/ef-credit-proposal/.../index.mock");

// controller/activity/postponeSetMarketingOptinConsentActivity.mock.js → barrel key is CONTROLLER_ACTIVITY_POSTPONESETMARKETINGOPTINCONSENT
const CONTROLLER_ACTIVITY_POSTPONESETMARKETINGOPTINCONSENT_MOCKS = require("./postponeSetMarketingOptinConsentActivity.mock");
```

This convention makes it immediately clear which mock file a constant refers to — the name before `_MOCKS` maps directly to the barrel registration key.

### Handler Mock (`handler.mock.js`)

Special root-level mock providing:

- **Base payload object**: `VALID_INPUT_PAYLOAD_BODY_JSON_OBJ_VALUE` with all required fields
- **Variant objects**: Spread-based variants for married, marketing opt-in/out, social name, etc.
- **Lambda event wrappers**: `VALID_INPUT_PAYLOAD()` returns `{ body: JSON.stringify(...) }`
- **Expected responses**: `SUCCESS_RETURN()`, `BADREQUEST_RETURN()`, `INTERNALERROR_RETURN()`

Many downstream mocks reference handler mocks as the base payload source:

```js
const HANDLER_MOCKS = require("../../handler.mock");
exports.EXECUTE_VALID_PARSEDINPUT = () => {
  return { ...HANDLER_MOCKS.VALID_INPUT_PAYLOAD_BODY_JSON_OBJ() };
};
```

### Logger Mock (`logger.mock.js`)

Provides **message builder functions** for asserting log output, not logger stubs:

```js
exports.ERROR_CURRENTACTIVITY_MESSAGE = (message, activity) => {
  return `Erro identificado durante a atividade '${activity}': ${message}`;
};
exports.ERROR_CURRENTACTIVITY_OBJECT = (thrownError) => {
  return { rawError: thrownError };
};
```

Used in tests to build expected log arguments:

```js
expect(spyServiceLoggerError).toHaveBeenCalledWith(
  MOCKS.SERVICE_LOGGER.ERROR_CURRENTACTIVITY_OBJECT(thrownError),
  MOCKS.SERVICE_LOGGER.ERROR_CURRENTACTIVITY_MESSAGE(msg, activityName),
);
```

### Invalid Data Patterns

For missing-field scenarios, use delete on a spread copy:

```js
exports.INVALID_MISSING_TAXVAT = () => {
  const returnValue = { ...VALID_PAYLOAD_VALUE };
  delete returnValue.taxvat;
  return returnValue;
};
```

For invalid-value scenarios, override the specific field:

```js
exports.INVALID_PAYLOAD_PRODUCT = () => {
  return { ...VALID_PAYLOAD_VALUE, product: "DMMY" };
};
```

## Module Imports (`require`)

Mock files follow the same rule as the rest of the project: do **not** use destructuring assignment when requiring same-project files. Bind the whole module to a namespace and access its members through that namespace. This is already required by the [Cross-Mock Reference Constant Naming](#cross-mock-reference-constant-naming) convention (`{BARREL_KEY}_MOCKS`).

```js
// ✅ Correct — namespace-bound cross-mock require
const HANDLER_MOCKS = require("../../handler.mock");
const LAYER_TOKEN_MOCKS = require("../../../tokenLayer.mock");

// ❌ Wrong — no destructuring on same-project mock requires
const { VALID_INPUT_PAYLOAD } = require("../../handler.mock");
```

Destructuring is reserved for third-party packages (e.g., `const { Client } = require('@aws-sdk/client-{transport}')`).
