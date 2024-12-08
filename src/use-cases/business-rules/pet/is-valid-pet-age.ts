export const isValidPetAge = (age: number): boolean => {
  return !Number.isNaN(age) && age >= 0 && age < Infinity
}
