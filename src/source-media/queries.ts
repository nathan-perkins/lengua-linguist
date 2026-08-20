import { queryOptions } from '@tanstack/react-query'
import type { VideoResponse, QueryStatus } from './types'
import { fetchVideosByIds, youtubeService } from './services/youtubeService'
import type { YouTubeSearchResult } from './schemas'

export const createSearchQueryOptions = (query: string, status: QueryStatus) =>
  queryOptions({
    queryKey: ['search-list', query],
    enabled: status === 'active',
    queryFn: async (): Promise<YouTubeSearchResult[]> => youtubeService.search(query),
    staleTime: Infinity
  })

export const createVideoQueryOptions = (videoIds: string[], status: QueryStatus) =>
  queryOptions({
    queryKey: ['videos-list', videoIds],
    enabled: status === 'active',
    queryFn: async (): Promise<VideoResponse[]> => fetchVideosByIds(videoIds),
    staleTime: Infinity
  })
