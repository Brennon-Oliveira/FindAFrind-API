export const checkIfCepIsValid = (cep: string) => {
  const cepRegex = /^\d{8}$/
  return cepRegex.test(cep)
}
