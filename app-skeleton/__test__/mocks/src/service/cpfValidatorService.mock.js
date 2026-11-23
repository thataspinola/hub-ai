exports.VALID_CPF = () => {
	return '06963752060'
}

exports.VALID_CPF_SHORT = () => {
	return '6963752060'
}

exports.INVALID_CPF_BOTH_VERIFICATION_DIGITS = () => {
	return '6963752099'
}

exports.INVALID_CPF_UNIT_VERIFICATION_DIGIT = () => {
	return '6963752068'
}

exports.INVALID_CPF_SIZE = () => {
	return '123456789010'
}

exports.INVALID_CPF_ALLZERO = () => {
	return '00000000000'
}
