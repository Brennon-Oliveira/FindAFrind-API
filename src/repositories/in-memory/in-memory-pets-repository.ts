import { Prisma, Pet } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  items: Pet[] = []

  async create(data: Prisma.PetCreateInput): Promise<Pet> {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      energy_level: data.energy_level,
      environment: data.environment,
      size: data.size,
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async save(data: Pet): Promise<Pet> {
    const petIndex = this.items.findIndex((item) => item.id === data.id)

    if (petIndex >= 0) {
      this.items[petIndex] = data
    }

    return data
  }
}
