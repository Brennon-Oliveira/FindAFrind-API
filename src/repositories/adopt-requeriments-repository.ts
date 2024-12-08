import { AdoptRequeriment, Prisma } from '@prisma/client'

export interface AdoptRequerimentsRepository {
  createMany(
    data: Prisma.AdoptRequerimentUncheckedCreateInput[],
  ): Promise<number>
  getManyByPetId(petId: string): Promise<AdoptRequeriment[]>
  allExists(ids: string[]): Promise<boolean>
  deleteMany(data: string[]): Promise<void>
}
