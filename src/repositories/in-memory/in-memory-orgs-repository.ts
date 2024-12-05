import { Prisma, Org } from '@prisma/client'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { randomUUID } from 'crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  items: Org[] = []

  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const newOrg: Org = {
      id: data.id ?? randomUUID(),
      address: data.address,
      cep: data.cep,
      email: data.email,
      password_hash: data.password_hash,
      phone: data.phone,
      representant_name: data.representant_name,
    }
    this.items.push(newOrg)

    return newOrg
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.items.find((item) => item.email === email)

    if (!org) return null

    return org
  }

  async findById(id: string): Promise<Org | null> {
    const org = this.items.find((item) => item.id === id)

    if (!org) return null

    return org
  }

  async save(data: Org): Promise<Org> {
    const orgIndex = this.items.findIndex((item) => item.id === data.id)

    if (orgIndex >= 0) {
      this.items[orgIndex] = data
    }

    return data
  }
}
