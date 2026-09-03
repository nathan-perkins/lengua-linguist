import { useQuery } from '@tanstack/react-query'
import type { QueryStatus } from '../types'
import { mediaQueryOptions } from '../queries'

export function useYouTubeVideo(rawIds: string[]) {
  const videoIds = rawIds.toString().trim()
  const status: QueryStatus = videoIds ? 'active' : 'idle'

  const {
    data: videoResults = [],
    isPending,
    isError,
    error
  } = useQuery(mediaQueryOptions.videos(videoIds, status))

  return {
    videoResults,
    isVideoPending: isPending,
    isVideoError: isError,
    videoError: error
  }
}
