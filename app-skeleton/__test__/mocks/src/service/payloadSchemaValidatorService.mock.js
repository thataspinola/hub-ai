exports.VALID_PAYLOAD_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		channel: 'Channel 1',
	}
}
exports.SCHEMA = () => {
	return {
		type: 'object',
		properties: {
			fullName: { type: 'string' },
			cellPhone: { type: 'string', minLength: 10 },
			email: { type: 'string', format: 'email' },
			channel: {
				enum: ['Channel 1', 'Channel 2'],
			},
		},
		required: ['fullName', 'cellPhone', 'email', 'channel'],
	}
}
exports.SCHEMA_ANYOF = () => {
	return {
		anyOf: [
			{
				type: 'object',
				properties: {
					fullName: { type: 'string' },
					cellPhone: { type: 'string', minLength: 10 },
					email: { type: 'string', format: 'email' },
					channel: {
						enum: ['Channel 1', 'Channel 2'],
					},
					cpf: { type: 'string', format: 'cpf' },
					cnpj: { type: 'string' },
				},
				required: ['fullName', 'cellPhone', 'email', 'channel', 'cpf'],
			},
			{
				type: 'object',
				properties: {
					fullName: { type: 'string' },
					cellPhone: { type: 'string', minLength: 10 },
					email: { type: 'string', format: 'email' },
					channel: {
						enum: ['Channel 1', 'Channel 2'],
					},
					cpf: { type: 'string', format: 'cpf' },
					cnpj: { type: 'string' },
				},
				required: ['fullName', 'cellPhone', 'email', 'channel', 'cnpj'],
			},
		],
	}
}

exports.INVALID_ANYOF_PAYLOAD_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		channel: 'Channel 1',
	}
}

exports.VALID_ANYOF_PAYLOAD_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		channel: 'Channel 1',
		cpf: '06963752060',
	}
}

exports.VALID_PAYLOAD_CPF_CNPJ_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		cpf: '06963752060',
		cnpj: '29259881000141',
		channel: 'Channel 1',
	}
}
exports.SCHEMA_CPF_CNPJ = () => {
	return {
		type: 'object',
		properties: {
			fullName: { type: 'string' },
			cellPhone: { type: 'string', minLength: 10 },
			email: { type: 'string', format: 'email' },
			cpf: { type: 'string', format: 'cpf' },
			cnpj: { type: 'string' },
			channel: {
				enum: ['Channel 1', 'Channel 2'],
			},
		},
		required: ['fullName', 'cellPhone', 'email', 'channel'],
	}
}
exports.INVALID_PAYLOAD_CPF_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		cpf: '06963752061',
		cnpj: '29259881000141',
		channel: 'Channel 1',
	}
}

exports.INVALID_PAYLOAD_CNPJ_DATA = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		cpf: '06963752060',
		cnpj: 12345,
		channel: 'Channel 1',
	}
}

exports.INVALID_PAYLOAD_DATA_MISSING_PROPERTY = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
	}
}
exports.INVALID_PAYLOAD_DATA_MISSING_PROPERTY_NAME = () => {
	return 'channel'
}
exports.INVALID_PAYLOAD_DATA_WRONG_TYPE_PROPERTY = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: false,
		email: 'some@domainemail.com',
		channel: 'Channel 1',
	}
}
exports.INVALID_PAYLOAD_DATA_WRONG_TYPE_PROPERTY_NAME = () => {
	return 'cellPhone'
}
exports.INVALID_PAYLOAD_DATA_WRONG_SIZE_PROPERTY = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '123',
		email: 'some@domainemail.com',
		channel: 'Channel 1',
	}
}
exports.INVALID_PAYLOAD_DATA_WRONG_SIZE_PROPERTY_NAME = () => {
	return 'cellPhone'
}
exports.INVALID_PAYLOAD_DATA_WRONG_VALUE_PROPERTY = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'some@domainemail.com',
		channel: 'Channel 3',
	}
}
exports.INVALID_PAYLOAD_DATA_WRONG_VALUE_PROPERTY_NAME = () => {
	return 'channel'
}
exports.INVALID_PAYLOAD_DATA_WRONG_FORMAT_PROPERTY = () => {
	return {
		fullName: 'Nomenelson Sobrenomelense',
		cellPhone: '11987456322',
		email: 'somedomainemail.com',
		channel: 'Channel 1',
	}
}
exports.INVALID_PAYLOAD_DATA_WRONG_FORMAT_PROPERTY_NAME = () => {
	return 'email'
}
