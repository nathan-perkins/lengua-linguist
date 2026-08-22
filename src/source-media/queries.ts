import { queryOptions } from '@tanstack/react-query'
import type { QueryStatus } from './types'
import { youtubeService } from './services/youtubeService'
import type { YouTubeVideo } from './schemas'

export const mediaQueryOptions = {
  search: (query: string, status: QueryStatus) =>
    queryOptions({
      queryKey: ['youtube-search', query],
      queryFn: async (): Promise<YouTubeVideo[]> => youtubeService.search(query),
      enabled: status === 'active',
      staleTime: Infinity
    })
}

export const createVideoQueryOptions = (videoId: string, status: QueryStatus) =>
  queryOptions({
    queryKey: ['videos-list', videoId],
    enabled: status === 'active',
    queryFn: async (): Promise<YouTubeVideo[]> => youtubeService.videos(videoId),
    staleTime: Infinity
  })
