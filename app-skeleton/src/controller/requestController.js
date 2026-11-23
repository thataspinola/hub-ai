const activity = require('./activity')

exports.process = async (parsedInput) => {
  activity.inputValidation.execute(parsedInput)
  return activity.buildRequestReturn.execute()
}
