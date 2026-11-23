# Controller Layer — Code Patterns & Guidelines

## Purpose

Orchestrates the business flow by composing activities into a sequential processing pipeline. The controller receives a parsed SQS message body from the Lambda handler and either completes successfully or throws to trigger SQS retry. All orchestration logic lives here — never in the handler, API, or service layers.

## Folder Structure

```
src/controller/
├── index.js                              # Barrel export
├── {name}Controller.js                   # Main orchestrator
└── activity/
    ├── index.js                          # Barrel export for all activities
    ├── {action}Activity.js               # Standard activity
    └── postpone{Action}Activity.js       # Fallback activity (async processing)
```

## File Naming

- **Controllers**: `{name}Controller.js` in camelCase (e.g., `efProposalLeadSqsMessageController.js`).
- **Activities**: `{descriptiveAction}Activity.js` in camelCase (e.g., `setRequestForProposalLeadActivity.js`).
- **Postpone activities**: `postpone{Action}Activity.js` — fallback activity that delegates to async processing when the primary activity fails.

## Export Pattern

### Barrel files

Each `index.js` re-exports its sibling modules using a camelCase key derived from the filename (minus the suffix):

```js
// controller/index.js
exports.controllerName = require("./controllerNameController");

// activity/index.js
exports.activityName = require("./activityNameActivity");
```

One entry per controller or activity file. Inspect the existing `index.js` files for current registrations.

### Controller files

```js
exports.process = async (parsedRequestMessageBody) => { ... }
```

### Activity files

```js
exports.execute = async (param1, param2, ...) => { ... }
```

- Controllers export `process`.
- Activities export `execute`.
- This naming is consistent across all files — always follow it.

## Code Patterns

### Controller — Sequential Pipeline

The controller composes activities sequentially (no parallel execution needed — single activity pipeline):

```js
const activity = require('./activity')
const service = require('../service')
const factory = require('../factory')

exports.process = async (parsedRequestMessageBody) => {
  let setRequestForProposalLeadResult = null
  try {
    // Phase 1: Validate input
    activity.inputValidation.execute(parsedRequestMessageBody)

    // Phase 2: Get credentials
    const tokens = await activity.getToken.execute()
    const certificates = await activity.getCertificates.execute()

    // Phase 3: Execute business activity
    setRequestForProposalLeadResult =
      await activity.setRequestForProposalLead.execute(
        parsedRequestMessageBody, tokens, certificates
      )

    // Phase 4: Log success with report
    const details = factory.controller.efProposalLeadSqsMessage
      .getProcessedDataReport(setRequestForProposalLeadResult)
    service.logger.info({ rawData: details }, `...successfully processed...`)

  } catch (error) {
    // Build error with context, log, then throw for SQS retry
    const processError = new Error(`EF Proposal-Lead processing error: ${error.message}`)
    if (error.name === 'ValidationError') {
      service.logger.error({ rawError: error }, '...Mensagem com estrutura ou dado inválido.')
    } else {
      // Attempt to log partial results for diagnostics
      try {
        const details = factory.controller.efProposalLeadSqsMessage
          .getProcessedDataReport(setRequestForProposalLeadResult)
        service.logger.error({ rawError: error, rawData: details }, `...Erro interno...`)
      } catch (detailsError) { ... }
    }
    throw processError  // ← Throw to trigger SQS retry
  }
}
```

### Activity — Standard Template

```js
const service = require("../../service");
const factory = require("../../factory");
const CONSTANT = require("../../property");
const api = require("../../api");

exports.execute = async (parsedInput, tokens, certificates) => {
  let currentActivity = "Human-readable activity name";
  try {
    // 1. Build payload via factory
    const payload =
      factory.api.efDynamics.v1.proposalLead.getHttpPostRequestPayload(
        parsedInput,
        parsedInput.protocol,
      );

    // 2. Call API
    currentActivity = "Sending request";
    const result = await api.efDynamics.v1.proposalLead.post(
      payload,
      tokens[CONSTANT.EF_DYNAMICS_API_TOKEN_KEY],
      certificates,
    );

    // 3. Log success and return
    service.logger.info({ rawData: result }, "Success message");
    return { setProposalRequestLead: true };
  } catch (error) {
    service.logger.error(
      { rawError: error },
      `Erro identificado durante a atividade '${currentActivity}': ${error.message}`,
    );
    throw error; // ← Always throw — no graceful degradation
  }
};
```

### Graceful Degradation Pattern

Non-critical activities can follow a **try → fallback to postpone** pattern:

```js
exports.execute = async (...) => {
  try {
    // Try primary action (API call)
    return { actionCompleted: true }
  } catch (error) {
    // Fallback to async processing
    return postponeActivity.execute(...)
  }
}
```

- **Critical activities**: Throw on failure — pipeline aborts.
- **Non-critical activities**: Catch errors internally and delegate to a `postpone*Activity` for later processing.

> **Note**: This project currently has no postpone activities — all activities are critical and throw on failure for SQS retry.

## Error Handling

- `ValidationError` → logged distinctly, then thrown for SQS retry.
- Any other error → `getProcessedDataReport()` snapshot logged for diagnostics, then thrown for SQS retry.
- Activities track `currentActivity` string for contextual error messages.
- Error messages follow the pattern: `Erro identificado durante a atividade '{activity}': {error.message}`

## Module Imports (`require`)

Do **not** use destructuring assignment when requiring same-project files (relative paths). Bind the whole module to a namespace and access its members through that namespace:

```js
// ✅ Correct
const service = require('../../service')
const factory = require('../../factory')
const api = require('../../api')
const CONSTANT = require('../../property')
const errors = require('../../error')

// ❌ Wrong
const { ValidationError } = require('../../error')
```

Destructuring is reserved for third-party packages (e.g., `const { SNSClient } = require('@aws-sdk/client-sns')`).

## Guidelines for New Features

1. **New activity**: Create `{action}Activity.js` in `activity/`, export `execute`, register in `activity/index.js`.
2. **Non-critical activity**: Pair it with a `postpone{Action}Activity.js` that falls back to async processing.
3. **New controller**: Create `{name}Controller.js`, export `process`, register in `controller/index.js`.
4. **Update report**: Add new activity results to `getProcessedDataReport()` in the controller factory.
5. **Never call APIs directly** — always go through activity → factory (payload) → API (HTTP).
6. **Error messages in Portuguese** — follow existing convention for `currentActivity` error messages.
