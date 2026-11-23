# Error Layer — Code Patterns & Guidelines

## Purpose

Defines custom error classes used throughout the application. All domain-specific errors must be defined here and thrown by the appropriate layer (validation errors from activities, external API errors from the API layer).

## Folder Structure

```
src/error/
├── index.js              # Barrel export
└── {errorType}Error.js   # Custom error class (one per file)
```

## File Naming

- **Pattern**: `{errorType}Error.js` in camelCase.
- **Class name**: Matches the file name in PascalCase (e.g., `validationError.js` → `class ValidationError`).
- One error class per file.

## Export Pattern

### Barrel file

Each error class is re-exported from `index.js` using its class name as the export key:

```js
exports.ErrorClassName = require("./errorClassNameError");
```

One entry per error class file. The export key matches the class name exactly.

### Error class files

```js
module.exports = class ErrorName extends Error { ... }
```

- Exported as `module.exports` (default export), not `exports.x`.

## Code Patterns

### ValidationError

```js
module.exports = class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
```

- Always HTTP 400.
- Only requires `message`.
- Used for input schema failures, business rule violations.

### ExternalApiError

```js
module.exports = class ExternalApiError extends Error {
  constructor(message, code, stack) {
    super(message);
    this.code = code;
    this.stack = stack;
  }
};
```

- Carries `code` (HTTP status from external API) and original `stack`.
- Used exclusively by the API layer when external HTTP calls fail.

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const errors = require('../../error')
throw new errors.ValidationError('...')

// ❌ Wrong
const { ValidationError } = require('../../error')
```

Destructuring is reserved for third-party packages (e.g., `const { SNSClient } = require('@aws-sdk/client-sns')`).

## Guidelines for New Features

1. **New error class**: Create `{errorType}Error.js`, extend `Error`, export via `module.exports`.
2. **Register in barrel**: Add `exports.ErrorName = require('./errorNameError')` in `index.js`.
3. **Keep errors simple** — only add properties needed for error handling in the controller. No business logic in error classes.
4. **Controller mapping**: If the new error needs distinct handling, add it in `efProposalLeadSqsMessageController.js`'s catch block alongside `ValidationError`.
5. **Constructor signature**: Include `message` as the first parameter. Add extra context fields (e.g., `code`, `stack`) as needed.
