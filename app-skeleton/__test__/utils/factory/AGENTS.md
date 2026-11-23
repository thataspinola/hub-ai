# `__test__/utils/factory` — Local runner & test utilities factories

## Purpose

Provides factories to allow handler payload mock construction (payload for AWS handlers). This folder is **excluded from Jest test discovery** via `testPathIgnorePatterns` in `jest.config.js`. **No side effects** — factories are pure functions that transform input into output.

## Folder Structure

```
__test__/utils/factory/
└── {transport}MockedLambdaPayloadFactory.js # Message/Handling transport type mocked lambda payload factory
```

## File Naming

- **Pattern**: `{transport}MockedLambdaPayloadFactory.js` in camelCase (e.g., `sqsMockedLambdaPayloadFactory.js`, `snsMockedLambdaPayloadFactory.js`).

### Pattern

Each factory exports a single `getPayload(records)` function that returns a transport-specific Lambda event envelope. Shape the payload to match the real AWS event structure for the transport type.

#### SQS — `sqsMockedLambdaPayloadFactory.js`

```js
const nodeCrypto = require("node:crypto");

exports.getPayload = (queueRecordsBody) => {
  const records = [];
  for (const body of queueRecordsBody) {
    const now = new Date();
    records.push({
      messageId: nodeCrypto.randomUUID(),
      receiptHandle: "MessageReceiptHandle",
      body,
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: `${now.getTime() - 8754}`,
        SenderId: "791702935403",
        ApproximateFirstReceiveTimestamp: `${now.getTime() - 7000}`,
      },
      messageAttributes: {},
      md5OfBody: nodeCrypto.createHash("md5").update(body).digest("hex"),
      eventSource: "aws:sqs",
      eventSourceARN: "arn:aws:sqs:ca-central-1:791702935403:{queue-name}",
      awsRegion: "ca-central-1",
    });
  }
  return { Records: records };
};
```

#### SNS — `snsMockedLambdaPayloadFactory.js`

```js
const nodeCrypto = require("node:crypto");

exports.getPayload = (messages) => {
  const records = [];
  for (const message of messages) {
    const now = new Date();
    records.push({
      EventSource: "aws:sns",
      EventVersion: "1.0",
      EventSubscriptionArn:
        "arn:aws:sns:ca-central-1:791702935403:{topic-name}:{subscription-id}",
      Sns: {
        Type: "Notification",
        MessageId: nodeCrypto.randomUUID(),
        TopicArn: "arn:aws:sns:ca-central-1:791702935403:{topic-name}",
        Subject: null,
        Message: message,
        Timestamp: now.toISOString(),
        SignatureVersion: "1",
        Signature: "EXAMPLE",
        SigningCertUrl: "EXAMPLE",
        UnsubscribeUrl: "EXAMPLE",
        MessageAttributes: {},
      },
    });
  }
  return { Records: records };
};
```

#### API Gateway (REST) — `apiGatewayMockedLambdaPayloadFactory.js`

```js
exports.getPayload = ({
  method = "GET",
  path = "/",
  pathParameters = null,
  queryStringParameters = null,
  body = null,
  headers = {},
} = {}) => ({
  version: "1.0",
  resource: path,
  path,
  httpMethod: method,
  headers: {
    "Content-Type": "application/json",
    ...headers,
  },
  multiValueHeaders: {},
  queryStringParameters,
  multiValueQueryStringParameters: null,
  pathParameters,
  stageVariables: null,
  requestContext: {
    resourcePath: path,
    httpMethod: method,
    requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    requestTime: new Date().toISOString(),
    stage: "local",
    accountId: "791702935403",
  },
  body: body !== null ? JSON.stringify(body) : null,
  isBase64Encoded: false,
});
```

#### EventBridge / CloudWatch Events — `eventBridgeMockedLambdaPayloadFactory.js`

```js
const nodeCrypto = require("node:crypto");

exports.getPayload = ({ source, detailType, detail = {} } = {}) => ({
  version: "0",
  id: nodeCrypto.randomUUID(),
  source,
  account: "791702935403",
  time: new Date().toISOString(),
  region: "ca-central-1",
  resources: [],
  "detail-type": detailType,
  detail,
});
```
