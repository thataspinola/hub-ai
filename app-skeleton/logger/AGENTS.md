# Logger — Code Patterns & Guidelines

## Purpose

Provides a singleton Pino logger instance with custom configuration for AWS Lambda execution. All application logging must go through this module.

## File Naming

- Single file: `index.js` — the only file in this folder.
- No subfolders. New logging concerns (e.g., custom serializers, transports) should be added to `index.js` unless the file grows beyond maintainability.

## Export Pattern

```js
module.exports = logger; // singleton instance (Pino)
```

- Exported as a **singleton** via `module.exports`, not `exports.x`.
- Consumers import as: `const logger = require('../../logger')` or via `service.logger`.

## Code Patterns

### Logger Configuration

- **messageKey**: `'log_message'` — log message field name in JSON output.
- **timestamp**: ISO 8601 string via `pino.stdTimeFunctions.isoTime`.
- **formatters.bindings**: Returns `{ environment, application, version }` from `package.json` and `NODE_ENV`.
- **formatters.level**: Maps numeric level to uppercase label (`'ERROR'`, `'INFO'`, etc.) under key `log_level`.

### Axios Error Sanitization

- A custom serializer strips sensitive data from Axios errors before logging.
- Preserved fields:
  - Only `name`, `code` and upstream status; no error message/stack
  - No request config, URLs or headers
  - No response data or status text; upstream status only
- Any new serializer must follow the same principle: **never log credentials, headers with tokens, or request bodies**.

### Logging Conventions Used Across the App

| Level   | Usage                                             |
| ------- | ------------------------------------------------- |
| `info`  | Successful operations, state transitions          |
| `warn`  | Non-critical fallbacks, graceful degradation      |
| `error` | System errors, failures, unrecoverable exceptions |
| `debug` | Development-only diagnostics                      |

- Always pass a context object as the first argument:
  ```js
  logger.info({ rawData: data }, "Descriptive message");
  logger.error(
    { rawError: error },
    `Erro identificado durante a atividade '${activity}': ${error.message}`,
  );
  ```
- Error logs use key `rawError`, success logs use key `rawData`.

## Guidelines for New Features

1. Do **not** create additional logger files — keep the singleton pattern.
2. New serializers must sanitize sensitive data (tokens, certificates, PII).
3. Maintain the structured logging contract: `log_level`, `log_message`, `environment`, `application`, `version`.
4. Use Pino child loggers if per-request context is needed (e.g., `logger.child({ traceId })`).
5. **No destructuring on same-project `require`** — Consume the logger as a bound module (`const logger = require('../../logger')` or via `service.logger`). Do not use `const { ... } = require(...)` for internal modules; destructuring is only allowed for third-party packages.
