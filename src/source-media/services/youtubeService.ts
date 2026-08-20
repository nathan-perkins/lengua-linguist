import { YouTubeSearchListResponseSchema, type YouTubeSearchResult } from '../schemas'
import type { VideoResponse } from '../types'

export const youtubeService = {
  search: async (query: string): Promise<YouTubeSearchResult[]> => {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = YouTubeSearchListResponseSchema.parse(await response.json())
    return data.items
  }
}

export async function fetchVideosByIds(videoIdList: string[]): Promise<VideoResponse[]> {
  try {
    const videoIds = videoIdList.join()
    const response = await fetch(`/api/youtube/videos?id=${encodeURIComponent(videoIds)}`)

    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = (await response.json()) as { items: VideoResponse[] }
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
