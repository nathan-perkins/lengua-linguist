import { queryOptions } from '@tanstack/react-query'
import { fetchVideosByQuery } from './services/fetchVideosByQuery'
import { fetchVideosById } from './services/fetchVideosById'

export const videosQueryById = (activeIdQuery: string) =>
  queryOptions({
    queryKey: ['youtube-search', activeIdQuery],
    queryFn: () => fetchVideosById(activeIdQuery),
    enabled: !!activeIdQuery,
    staleTime: Infinity
  })

export const videosQueryByQuery = (activeQuery: string) =>
  queryOptions({
    queryKey: ['youtube-search', activeQuery],
    queryFn: () => fetchVideosByQuery(activeQuery),
    enabled: !!activeQuery,
    staleTime: Infinity
  })
