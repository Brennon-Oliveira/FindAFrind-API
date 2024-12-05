export const checkIfPhoneIsValid = (phone: string) => {
  const phoneRegex = /^\d{13}$/
  return phoneRegex.test(phone)
}
