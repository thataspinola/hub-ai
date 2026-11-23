# Source — Architecture & Layer Guidelines

This is the main source folder containing all application logic, organized by architectural layers. Each layer has its own `AGENTS.md` with detailed code patterns — refer to them when working within a specific layer.

## Layer Reference

| Layer      | Path              | AGENTS.md                                    | Responsibility                                         |
| ---------- | ----------------- | -------------------------------------------- | ------------------------------------------------------ |
| API        | `src/api/`        | [api/AGENTS.md](api/AGENTS.md)               | External HTTP API calls (Axios + mTLS)                 |
| Controller | `src/controller/` | [controller/AGENTS.md](controller/AGENTS.md) | Business flow orchestration via activities             |
| Error      | `src/error/`      | [error/AGENTS.md](error/AGENTS.md)           | Custom error classes                                   |
| Factory    | `src/factory/`    | [factory/AGENTS.md](factory/AGENTS.md)       | Pure data transformation and payload construction      |
| Property   | `src/property/`   | [property/AGENTS.md](property/AGENTS.md)     | Constants, env config, schemas                         |
| Service    | `src/service/`    | [service/AGENTS.md](service/AGENTS.md)       | Infrastructure services (SQS, SNS, validation, logger) |

## Dependency Flow

```
index.js (Lambda Handler)
  ├── controller (orchestration)
  │     ├── activity/* (business steps)
  │     │     ├── factory (payload & event detail construction)
  │     │     ├── api (HTTP calls)
  │     │     ├── service (messaging, EventBridge, validation)
  │     │     └── property (constants)
  │     └── error (error types)
  └── factory/responseFactory (batch item failures & response formatting)
```

### Rules

1. **Controller → Activity → Factory/API/Service** — Controllers compose activities. Activities call factories for data/event detail construction, APIs for HTTP, and services for infrastructure.
2. **Service → Factory** — Services consume service-layer factories (e.g., `factory.service.eventBridge.*`) to construct AWS SDK command entries/parameters before execution.
3. **Handler → Factory** — Lambda entry points consume `factory.response.*` to format batch processing results (e.g., `batchItemFailures`).
4. **Factory ← Property** — Factories use property constants for enum mappings and config. No other dependencies. Pure functions only.
5. **API ← Factory + Error** — APIs use factories for error data extraction and throw custom errors.
6. **Service ← Property** — Services use property for AWS config. Services log via `service.logger` or root `logger`.
7. **No circular dependencies** — Layers only depend downward. Never import controller from API/factory/service.
8. **No direct `process.env`** — All environment variables read through `src/property/`.

## Cross-Cutting Patterns

### Lambda Handler

The `index.js` in app root folder handles a transport-specific Lambda event envelope. Shape the `index.js` to handle real AWS event structure for the transport type.

#### SQS

SQS→Lambda supports partial batch failures via `ReportBatchItemFailures`. Process every record in parallel, then return only the `messageId`s that failed in `batchItemFailures` so SQS retries just those (successful records are deleted from the queue). Never throw from the handler — that would mark the whole batch as failed and re-deliver already-processed messages.

```js
const controller = require('./src/controller')
const logger = require('./logger')

const lambdaHandler = async (event) => {
	const recordPromises = event.Records.map((record, index) => {
		return new Promise((resolve, reject) => {
			try {
				const parsedRequestMessageBody = JSON.parse(record.body)
				controller.{name}
					.process(parsedRequestMessageBody)
					.then(resolve)
					.catch(reject)
			} catch (error) {
				logger.error(`Processing JSON parse error: ${error.message}`)
				reject(error)
			}
		})
	})
	const response = await Promise.allSettled(recordPromises)
	const batchItemFailures = []
	for (const [idx, record] of Object.entries(event.Records)) {
		const { status, reason } = response[idx]
		if (status === 'fulfilled') continue
		batchItemFailures.push({
			itemIdentifier: record.messageId,
		})
	}
	return {
		batchItemFailures,
	}
}

module.exports.handler = lambdaHandler
```

#### SNS

SNS→Lambda does not support partial batch failures. Any thrown error triggers SNS's subscription retry policy (and eventual DLQ). Process every record and throw on the first unrecoverable failure so the whole invocation is retried.

```js
const controller = require('./src/controller')
const logger = require('./logger')

const lambdaHandler = async (event) => {
	for (const record of event.Records) {
		let parsedRequestMessageBody = null
		try {
			parsedRequestMessageBody = JSON.parse(record.Sns.Message)
		} catch (error) {
			logger.error(
				`Processing JSON parse error for MessageId ${record.Sns.MessageId}: ${error.message}`
			)
			throw error
		}
		await controller.{name}.process(parsedRequestMessageBody)
	}
}

module.exports.handler = lambdaHandler
```

#### API Gateway (REST)

API Gateway invokes Lambda synchronously with a single HTTP request per invocation. The handler must always return a well-formed `{ statusCode, headers, body }` response — never throw. Malformed input returns `400`, unexpected failures return `500` via `factory.response.error`, and the `carbon-trace-id` header is echoed back when present so the client can correlate the request end-to-end.

```js
const controller = require('./src/controller')
const factory = require('./src/factory')
const logger = require('./logger')

const lambdaHandler = async (event) => {
	let responseBody = null
	let responseStatusCode = null
	let carbonTraceId = null
	try {
		if (typeof event.body !== 'string') {
			throw new Error('Input must be a string')
		}

		let parsedInputFormData = null
		try {
			const parsedInput = JSON.parse(event.body)
			parsedInputFormData = parsedInput
		} catch (err) {
			logger.error(`Body JSON parse error: ${err.message}`)
			logger.info(`data: ${event.body}`)
			const httpBadRequestErrorData = factory.response.badRequestError(
				err.message
			)

			const response = {
				isBase64Encoded: false,
				headers: {},
				statusCode: httpBadRequestErrorData.statusCode,
				body: JSON.stringify(httpBadRequestErrorData.body),
			}

			return response
		}
		carbonTraceId = factory.carbonTraceId.getTraceId(event.headers)
		const requestData = await controller.{name}.process(
			parsedInputFormData,
			carbonTraceId
		)

		responseBody = JSON.stringify(requestData.body)
		responseStatusCode = requestData.statusCode
	} catch (error) {
		const httpErrorData = factory.response.error(error.message)
		responseBody = JSON.stringify(httpErrorData.body)
		responseStatusCode = httpErrorData.statusCode
	}

	const awsRestAPIGatewayResponse = {
		isBase64Encoded: false,
		headers: {},
		statusCode: responseStatusCode,
		body: responseBody,
	}
	if (carbonTraceId) {
		awsRestAPIGatewayResponse.headers = { 'carbon-trace-id': carbonTraceId }
	}

	return awsRestAPIGatewayResponse
}

module.exports.handler = lambdaHandler
```

#### EventBridge / CloudWatch Events

EventBridge (and legacy CloudWatch Events) invokes Lambda **asynchronously** with a **single event per invocation** — there is no `Records[]` array. The business payload lives in `event.detail`, and metadata (`source`, `detail-type`, `id`, `time`) is available at the root. Because the invocation is async, any thrown error is retried by Lambda (default 2 attempts) and then sent to the configured on-failure destination / DLQ, so throw on unrecoverable failures rather than swallowing them.

```js
const controller = require('./src/controller')
const logger = require('./logger')

const lambdaHandler = async (event) => {
	if (!event || typeof event.detail !== 'object' || event.detail === null) {
		const error = new Error('EventBridge event is missing a valid detail payload')
		logger.error(`Processing event error for id ${event && event.id}: ${error.message}`)
		throw error
	}

	try {
		await controller.{name}.process(event.detail)
	} catch (error) {
		logger.error(
			`Processing event error for id ${event.id} (source=${event.source}, detail-type=${event['detail-type']}): ${error.message}`
		)
		throw error
	}
}

module.exports.handler = lambdaHandler
```

### Barrel Exports

Every folder has an `index.js` that re-exports its children:

```js
exports.childName = require("./childModule");
```

This enables clean deep access: `factory.api.efCreditProposal.v1.solicitaEndpoint.getHttpPostRequestPayload(...)`.

### Naming Conventions

- **Files**: camelCase (`requestController.js`, `inputValidationActivity.js`)
- **Folders**: kebab-case for domain names (`ef-dynamics/`, `rastreabilidade-cdc/`), camelCase for code modules (`activity/`, `service/`)
- **Functions**: camelCase (`getTraceId`, `sendMessage`, `execute`)
- **Constants**: SCREAMING_SNAKE_CASE (`AWS_REGION`, `EF_BRANCH_IDS`)
- **Classes**: PascalCase (`ValidationError`, `ExternalApiError`)

### Module System

- CommonJS (`require` / `module.exports` / `exports.x`) throughout.
- No ES modules (`import`/`export`).
- Node.js built-in modules prefixed with `node:` (e.g., `require('node:crypto')`).
- **No destructuring on same-project `require`** — When importing internal modules (relative paths), bind the whole module to a single identifier and access members via the namespace (`const service = require('../../service')`, `const errors = require('../../error')`). Never write `const { X } = require('../../error')`. Destructuring is only allowed for third-party packages (e.g., `const { Client } = require('@aws-sdk/client-{transport}')`).
