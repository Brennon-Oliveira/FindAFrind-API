import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { compare } from 'bcrypt'

interface AuthenticateOnOrgUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateOnOrgUseCaseResponse {
  org: Org
}

export class AuthenticateOnOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOnOrgUseCaseRequest): Promise<AuthenticateOnOrgUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const isPasswordCorrect = await compare(password, org.password_hash)

    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError()
    }

    return { org }
  }
}
