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
    }),

  videos: (videoIds: string, status: QueryStatus) =>
    queryOptions({
      queryKey: ['youtube-videos', videoIds],
      queryFn: async (): Promise<YouTubeVideo[]> => youtubeService.videos(videoIds),
      enabled: status === 'active',
      staleTime: Infinity
    })
}
