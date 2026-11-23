exports.isValid = (value) => {
  if (typeof value !== 'string' || !/^[0-9. -]+$/.test(value)) return false
  const digits = value.replace(/[^0-9]/g, '').padStart(11, '0')
  if (digits.length !== 11 || new Set(digits).size === 1) return false
  for (const length of [9, 10]) {
    let sum = 0
    for (let index = 0; index < length; index++) sum += Number(digits[index]) * (length + 1 - index)
    const remainder = sum % 11
    const checkDigit = remainder < 2 ? 0 : 11 - remainder
    if (Number(digits[length]) !== checkDigit) return false
  }
  return true
}
