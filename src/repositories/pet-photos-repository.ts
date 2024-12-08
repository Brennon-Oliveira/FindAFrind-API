import { PetPhoto, Prisma } from '@prisma/client'

export interface PetPhotosRepository {
  createMany(data: Prisma.PetPhotoUncheckedCreateInput[]): Promise<PetPhoto[]>
  getManyByPetId(petId: string): Promise<PetPhoto[]>
  allExists(ids: string[]): Promise<boolean>
  deleteMany(data: string[]): Promise<void>
}
