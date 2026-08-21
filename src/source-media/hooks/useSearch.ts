import { useQuery } from '@tanstack/react-query'
import type { QueryStatus } from '../types'
import { createSearchQueryOptions } from '../queries'

export function useSearch(rawQuery: string) {
  const input = rawQuery.trim()
  const status: QueryStatus = input ? 'active' : 'idle'

  const {
    data: searchResults = [],
    isPending,
    isError,
    error
  } = useQuery(createSearchQueryOptions(input, status))

  return {
    searchResults,
    isSearchPending: isPending,
    isSearchError: isError,
    searchError: error
  }
}
