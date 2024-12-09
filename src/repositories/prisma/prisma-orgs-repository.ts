import { Prisma, Org } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'
import { prisma } from '@/lib/prisma'

export class PrismaOrgsRepository implements OrgsRepository {
  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = await prisma.org.create({
      data,
    })

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    })

    return org
  }

  async findById(id: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    })

    return org
  }

  async save(data: Org): Promise<Org> {
    const org = await prisma.org.update({
      data,
      where: {
        id: data.id,
      },
    })

    return org
  }

  async existsById(id: string): Promise<boolean> {
    const count = await prisma.org.count({
      where: {
        id,
      },
    })

    return count > 0
  }
}
