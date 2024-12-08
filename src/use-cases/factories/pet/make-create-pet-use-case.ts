import { PrismaAdoptRequerimentsRepository } from '@/repositories/prisma/prisma-adopt-requeriments-repository'
import { PrismaPetPhotosRepository } from '@/repositories/prisma/prisma-pet-photos-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { CreatePetUseCase } from '@/use-cases/pet/create-pet-use-case'

export const makeCreatePetUseCase = (): CreatePetUseCase => {
  const petsRepository = new PrismaPetsRepository()
  const petPhotosRepository = new PrismaPetPhotosRepository()
  const adoptRequerimentsRepository = new PrismaAdoptRequerimentsRepository()

  const createPetUseCase = new CreatePetUseCase(
    petsRepository,
    petPhotosRepository,
    adoptRequerimentsRepository,
  )
  return createPetUseCase
}
