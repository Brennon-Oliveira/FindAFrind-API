import {
  MAX_PAGINATION_SIZE,
  MIN_PAGINATION_SIZE,
} from '@/use-cases/business-rules/pet/is-valid-pagination-size'

export class InvalidPaginationSizeError extends Error {
  constructor() {
    super(
      `Pagination size must be gratter than ${MIN_PAGINATION_SIZE - 1} and lower than ${MAX_PAGINATION_SIZE + 1}`,
    )
  }
}
