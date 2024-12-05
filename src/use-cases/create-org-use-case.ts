import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcrypt'
import { checkIfCepIsValid } from '@/utils/check-if-cep-is-valid'
import { DuplicatedEmailError } from './errors/duplicated-email-error'
import { checkIfPhoneIsValid } from '@/utils/check-if-phone-is-valid'
import { checkIfEmailIsValid } from '@/utils/check-if-email-is-valid'
import { InvalidCepError } from './errors/invalid-data-errors/invalid-cep-error'
import { InvalidPhoneError } from './errors/invalid-data-errors/invalid-phone-error'
import { InvalidEmailError } from './errors/invalid-data-errors/invalid-email-error'

interface CreateOrgUseCaseRequest {
  representant_name: string
  cep: string
  address: string
  email: string
  password: string
  phone: string
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    representant_name,
    cep,
    address,
    email,
    password,
    phone,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const isCepValid = checkIfCepIsValid(cep)

    if (!isCepValid) {
      throw new InvalidCepError()
    }

    const isPhoneValid = checkIfPhoneIsValid(phone)

    if (!isPhoneValid) {
      throw new InvalidPhoneError()
    }

    const isEmailValid = checkIfEmailIsValid(email)

    if (!isEmailValid) {
      throw new InvalidEmailError()
    }

    const haveDuplicatedEmail = await this.orgsRepository.findByEmail(email)

    if (haveDuplicatedEmail) {
      throw new DuplicatedEmailError()
    }

    const password_hash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      representant_name,
      address,
      cep,
      email,
      phone,
      password_hash,
    })

    return { org }
  }
}
