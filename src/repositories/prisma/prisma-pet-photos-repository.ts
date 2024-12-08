import { Prisma, PetPhoto } from '@prisma/client'
import { PetPhotosRepository } from '../pet-photos-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetPhotosRepository implements PetPhotosRepository {
  async createMany(
    data: Prisma.PetPhotoUncheckedCreateInput[],
  ): Promise<number> {
    const petPhotos = await prisma.petPhoto.createMany({
      data,
    })

    return petPhotos.count
  }

  async getManyByPetId(petId: string): Promise<PetPhoto[]> {
    const petPhotos = await prisma.petPhoto.findMany({
      where: {
        pet_id: petId,
      },
    })

    return petPhotos
  }

  async allExists(ids: string[]): Promise<boolean> {
    const petPhotosCount = await prisma.petPhoto.count({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return petPhotosCount === ids.length
  }

  async deleteMany(data: string[]): Promise<void> {
    await prisma.petPhoto.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    })
  }
}
