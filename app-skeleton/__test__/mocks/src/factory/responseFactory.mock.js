const ERROR_MESSAGE_CONTENT = 'Some error message'

const SUCCESS_BODY_CONTENT_VALUE = {}

const CONFLICT_BODY_CONTENT_VALUE = {
	message: '{CONFLICT_BODY_CONTENT_MESSAGE_VALUE}',
}

exports.DEFAULT_ERROR_RETURN = () => {
	return {
		statusCode: 500,
		body: {
			status: 'error',
		},
	}
}

exports.ERROR_MESSAGE = () => {
	return ERROR_MESSAGE_CONTENT
}

const ERROR_WITH_MESSAGE_RETURN_BODY_VALUE = {
	status: 'error',
	message: ERROR_MESSAGE_CONTENT,
}

exports.ERROR_WITH_MESSAGE_RETURN_BODY_CONTENT = () => {
	return ERROR_WITH_MESSAGE_RETURN_BODY_VALUE
}

exports.ERROR_WITH_MESSAGE_RETURN = () => {
	return {
		statusCode: 500,
		body: ERROR_WITH_MESSAGE_RETURN_BODY_VALUE,
	}
}

exports.DEFAULT_BAD_REQUEST_ERROR_RETURN = () => {
	return {
		statusCode: 400,
		body: {
			status: 'error',
			message: 'The supplied request body is invalid',
		},
	}
}

const BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN_BODY_VALUE = {
	status: 'error',
	message: ERROR_MESSAGE_CONTENT,
}

exports.BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN_BODY_CONTENT = () => {
	return BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN_BODY_VALUE
}

exports.BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN = () => {
	return {
		statusCode: 400,
		body: BAD_REQUEST_ERROR_WITH_MESSAGE_RETURN_BODY_VALUE,
	}
}

exports.SUCCESS_BODY_CONTENT = () => {
	return SUCCESS_BODY_CONTENT_VALUE
}

exports.SUCCESS_RETURN = () => {
	return {
		statusCode: 200,
		body: SUCCESS_BODY_CONTENT_VALUE,
	}
}

exports.CONFLICT_RETURN = () => {
	return {
		statusCode: 409,
		body: {
			status: 'error',
		},
	}
}

exports.CONFLICT_WITH_MESSAGE_RETURN = () => {
	const returnValue = this.CONFLICT_RETURN()
	returnValue.body.message = CONFLICT_BODY_CONTENT_VALUE
	return returnValue
}

exports.CONFLICT_BODY_CONTENT = () => {
	return CONFLICT_BODY_CONTENT_VALUE
}

exports.SUCCESS_EMPTY_BODY_RETURN = () => {
	return {
		statusCode: 200,
		body: [],
	}
}

exports.CONFLICT_RETURN = () => {
	return {
		statusCode: 409,
		body: {
			status: 'error',
		},
	}
}
