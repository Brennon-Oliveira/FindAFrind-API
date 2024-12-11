import { Pet, Prisma } from '@prisma/client'

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  save(data: Pet): Promise<Pet>
  getManyByOrgId(orgId: string): Promise<Pet[]>
  getManyByCity(
    city: string,
    pagination: {
      page: number
      size: number
    },
  ): Promise<{ id: string; name: string }[]>
  getTotalByCity(city: string): Promise<number>
}
