# Service Layer — Code Patterns & Guidelines

## Purpose

Provides reusable infrastructure services: input validation and the application logger. Services are consumed by controller activities — never call validation logic directly from controllers or factories.

## Folder Structure

```
src/service/
├── index.js                          # Barrel export
└── {purpose}Service.js               # Service (validation, utility, etc.)
```

## File Naming

- **Pattern**: `{purpose}Service.js` in camelCase (e.g., `payloadSchemaValidatorService.js`, `cpfValidatorService.js`).
- **One service per file** — each file handles a single responsibility.

## Export Pattern

### Barrel file

The `index.js` re-exports each service module using a camelCase key derived from the filename (minus the `Service` suffix):

```js
exports.serviceName = require("./serviceNameService");
exports.logger = require("../../logger");
```

- Note: `logger` is re-exported here from the `logger/` folder for convenience.
- One entry per service file. Inspect the existing `index.js` for current registrations.

### Service files

```js
exports.validate = (payload, schema) => { ... }
```

- Validation services: `exports.validate`.

## Code Patterns

### Validation Service

```js
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const errors = require("../error");

exports.validate = (payload, schema) => {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const inputDataIsValid = validate(payload);
  if (!inputDataIsValid) {
    // Collect and format all validation errors
    throw new errors.ValidationError(
      `The attributes values are not valid: ${errors.join(", ")}`,
    );
  }
};
```

- AJV without `allErrors` — collects validation failures via iteration.
- No custom formats (no CPF) — simpler than `app`.
- Throws `ValidationError` with concatenated error messages.

### Key Conventions

1. **Validation services throw `ValidationError`** — caller (activity) re-throws for controller handling.
2. **Logger re-export** — `service.logger` is the standard way to access the Pino logger across the app.
3. **No business logic** — Services handle infrastructure concerns only.

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const errors = require('../error')
throw new errors.ValidationError('...')

// ❌ Wrong
const { ValidationError } = require('../error')
```

Destructuring is reserved for third-party packages.

## Guidelines for New Features

1. **New validation service**: Create `{name}Service.js` at `src/service/` level, export validation functions. Register in `service/index.js`.
2. **Error handling**: Validation services throw `ValidationError`.
3. **Barrel exports**: Register in `service/index.js`.
