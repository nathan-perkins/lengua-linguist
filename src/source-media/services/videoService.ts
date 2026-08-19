import type { SearchResponse, VideoResponse } from '../types'

export async function fetchVideosByQuery(searchQuery: string): Promise<SearchResponse[]> {
  try {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)

    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = (await response.json()) as { items: SearchResponse[] }
    return data.items
  } catch (error) {
    console.error(error)
    throw error
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
