import { PrismaAdoptRequerimentsRepository } from '@/repositories/prisma/prisma-adopt-requeriments-repository'
import { PrismaPetPhotosRepository } from '@/repositories/prisma/prisma-pet-photos-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { UpdatePetUseCase } from '@/use-cases/pet/update-pet-use-case'

export const makeUpdatePetUseCase = (): UpdatePetUseCase => {
  const petsRepository = new PrismaPetsRepository()
  const petPhotosRepository = new PrismaPetPhotosRepository()
  const adoptRequerimentsRepository = new PrismaAdoptRequerimentsRepository()

  const createPetUseCase = new UpdatePetUseCase(
    petsRepository,
    petPhotosRepository,
    adoptRequerimentsRepository,
  )
  return createPetUseCase
}
