import { Prisma, Pet } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async save(data: Pet): Promise<Pet> {
    const pet = await prisma.pet.update({
      data,
      where: {
        id: data.id,
      },
    })

    return pet
  }

  async getManyByOrgId(orgId: string): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        org_id: orgId,
      },
    })

    return pets
  }

  async getManyByCity(
    city: string,
    pagination: {
      page: number
      size: number
    },
  ): Promise<Pet[]> {
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
        },
      },
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
    })
    return pets
  }
}
