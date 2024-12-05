import { OrgsRepository } from '@/repositories/orgs-repository'
import { checkIfCepIsValid } from '@/utils/check-if-cep-is-valid'
import { Org } from '@prisma/client'
import { InvalidCepError } from '../errors/invalid-data-errors/invalid-cep-error'
import { checkIfPhoneIsValid } from '@/utils/check-if-phone-is-valid'
import { InvalidPhoneError } from '../errors/invalid-data-errors/invalid-phone-error'
import { OrgNotFoundError } from '../errors/resource-not-found-errors/org-not-found-error'

interface UpdateOrgUseCaseRequest {
  id: string
  representant_name: string
  cep: string
  address: string
  phone: string
}

interface UpdateOrgUseCaseResponse {
  org: Org
}

export class UpdateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    id,
    representant_name,
    cep,
    address,
    phone,
  }: UpdateOrgUseCaseRequest): Promise<UpdateOrgUseCaseResponse> {
    const isCepValid = checkIfCepIsValid(cep)

    if (!isCepValid) {
      throw new InvalidCepError()
    }

    const isPhoneValid = checkIfPhoneIsValid(phone)

    if (!isPhoneValid) {
      throw new InvalidPhoneError()
    }

    const oldOrg = await this.orgsRepository.findById(id)

    if (!oldOrg) {
      throw new OrgNotFoundError()
    }

    const newOrg = {
      ...oldOrg,
      representant_name,
      address,
      cep,
      phone,
    }

    const org = await this.orgsRepository.save(newOrg)

    return {
      org,
    }
  }
}
