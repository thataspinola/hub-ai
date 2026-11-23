const isValid = (cpfString) => {
	const cleanupRegex = /[^0-9]*/gm
	let cleanedUpCpf = cpfString.replace(cleanupRegex, '')
	if (cleanedUpCpf.length > 11) {
		return false
	}
	if (cleanedUpCpf.length < 11) {
		cleanedUpCpf = cleanedUpCpf.padStart(11, '0')
	}
	if (!cleanedUpCpf.replace(/[0]*/gm, '').length) {
		return false
	}
	const cpfFirstPart = cleanedUpCpf.substr(0, 3)
	const cpfSecondtPart = cleanedUpCpf.substr(3, 3)
	const cpfThirdPart = cleanedUpCpf.substr(6, 3)
	const cpfVerificatorTens = cleanedUpCpf.substr(9, 1)
	const cpfVerificatorUnits = cleanedUpCpf.substr(10, 1)

	const verificatorTensDigit = verificatorDigitCalculator(
		cpfFirstPart,
		cpfSecondtPart,
		cpfThirdPart
	) //agora só uma função dig

	if (String(verificatorTensDigit) !== String(cpfVerificatorTens)) {
		return false
	}

	const verificatorUnitsDigit = verificatorDigitCalculator(
		cpfFirstPart,
		cpfSecondtPart,
		cpfThirdPart,
		verificatorTensDigit
	) //mesma função dig aqui

	if (cpfVerificatorUnits + '' !== verificatorUnitsDigit + '') {
		return false
	}
	return true
}

function verificatorDigitCalculator(
	firstPartNumberString,
	secondPartNumberString,
	thirdPartNumberString,
	verificatorTensDigit
) {
	//o quarto parametro(verificatorTensDigit) só será recebido para o segundo digito
	const concatenatedAllPartsNumberString = firstPartNumberString
		.split('')
		.concat(secondPartNumberString.split(''), thirdPartNumberString.split('')) //as concatenações todas juntas uma vez que são curtas e legíveis

	if (verificatorTensDigit !== undefined) {
		//se for o dígito verificador da dezena, concatena-se no local correto
		concatenatedAllPartsNumberString[9] = verificatorTensDigit
	}

	let resultingNumberFromRawCalculation = 0
	const allPartsNumberStringSize = verificatorTensDigit !== undefined ? 11 : 10
	//o allPartsNumberStringPosition é também iniciado e incrementado no for para aproveitar a própria sintaxe dele
	//o allPartsNumberStringSizeRelatedMultiplier tem inicios diferentes consoante é 1º ou 2º digito verificador
	for (
		let allPartsNumberStringSizeRelatedMultiplier = allPartsNumberStringSize,
			allPartsNumberStringPosition = 0;
		allPartsNumberStringSizeRelatedMultiplier >= 2;
		allPartsNumberStringSizeRelatedMultiplier--, allPartsNumberStringPosition++
	) {
		resultingNumberFromRawCalculation +=
			parseInt(concatenatedAllPartsNumberString[allPartsNumberStringPosition]) *
			allPartsNumberStringSizeRelatedMultiplier
	}

	const resultingNumberFromElevenModuleCalculation =
		resultingNumberFromRawCalculation % 11
	return resultingNumberFromElevenModuleCalculation < 2
		? 0
		: 11 - resultingNumberFromElevenModuleCalculation //ternário aqui pois ambos os retornos são simples e continua legivel
}

module.exports.isValid = isValid
