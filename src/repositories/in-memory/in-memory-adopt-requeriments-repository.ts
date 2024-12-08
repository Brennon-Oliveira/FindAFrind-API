import { AdoptRequeriment, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { AdoptRequerimentsRepository } from '../adopt-requeriments-repository'

export class InMemoryAdoptRequerimentsRepository
  implements AdoptRequerimentsRepository
{
  items: AdoptRequeriment[] = []
  async createMany(
    data: Prisma.AdoptRequerimentUncheckedCreateInput[],
  ): Promise<AdoptRequeriment[]> {
    const items: AdoptRequeriment[] = data.map((item) => ({
      id: randomUUID(),
      pet_id: item.pet_id,
      requeriment: item.requeriment,
    }))

    this.items = this.items.concat(items)

    return items
  }

  async getManyByPetId(petId: string): Promise<AdoptRequeriment[]> {
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
