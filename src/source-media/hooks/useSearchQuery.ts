import { useQuery } from '@tanstack/react-query'
import type { QueryStatus } from '../types'
import { createSearchQueryOptions } from '../queries'

export function useSearchQuery(rawQuery: string) {
  const input = rawQuery.trim()
  const status: QueryStatus = input ? 'active' : 'idle'

  const {
    data: videos = [],
    isPending,
    isError,
    error
  } = useQuery(createSearchQueryOptions(input, status))

  return {
    videos,
    isPending,
    isError,
    error
  }
}
