import { Prisma, Pet } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      about: data.about,
      age: data.age,
      adopted_at: null,
      energy_level: data.energy_level,
      environment: data.environment,
      size: data.size,
      org_id: data.org_id,
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

  async getManyByOrgId(orgId: string): Promise<Pet[]> {
    const pets = this.items.filter((item) => item.org_id === orgId)

    return pets
  }

  async getManyByCity(
    city: string,
    pagination: {
      page: number
      size: number
    },
  ): Promise<{ id: string; name: string }[]> {
    const orgsIds = this.orgsRepository.items
      .filter((org) => org.city === city)
      .map((org) => org.id)

    const pets = this.items
      .filter((pet) => orgsIds.includes(pet.org_id))
      .splice((pagination.page - 1) * pagination.size, pagination.size)
      .map((pet) => ({ name: pet.name, id: pet.id }))

    return pets
  }

  async getTotalByCity(city: string): Promise<number> {
    const orgsIds = this.orgsRepository.items
      .filter((org) => org.city === city)
      .map((org) => org.id)

    const total = this.items.filter((pet) =>
      orgsIds.includes(pet.org_id),
    ).length

    return total
  }
}
