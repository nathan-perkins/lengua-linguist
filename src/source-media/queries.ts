import { queryOptions } from '@tanstack/react-query'
import type { QueryStatus } from './types'
import { youtubeService } from './services/youtubeService'
import type { YouTubeSearchResult, YouTubeVideo } from './schemas'

export const createSearchQueryOptions = (query: string, status: QueryStatus) =>
  queryOptions({
    queryKey: ['search-list', query],
    enabled: status === 'active',
    queryFn: async (): Promise<YouTubeSearchResult[]> => youtubeService.search(query),
    staleTime: Infinity
  })

export const createVideoQueryOptions = (videoId: string, status: QueryStatus) =>
  queryOptions({
    queryKey: ['videos-list', videoId],
    enabled: status === 'active',
    queryFn: async (): Promise<YouTubeVideo[]> => youtubeService.videos(videoId),
    staleTime: Infinity
  })
