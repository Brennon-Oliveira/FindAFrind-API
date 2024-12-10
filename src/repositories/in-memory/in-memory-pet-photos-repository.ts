import { PetPhoto, Prisma } from '@prisma/client'
import { PetPhotosRepository } from '../pet-photos-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetPhotosRepository implements PetPhotosRepository {
  items: PetPhoto[] = []

  async createMany(
    data: Prisma.PetPhotoUncheckedCreateInput[],
  ): Promise<number> {
    const items: PetPhoto[] = data.map((item) => ({
      id: randomUUID(),
      pet_id: item.pet_id,
      url: item.url,
    }))

    this.items = this.items.concat(items)

    return items.length
  }

  async getManyByPetId(petId: string): Promise<PetPhoto[]> {
    const items = this.items.filter((item) => item.pet_id === petId)

    return items
  }

  async allExists(ids: string[]): Promise<boolean> {
    const items = this.items.filter((item) => ids.includes(item.id))

    if (items.length === ids.length) {
      return true
    }
    return false
  }

  async deleteMany(data: string[]): Promise<void> {
    this.items = this.items.filter((item) => !data.includes(item.id))
  }
}
