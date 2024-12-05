export const checkIfEmailIsValid = (email: string) => {
  const emailRegex = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/
  return emailRegex.test(email)
}
