import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import {
  DEFAULT_PAGINATION_PAGE,
  isValidPaginationPage,
} from '../business-rules/pet/is-valid-pagination-page'
import {
  DEFAULT_PAGINATION_SIZE,
  isValidPaginationSize,
} from '../business-rules/pet/is-valid-pagination-size'
import { InvalidPaginationPageError } from '../errors/pagination/invalid-pagination-page-error'
import { InvalidPaginationSizeError } from '../errors/pagination/invalid-pagination-size-error'

interface GetPetsFromCityUseCaseRequest {
  city: string
  page?: number
  pageSize?: number
}

interface GetPetsFromCityUseCaseResponse {
  pets: {
    id: string
    name: string
  }[]
}

export class GetPetsFromCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    page,
    pageSize,
  }: GetPetsFromCityUseCaseRequest): Promise<GetPetsFromCityUseCaseResponse> {
    page = page ?? DEFAULT_PAGINATION_PAGE
    pageSize = pageSize ?? DEFAULT_PAGINATION_SIZE

    if (!isValidPaginationPage(page)) {
      throw new InvalidPaginationPageError()
    }

    if (!isValidPaginationSize(pageSize)) {
      throw new InvalidPaginationSizeError()
    }

    const pets = await this.petsRepository.getManyByCity(city, {
      page,
      size: pageSize,
    })

    return { pets }
  }
}
