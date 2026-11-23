# Property Layer — Code Patterns & Guidelines

## Purpose

Centralized configuration and constants for the application. All environment variables, API endpoints, business constants, and JSON schemas are defined here. No other module should read `process.env` directly — consume values through this layer.

## Folder Structure

```
src/property/
├── index.js         # All constants and environment config
└── inputSchema.js   # AJV JSON Schema for input validation
```

## File Naming

- `index.js` — Main constants file. All configuration goes here.
- `{name}Schema.js` — JSON Schema definitions in camelCase (e.g., `inputSchema.js`).
- No subfolders. Keep this layer flat.

## Export Pattern

### index.js

```js
exports.CONSTANT_NAME = value;
exports.ANOTHER_CONSTANT = process.env.VAR_NAME || "default";
```

- Each constant exported individually via `exports.NAME`.
- Consumers import as: `const CONSTANT = require('../../property')`.

### Schema files

```js
exports.SCHEMA = {
  /* JSON Schema object */
};
```

## Code Patterns

### Environment Variables

```js
const NODE_ENV = process.env.NODE_ENV || "local";
exports.API_ENDPOINT = process.env.API_ENDPOINT || "https://default-url.com";
```

- Always provide a fallback default using `||`.
- `NODE_ENV` defaults to `'local'` for development.

### Business Constants

```js
exports.REQUEST_FOR_PROPOSAL_LEAD_STATUS = "0";
exports.EF_BRANCH_IDS = { REFF: 20, FCDC: 18 };
```

- SCREAMING_SNAKE_CASE for all constant names.
- Group related constants logically (business rules, API config).

### Dynamic Library Resolution

```js
exports.TOKEN_LIBRARY_LOCATION = ["local", "test"].includes(NODE_ENV)
  ? "@porto-seguro/package-name"
  : "/opt/nodejs/layer-path/";
```

- Local/test environments: Load from `node_modules`.
- Lambda environments: Load from Lambda Layer path (`/opt/nodejs/`).

### JSON Schema (inputSchema.js)

- Uses AJV JSON Schema format.
- Generic object schema with no required domain fields; consumers must define their own contracts.
- Properties are string types only — no enum values, no conditional validation, no custom formats.

## Categories of Constants

| Category          | Examples                                            |
| ----------------- | --------------------------------------------------- |
| Environment       | `NODE_ENV`                                          |
| API Endpoints     | `EF_DYNAMICS_API_PROPOSAL_LEAD_ENDPOINT_URL`        |
| Token Keys        | `TOKEN_KEYS`, `EF_DYNAMICS_API_TOKEN_KEY`           |
| Business Rules    | `REQUEST_FOR_PROPOSAL_LEAD_STATUS`, `EF_BRANCH_IDS` |
| Library Locations | `TOKEN_LIBRARY_LOCATION`                            |
| HTTP Config       | `PARTNER_HEADER_VALUE`                              |

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const CONSTANT = require('../../property')
const tokenKey = CONSTANT.EF_DYNAMICS_API_TOKEN_KEY

// ❌ Wrong
const { EF_DYNAMICS_API_TOKEN_KEY } = require('../../property')
```

Destructuring is reserved for third-party packages.

## Guidelines for New Features

1. **New environment variable**: Add to `index.js` with `process.env.VAR || 'default'`. Never read `process.env` elsewhere.
2. **New API endpoint**: Add the URL constant and any related token keys to `index.js`.
3. **New schema**: Create `{name}Schema.js` exporting `SCHEMA`.
4. **Keep constants flat** — avoid nested configuration objects unless semantically required (like `EF_BRANCH_IDS`).
