import { queryOptions } from '@tanstack/react-query'
import type { VideoOption, VideoQueryMode } from './types'
import { fetchVideosByQuery } from './services/fetchVideosByQuery'
import { fetchVideosById } from './services/fetchVideosById'

export const createVideoQueryOptions = (query: string, mode: VideoQueryMode) =>
  queryOptions({
    queryKey: ['youtube-search', query],
    enabled: mode !== 'idle',
    queryFn: async (): Promise<VideoOption[]> => {
      if (mode === 'id') return fetchVideosById(query)
      if (mode === 'query') return fetchVideosByQuery(query)
      return []
    }
  })
