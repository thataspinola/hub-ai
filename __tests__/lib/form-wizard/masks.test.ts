import {
  maskCPF, unmaskCPF, validateCPF,
  maskCNPJ, unmaskCNPJ, validateCNPJ,
  maskPhone, unmaskPhone,
} from '@/lib/form-wizard/masks'

describe('CPF', () => {
  describe('maskCPF', () => {
    it('formats a full CPF', () => {
      expect(maskCPF('12345678901')).toBe('123.456.789-01')
    })

    it('formats partial CPF', () => {
      expect(maskCPF('1234')).toBe('123.4')
    })

    it('strips non-digit characters', () => {
      expect(maskCPF('123.456')).toBe('123.456')
    })

    it('limits to 11 digits', () => {
      expect(maskCPF('123456789012345')).toBe('123.456.789-01')
    })
  })

  describe('unmaskCPF', () => {
    it('removes formatting', () => {
      expect(unmaskCPF('123.456.789-01')).toBe('12345678901')
    })
  })

  describe('validateCPF', () => {
    it('validates a correct CPF', () => {
      expect(validateCPF('529.982.247-25')).toBe(true)
    })

    it('rejects CPF with wrong length', () => {
      expect(validateCPF('123')).toBe(false)
    })

    it('rejects all-same-digit CPFs', () => {
      expect(validateCPF('111.111.111-11')).toBe(false)
      expect(validateCPF('000.000.000-00')).toBe(false)
    })

    it('rejects invalid check digits', () => {
      expect(validateCPF('529.982.247-26')).toBe(false)
    })
  })
})

describe('CNPJ', () => {
  describe('maskCNPJ', () => {
    it('formats a full CNPJ', () => {
      expect(maskCNPJ('11222333000181')).toBe('11.222.333/0001-81')
    })

    it('formats partial CNPJ', () => {
      expect(maskCNPJ('11222')).toBe('11.222')
    })

    it('limits to 14 digits', () => {
      expect(maskCNPJ('1122233300018199')).toBe('11.222.333/0001-81')
    })
  })

  describe('unmaskCNPJ', () => {
    it('removes formatting', () => {
      expect(unmaskCNPJ('11.222.333/0001-81')).toBe('11222333000181')
    })
  })

  describe('validateCNPJ', () => {
    it('validates a correct CNPJ', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true)
    })

    it('rejects CNPJ with wrong length', () => {
      expect(validateCNPJ('123')).toBe(false)
    })

    it('rejects all-same-digit CNPJs', () => {
      expect(validateCNPJ('11.111.111/1111-11')).toBe(false)
    })

    it('rejects invalid check digits', () => {
      expect(validateCNPJ('11.222.333/0001-82')).toBe(false)
    })
  })
})

describe('Phone', () => {
  describe('maskPhone', () => {
    it('formats a mobile phone (11 digits)', () => {
      expect(maskPhone('11987654321')).toBe('(11) 98765-4321')
    })

    it('formats a landline (10 digits)', () => {
      expect(maskPhone('1134567890')).toBe('(11) 3456-7890')
    })

    it('strips country code when allowInternational', () => {
      expect(maskPhone('5511987654321', true)).toBe('(11) 98765-4321')
    })

    it('formats partial phone number', () => {
      expect(maskPhone('119876')).toBe('(11) 9876')
    })
  })

  describe('unmaskPhone', () => {
    it('removes formatting', () => {
      expect(unmaskPhone('(11) 98765-4321')).toBe('11987654321')
    })
  })
})
