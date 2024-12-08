import { Prisma, AdoptRequeriment } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { AdoptRequerimentsRepository } from '../adopt-requeriments-repository'

export class PrismaAdoptRequerimentsRepository
  implements AdoptRequerimentsRepository
{
  async createMany(
    data: Prisma.AdoptRequerimentUncheckedCreateInput[],
  ): Promise<number> {
    const adoptRequeriments = await prisma.adoptRequeriment.createMany({
      data,
    })

    return adoptRequeriments.count
  }

  async getManyByPetId(petId: string): Promise<AdoptRequeriment[]> {
    const adoptRequeriments = await prisma.adoptRequeriment.findMany({
      where: {
        pet_id: petId,
      },
    })

    return adoptRequeriments
  }

  async allExists(ids: string[]): Promise<boolean> {
    const adoptRequerimentsCount = await prisma.adoptRequeriment.count({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return adoptRequerimentsCount === ids.length
  }

  async deleteMany(data: string[]): Promise<void> {
    await prisma.adoptRequeriment.deleteMany({
      where: {
        id: {
          in: data,
        },
      },
    })
  }
}
