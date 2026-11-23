# API Layer — Code Patterns & Guidelines

## Purpose

Encapsulates all external HTTP API calls. Each API module provides endpoint methods that handle HTTP configuration, request execution, error handling, and response validation. Activities in `src/controller/activity/` consume these APIs — never call HTTP clients directly from controllers or activities.

## Folder Structure

```
src/api/
├── index.js                          # Barrel export
└── {domain}/
    └── {version}/
        └── [{subpath}/]
            └── {endpointName}Endpoint/
                └── index.js          # Endpoint implementation
```

## File & Folder Naming

- **Folder hierarchy mirrors the API domain path**: `ef-dynamics/v1/proposalLeadEndpoint/`.
- **API version folders**: Use `v1/`, `v2/`, etc. as dedicated subfolders.
- **Endpoint folders**: Named `{endpointName}Endpoint/` in camelCase (e.g., `proposalLeadEndpoint/`).
- **Implementation**: Always in `index.js` inside the endpoint folder.
- **Barrel files**: Every intermediate folder has an `index.js` that re-exports its children using `exports.childName = require('./child')`.

## Export Pattern

### Barrel files (intermediate folders)

```js
exports.childName = require("./childFolder");
```

### Endpoint files

```js
exports.post = async (payload, token, certificates, traceIdHeader) => { ... }
```

- Export HTTP method functions: `post`, `get`, `put`, `delete`, etc.
- Standard function signature: `(payload, token, certificates, traceIdHeader)`.
- `traceIdHeader` is optional — only added to headers if truthy.

## Code Patterns

### Standard Endpoint Implementation

Every endpoint follows this exact structure:

```js
const https = require("https");
const axios = require("axios");
const errors = require("../../../../error");
const factory = require("../../../../factory");
const CONSTANT = require("../../../../property");
const service = require("../../../../service");

exports.post = async (payload, token, certificates, traceIdHeader) => {
  const httpsAgentOptions = {
    maxVersion: "TLSv1.3",
    minVersion: "TLSv1.3",
    ca: certificates,
  };
  const httpsAgent = new https.Agent(httpsAgentOptions);

  let apiCallHeaders = {
    accept: "application/json",
    "Content-Type": "application/json",
    partner: CONSTANT.PARTNER_HEADER_VALUE,
    Authorization: `Bearer ${token}`,
  };

  if (traceIdHeader) {
    apiCallHeaders = {
      ...apiCallHeaders,
      "carbon-trace-id": `${traceIdHeader}`,
    };
  }

  try {
    const axiosResponse = await axios({
      method: "POST",
      url,
      headers,
      data: payload,
      httpsAgent,
    });
    // Validate response
    service.logger.info({ rawData: axiosResponse.data }, "Success message");
    return axiosResponse.data;
  } catch (error) {
    const dataFromAxiosError =
      factory.axiosResponseErrorData.getErrorData(error);
    const externalApiError = new errors.ExternalApiError(
      dataFromAxiosError.message,
      dataFromAxiosError.status,
      error.stack,
    );
    service.logger.error({ rawError: error }, `Error message`);
    throw externalApiError;
  }
};
```

### Key Conventions

1. **TLS 1.3 enforced** — All endpoints use `minVersion: 'TLSv1.3'` in the HTTPS agent.
2. **Bearer token auth** — Token passed as parameter, set in `Authorization` header.
3. **CA certificates** — Certificates passed as `ca` property (not `cert`/`key` like mTLS client certs in `app`).
4. **carbon-trace-id** — Conditionally forwarded only if `traceIdHeader` is truthy.
5. **partner header** — Always `CONSTANT.PARTNER_HEADER_VALUE`.
6. **Error conversion** — Axios errors are converted via `factory.axiosResponseErrorData.getErrorData()` then thrown as `ExternalApiError`.
7. **Logging** — Success at `info`, errors at `error` with `rawError` key.

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const service = require('../../../../service')
const errors = require('../../../../error')
const factory = require('../../../../factory')
const CONSTANT = require('../../../../property')

// ❌ Wrong
const { ExternalApiError } = require('../../../../error')
```

Destructuring is reserved for third-party packages (e.g., `const { SNSClient } = require('@aws-sdk/client-sns')`).

## Guidelines for New Features

1. **New API integration**: Create a folder hierarchy matching the API domain path under `src/api/`.
2. **New endpoint**: Create a `{name}Endpoint/index.js` folder following the standard implementation template above.
3. **Barrel exports**: Add `exports.newChild = require('./newChild')` in every intermediate `index.js` up to `src/api/index.js`.
4. **Corresponding factory**: Every new endpoint **must** have a matching factory in `src/factory/api/` with the same folder structure (see `src/factory/AGENTS.md`).
5. **Error handling**: Always use `ExternalApiError` — never throw raw Axios errors.
6. **No business logic** — API modules only handle HTTP transport. Payload construction belongs in factories, orchestration belongs in activities.
