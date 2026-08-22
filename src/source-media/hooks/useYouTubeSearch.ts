import { useQuery } from '@tanstack/react-query'
import type { QueryStatus } from '../types'
import { mediaQueryOptions } from '../queries'

export function useYouTubeSearch(rawQuery: string) {
  const input = rawQuery.trim()
  const status: QueryStatus = input ? 'active' : 'idle'

  const {
    data: searchResults = [],
    isPending,
    isError,
    error
  } = useQuery(mediaQueryOptions.search(input, status))

  return {
    searchResults,
    isSearchPending: isPending,
    isSearchError: isError,
    searchError: error
  }
}
