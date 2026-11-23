# `__test__/utils/` — Test Utilities & Local Runner

Utility scripts for local development and testing. This folder is **excluded from Jest test discovery** via `testPathIgnorePatterns` in `jest.config.js`.

## Files

| File             | Purpose                                       |
| ---------------- | --------------------------------------------- |
| `localRunner.js` | Manual local invocation of the Lambda handler |

## Local Runner (`localRunner.js`)

A standalone script for invoking the Lambda handler locally during development — **not a test file**.

### Usage

```sh
node __test__/utils/localRunner.js
```

### Pattern

```js
const { handler } = require("../../"); // Import handler from project root

const mockedLocalData = {
  body: JSON.stringify({
    taxvat: "12345678901",
    product: "FCDC",
  }),
};

handler(mockedLocalData)
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  })
  .catch((err) => {
    console.log(err);
  });
```

### Key Points

- Constructs a minimal Lambda event object matching the API Gateway format (`{ body: JSON.stringify({...}) }`).
- Calls the real handler — no mocking. Requires environment variables and network access to be configured.
- Output is JSON-printed to stdout for quick inspection.
- Excluded from coverage collection via `collectCoverageFrom: ['!**/localRunner.js']`.

## Adding New Utilities

- Place utility scripts in this folder with a descriptive name: `{utilityName}.js`.
- Utilities here are **not test files** — they will not be picked up by Jest.
- If a utility needs to be runnable standalone, use the `handler(data).then(...).catch(...)` pattern.

## Module Imports (`require`)

Utility scripts follow the same rule as the rest of the project: do **not** use destructuring assignment when requiring same-project files. Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const app = require('../../')
app.handler(mockedLocalData).then(...)

// ❌ Wrong
const { handler } = require('../../')
```

Destructuring is reserved for third-party packages (e.g., `const { randomUUID } = require('node:crypto')` — built-in modules are fine; the restriction applies to relative `require`s pointing at same-project sources).
