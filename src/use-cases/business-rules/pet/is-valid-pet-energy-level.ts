export const MAX_PET_ENERGY_LEVEL = 5
export const MIN_PET_ENERGY_LEVEL = 1

export const isValidPetEnergyLevel = (energyLevel: number): boolean => {
  return (
    !Number.isNaN(energyLevel) &&
    energyLevel >= MIN_PET_ENERGY_LEVEL &&
    energyLevel <= MAX_PET_ENERGY_LEVEL
  )
}
