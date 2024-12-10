export const MIN_PAGINATION_PAGE = 1
export const DEFAULT_PAGINATION_PAGE = 1

export const isValidPaginationPage = (page: number): boolean => {
  if (page < MIN_PAGINATION_PAGE) {
    return false
  }
  return true
}
