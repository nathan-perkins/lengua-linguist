import { YouTubeVideoListResponseSchema, type YouTubeVideo } from '../schemas'

export const youtubeService = {
  search: async (query: string): Promise<YouTubeVideo[]> => {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = YouTubeVideoListResponseSchema.parse(await response.json())
    return data.items
  },

  videos: async (videoIds: string): Promise<YouTubeVideo[]> => {
    const response = await fetch(`/api/youtube/videos?id=${encodeURIComponent(videoIds)}`)
    if (!response.ok) throw new Error('Failed to fetch video')

    const data = YouTubeVideoListResponseSchema.parse(await response.json())
    return data.items
  }
}
