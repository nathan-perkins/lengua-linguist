import { queryOptions } from '@tanstack/react-query'
import type { SearchResponse, VideoResponse, QueryStatus } from './types'
import { fetchVideosByQuery, fetchVideosByIds } from './services/videoService'

export const createSearchQueryOptions = (query: string, status: QueryStatus) =>
  queryOptions({
    queryKey: ['search-list', query],
    enabled: status === 'active',
    queryFn: async (): Promise<SearchResponse[]> => fetchVideosByQuery(query),
    staleTime: Infinity
  })

export const createVideoQueryOptions = (videoIds: string[], status: QueryStatus) =>
  queryOptions({
    queryKey: ['videos-list', videoIds],
    enabled: status === 'active',
    queryFn: async (): Promise<VideoResponse[]> => fetchVideosByIds(videoIds),
    staleTime: Infinity
  })
