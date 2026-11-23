# `__test__/src/` — Unit Tests (Mirrors `src/` Structure)

Unit test files organized to mirror the `src/` folder hierarchy. Each source module has a corresponding `.test.js` file at the same relative path.

## Structure

```
src/
├── api/
│   └── {domain}/.../index.test.js
├── controller/
│   ├── {controllerName}.test.js
│   └── activity/
│       └── {activityName}.test.js
├── error/
│   └── {errorClassName}.test.js
├── factory/
│   ├── {factoryName}.test.js
│   ├── api/{domain}/.../endpointFactory.test.js
│   ├── controller/
│   │   ├── {controllerFactoryName}.test.js
│   │   └── activity/{activityFactoryName}.test.js
│   └── service/
│       └── {transport}/{serviceName}/sendMessageFactory.test.js
├── property/
│   └── {schemaName}.test.js
└── service/
    ├── {serviceName}.test.js
    └── {transport}/
        └── {serviceName}.test.js
```

## File Naming

```
{sourceModuleName}.test.js
```

Test file name matches the source file: `requestController.js` → `requestController.test.js`, `inputValidationActivity.js` → `inputValidationActivity.test.js`.

## Common Test File Structure

Every test file follows this structure:

```js
// 1. Import centralized mocks
const MOCKS = require("../../mocks/index.mock"); // Relative path to mocks barrel

// 2. Import system under test (SUT) & its dependencies
const controllerActivity = require("../../../../src/controller/activity");
const service = require("../../../../src/service");
const factory = require("../../../../src/factory");
const errors = require("../../../../src/error");

// 3. Mock dependencies (NOT the SUT itself)
jest.mock("../../../../src/service");
jest.mock("../../../../src/factory");
jest.mock("pino", () => {
  /* inline logger mock */
});

// 4. Cleanup
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

// 5. Default happy-path mocks
beforeEach(() => {
  service.payloadSchemaValidator.validate.mockImplementation(() => {});
  factory.api.someEndpoint.getPayload.mockImplementation(() => {
    return MOCKS.SOME_NAMESPACE.VALID_RETURN();
  });
});

// 6. Test suites
describe("Test suite: moduleUnderTest.js", () => {
  describe("When success", () => {
    /* ... */
  });
  describe("When it fails", () => {
    /* ... */
  });
});
```

## Test Patterns by Layer

### API Endpoint Tests

Test the Axios HTTP call via mocked `axios`:

```js
jest.mock("axios");
beforeEach(() => {
  axios.mockImplementation(async (params) => {
    if (params.url.search(CONSTANT.SOME_ENDPOINT_URL) !== -1) {
      return MOCKS.API_NAMESPACE.AXIOS_HTTP_POST_SUCCESS_RESPONSE();
    }
    throw responseError;
  });
});
```

**Test scenarios**:

- Success: `resolves.toEqual(MOCKS.API_NAMESPACE.POST_VALID_RETURN())`
- HTTP error (status ≠ 200): `rejects.toThrow(...)` with response status
- HTTP 422 unprocessable entity: `rejects.toThrow(...)` with specific message
- No response from API: Mock `error.request` without `error.response`
- Unexpected error: `axios.mockRejectedValueOnce(new Error(...))`
- Null/invalid response: `axios.mockResolvedValueOnce(null)`

### Controller Tests (`requestController.test.js`)

Mock all activities and factories. Test the orchestration pipeline:

```js
jest.mock("../../../src/controller/activity");
jest.mock("../../../src/service");
jest.mock("../../../src/factory");
```

**Test scenarios**:

- Happy path: All activities resolve → returns success response
- Validation error: Activity throws `ValidationError` → `factory.response.badRequestError`
- Non-critical failure: Activity throws → catches, logs warn, continues (postpone pattern)
- Critical failure: Activity throws → returns error response with `factory.response.error`
- Spy on `service.logger.info`/`warn`/`error` to assert log messages

### Activity Tests

Mock the layer below the activity (factory, api, service):

```js
jest.mock("../../../../src/factory");
jest.mock("../../../../src/api");
jest.mock("../../../../src/service");
```

**Test scenarios for sync activities**:

- Success: `expect(() => activity.execute(...)).not.toThrow()`
- Failure: `expect(() => activity.execute(...)).toThrow(thrownError)`
- Logger spy: `expect(spyServiceLoggerError).toHaveBeenCalledWith(errorObj, errorMessage)`

**Test scenarios for async activities**:

- Success: `await expect(activity.execute(...)).resolves.toEqual(MOCKS...)`
- Factory error: Mock factory to throw → `rejects.toThrow(thrownError)` + logger assertion
- API error: Mock API to throw → `rejects.toThrow(thrownError)` + logger assertion

### Error Class Tests

Minimal tests — just verify the `name` property:

```js
const errors = require("../../../src/error");
test("It should have ExternalApiError name", () => {
  const instance = new errors.ExternalApiError();
  expect(instance.name).toEqual("ExternalApiError");
});
```

### Factory Tests

Import factory directly (no mocking of the SUT). Use mock data as inputs and expected outputs:

```js
const factory = require("../../../src/factory");
const MOCKS = require("../../mocks/index.mock");

test("It should return the correct payload structure", () => {
  expect(factory.someFactory.someMethod(MOCKS.INPUT())).toEqual(
    MOCKS.EXPECTED_RETURN(),
  );
});
test("It should throw error for missing field", () => {
  expect(() => factory.someFactory.someMethod(MOCKS.INVALID_INPUT())).toThrow(
    "...",
  );
});
```

### Property/Schema Tests

Integration-style test using real `payloadSchemaValidator.validate` with the real schema:

```js
const service = require("../../../src/service");
const INPUT_SCHEMA = require("../../../src/property/inputSchema");

test("It should not throw for valid payload", () => {
  expect(() => {
    service.payloadSchemaValidator.validate(
      MOCKS.VALID_PAYLOAD(),
      INPUT_SCHEMA.SCHEMA,
    );
  }).not.toThrow();
});
test("It should throw for missing required field", () => {
  expect(() => {
    service.payloadSchemaValidator.validate(
      MOCKS.INVALID_MISSING_FIELD(),
      INPUT_SCHEMA.SCHEMA,
    );
  }).toThrow(
    new ValidationError("The attributes values are not valid: fieldName"),
  );
});
```

### Service Tests (Messaging)

Use `aws-sdk-client-mock` to mock AWS SDK clients:

```js
const { mockClient } = require("aws-sdk-client-mock");
const { Client, Command } = require("@aws-sdk/client-{transport}");

const serviceMock = mockClient(Client);
beforeEach(() => {
  serviceMock.on(Command).resolves(MOCKS.SERVICE.VALID_RESPONSE());
});
```

**Test scenarios**:

- Success: Returns `MessageId` from response
- Empty response: Returns `null`
- SDK error: `rejects.toThrow(...)` with error message

### Service Tests (Validation)

Test `payloadSchemaValidator` and `cpfValidator` with real implementations — no mocking:

```js
// cpfValidationService
test("Valid CPF returns true", () => {
  expect(service.cpfValidator.isValid(MOCKS.VALID_CPF())).toEqual(true);
});
test("Invalid CPF returns false", () => {
  expect(service.cpfValidator.isValid(MOCKS.INVALID_CPF())).toEqual(false);
});
```

## Pino Logger Mock Template

Used in nearly every test file that tests modules importing the logger:

```js
jest.mock("pino", () => {
  const info = jest.fn();
  const error = jest.fn();
  const warn = jest.fn();
  const debug = jest.fn();
  const silent = jest.fn();
  const child = jest.fn(() => ({ info, error, warn, debug, silent, child }));
  return () => ({ info, error, warn, debug, silent, child });
});
```

## Assertion Patterns

| Scenario          | Pattern                                                               |
| ----------------- | --------------------------------------------------------------------- |
| Async success     | `await expect(fn()).resolves.toEqual(MOCKS.EXPECTED())`               |
| Async failure     | `await expect(() => fn()).rejects.toThrow(errorOrMessage)`            |
| Sync success      | `expect(() => fn()).not.toThrow()`                                    |
| Sync failure      | `expect(() => fn()).toThrow(errorOrMessage)`                          |
| Logger called     | `expect(spyLoggerError).toHaveBeenCalledWith(errorObj, errorMessage)` |
| Logger not called | `expect(spyLoggerError).not.toHaveBeenCalled()`                       |
| Return value      | `expect(result).toEqual(MOCKS.EXPECTED())`                            |
| Has property      | `expect(result).toHaveProperty('someKey')`                            |
| Type check        | `expect(typeof result.field).toBe('string')`                          |

## Override Pattern for Failure Tests

Default mocks are set in `beforeEach`. For a specific failure test, override with `mockImplementationOnce`:

```js
test('It should throw when factory fails', async () => {
    const thrownError = new Error('Factory error')
    factory.someMethod.mockImplementationOnce(() => { throw thrownError })

    await expect(() => activity.execute(...)).rejects.toThrow(thrownError)
    expect(spyServiceLoggerError).toHaveBeenCalledWith(
        MOCKS.SERVICE_LOGGER.ERROR_CURRENTACTIVITY_OBJECT(thrownError),
        MOCKS.SERVICE_LOGGER.ERROR_CURRENTACTIVITY_MESSAGE(thrownError.message, 'Activity name')
    )
})
```

## Module Imports (`require`)

Test files follow the same rule as the `src/` layers: do **not** use destructuring assignment when requiring same-project files (mocks barrel, `src/*`, `logger/`). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct — same-project requires bound to a namespace
const MOCKS = require("../../mocks/index.mock");
const controllerActivity = require("../../../../src/controller/activity");
const service = require("../../../../src/service");
const factory = require("../../../../src/factory");
const errors = require("../../../../src/error");
const CONSTANT = require("../../../../src/property");

// ❌ Wrong — no destructuring on same-project requires
const { ValidationError } = require("../../../../src/error");
const { HANDLER, SERVICE_LOGGER } = require("../../mocks/index.mock");
```

Destructuring is reserved for third-party packages — e.g., `const { mockClient } = require('aws-sdk-client-mock')`, `const { Client, Command } = require('@aws-sdk/client-{transport}')`.
