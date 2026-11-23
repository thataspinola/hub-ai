# Factory Layer — Code Patterns & Guidelines

## Purpose

Responsible for all data transformation and payload construction. Factories create request payloads for APIs and data report objects for the controller. **No side effects** — factories are pure functions that transform input into output.

## Folder Structure

```
src/factory/
├── index.js                              # Barrel export
├── {purposeName}Factory.js               # Root-level utility factory
├── api/                                  # Payload factories for API endpoints
│   ├── index.js
│   └── {domain}/                         # Mirrors src/api/{domain}/ structure
│       └── {version}/
│           └── {endpointName}EndpointFactory.js
└── controller/                           # Factories for controller outputs
    ├── index.js
    └── {controllerName}ControllerFactory.js
```

## File Naming

- **Root-level factories**: `{purpose}Factory.js` in camelCase (e.g., `axiosResponseErrorDataFactory.js`).
- **API payload factories**: `{endpointName}EndpointFactory.js` (e.g., `proposalLeadEndpointFactory.js`).
- **Controller factories**: `{controllerName}ControllerFactory.js` (e.g., `efProposalLeadSqsMessageControllerFactory.js`).
- **Subfolder hierarchy**: Mirrors the target layer's folder structure.

## Export Pattern

### Barrel files

```js
exports.childName = require("./childFolder");
```

### Factory files

```js
exports.getFunctionName = (input) => { ... }
```

- Function names follow the pattern: `get{OutputDescription}(input)`.
- Common names: `getHttpPostRequestPayload`, `getErrorData`, `getProcessedDataReport`.

## Code Patterns

### API Payload Factory

```js
exports.getHttpPostRequestPayload = (inputPayload, proposalProtocol) => {
  if (!inputPayload.leadId)
    throw new Error("Invalid inputPayload structure or value");
  if (!proposalProtocol) throw new Error("Invalid proposalProtocol value");
  return {
    leadId: inputPayload.leadId,
    protocol: proposalProtocol,
  };
};
```

### Controller Report Factory

```js
exports.getProcessedDataReport = (setRequestForProposalLeadResult) => {
  return {
    setRequestForProposalLead: setRequestForProposalLeadResult,
  };
};
```

- Returns a snapshot of activity results for structured logging.
- Parameters that are `null` indicate activities that failed or did not execute.
- Used by the controller in both success and error paths.

### Error Data Factory

```js
exports.getErrorData = (responseError) => {
  if (responseError.response) {
    /* response received with error */
  } else if (responseError.request) {
    /* no response received */
  } else {
    /* other error */
  }
  return { status: 500, message: "..." };
};
```

### Key Conventions

1. **Pure functions** — no side effects, no API calls, no logging, no state mutation.
2. **Input validation** — Factories validate that required fields exist before transformation. Throw descriptive errors if mandatory fields are missing.
3. **Mirror structure** — `factory/api/` mirrors `src/api/`, `factory/controller/` mirrors `src/controller/`.

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const CONSTANT = require("../../../../property");

// ❌ Wrong
const { SOME_CONSTANT } = require("../../../../property");
```

Destructuring is reserved for third-party packages.

## Guidelines for New Features

1. **New API endpoint**: Create a corresponding factory in `factory/api/` mirroring the API folder structure, with `getHttpPostRequestPayload(inputPayload)`.
2. **New controller output**: Create `{name}Factory.js` in `factory/controller/`.
3. **Update report**: When adding a new activity, add its result as a parameter to `getProcessedDataReport()`.
4. **Keep factories pure** — if you need to call an API or log, that belongs in the API or controller layer.
5. **Barrel exports**: Register every new factory in the chain of `index.js` files up to `src/factory/index.js`.
