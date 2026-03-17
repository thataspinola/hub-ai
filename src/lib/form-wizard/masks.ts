// CPF Mask: 000.000.000-00
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, "")
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "")

  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(digits[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(digits[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(digits[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== Number.parseInt(digits[10])) return false

  return true
}

// CNPJ Mask: 00.000.000/0000-00
export function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, "")
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "")

  if (digits.length !== 14) return false
  if (/^(\d)\1{13}$/.test(digits)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(digits[i]) * weights1[i]
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder
  if (firstDigit !== Number.parseInt(digits[12])) return false

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(digits[i]) * weights2[i]
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder
  if (secondDigit !== Number.parseInt(digits[13])) return false

  return true
}

// Phone Mask: (00) 00000-0000 or (00) 0000-0000
export function maskPhone(value: string, allowInternational = false): string {
  let digits = value.replace(/\D/g, "")

  if (allowInternational && digits.startsWith("55")) {
    digits = digits.slice(2)
  }

  digits = digits.slice(0, 11)

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  } else {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
  }
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "")
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")

  if (digits.length < 10 || digits.length > 11) return false

  const ddd = Number.parseInt(digits.slice(0, 2))
  const validDDDs = [
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24,
    27, 28,
    31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46,
    47, 48, 49,
    51, 53, 54, 55,
    61,
    62, 64,
    63,
    65, 66,
    67,
    68,
    69,
    71, 73, 74, 75, 77,
    79,
    81, 87,
    82,
    83,
    84,
    85, 88,
    86, 89,
    91, 93, 94,
    92, 97,
    95,
    96,
    98, 99,
  ]

  if (!validDDDs.includes(ddd)) return false
  if (digits.length === 11 && digits[2] !== "9") return false

  return true
}
