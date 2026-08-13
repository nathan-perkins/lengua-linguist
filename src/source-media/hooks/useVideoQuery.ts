import { useQuery } from '@tanstack/react-query'
import type { VideoQueryMode } from '../types'
import { createVideoQueryOptions } from '../queries'
import { validateLink } from '../utils/validateLink'

export function useVideoQuery(rawQuery: string) {
  const input = rawQuery.trim()

  let mode: VideoQueryMode = 'idle'
  let query = ''

  if (input) {
    const { isValid, isEmbed } = validateLink(query)

    const videoId = isValid
      ? isEmbed
        ? (input.match(/embed\/([\w-]+)/)?.[1] ?? null)
        : (input.match(
            /(?:v=|\/v\/|youtu\.be\/|\/watch\?v=|\/live\/|\/shorts\/|\/embed\/)?([\w-]{11})/
          )?.[1] ?? null)
      : null

    if (videoId) {
      mode = 'id'
      query = videoId
    } else {
      mode = 'query'
      query = input
    }
  }

  const {
    data: videos = [],
    isPending,
    isError,
    error
  } = useQuery(createVideoQueryOptions(query, mode))

  return {
    videos,
    isPending,
    isError,
    error
  }
}
