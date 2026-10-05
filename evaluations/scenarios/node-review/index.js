// Deliberately flawed synthetic input for reviewer evaluation; never deploy.
const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge')
const client = new EventBridgeClient({})
exports.handler = async event => {
  console.log('credentials', event.credentials)
  await client.send(new PutEventsCommand({ Entries: event.entries }))
  return { success: true }
}
