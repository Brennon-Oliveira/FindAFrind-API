import { MIN_PAGINATION_PAGE } from '@/use-cases/business-rules/pet/is-valid-pagination-page'

export class InvalidPaginationPageError extends Error {
  constructor() {
    super(`Page must be gratter than ${MIN_PAGINATION_PAGE - 1}`)
  }
}
