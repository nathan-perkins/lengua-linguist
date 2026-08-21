import {
  YouTubeSearchListResponseSchema,
  YouTubeVideoListResponseSchema,
  type YouTubeSearchResult,
  type YouTubeVideo
} from '../schemas'

export const youtubeService = {
  search: async (query: string): Promise<YouTubeSearchResult[]> => {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = YouTubeSearchListResponseSchema.parse(await response.json())
    return data.items
  },

  videos: async (videoId: string): Promise<YouTubeVideo[]> => {
    const response = await fetch(`/api/youtube/videos?id=${encodeURIComponent(videoId)}`)
    if (!response.ok) throw new Error('Failed to fetch video')

    const data = YouTubeVideoListResponseSchema.parse(await response.json())
    return data.items
  }
}
