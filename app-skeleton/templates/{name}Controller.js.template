const service = require("../service")
const activity = require("./activity")

exports.process = async (parsedInput) => {
  try {
    activity.inputValidation.execute(parsedInput)
    const returnValue =
      await activity.build{name}ControllerReturn.execute(parsedInput)

    return returnValue
  } catch (error) {
    let processingErrorMessage = `Erro no processamento {CONTROLLER PURPOSE MESSAGE}: ${error.message}`

    if (error.name === "ValidationError") {
      processingErrorMessage =
        "Erro no processamento {CONTROLLER PURPOSE MESSAGE}: Estrutura ou dado inválido."
    }

    service.logger.error({ rawError: error }, processingErrorMessage)

    throw new Error(processingErrorMessage, { cause: error })
  }
};
