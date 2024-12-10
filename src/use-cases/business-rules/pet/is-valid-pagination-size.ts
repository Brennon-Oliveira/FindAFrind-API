export const MIN_PAGINATION_SIZE = 1
export const MAX_PAGINATION_SIZE = 50
export const DEFAULT_PAGINATION_SIZE = 20

export const isValidPaginationSize = (size: number): boolean => {
  if (size < MIN_PAGINATION_SIZE || size > MAX_PAGINATION_SIZE) {
    return false
  }
  return true
}
