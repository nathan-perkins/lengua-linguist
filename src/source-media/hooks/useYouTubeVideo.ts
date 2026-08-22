import { useQuery } from '@tanstack/react-query'
import type { QueryStatus } from '../types'
import { createVideoQueryOptions } from '../queries'

export function useYouTubeVideo(rawId: string) {
  const videoId = rawId.trim()
  const status: QueryStatus = videoId ? 'active' : 'idle'

  const {
    data: videos = [],
    isPending,
    isError,
    error
  } = useQuery(createVideoQueryOptions(videoId, status))

  return {
    videos,
    isVideoPending: isPending,
    isVideoError: isError,
    videoError: error
  }
}
