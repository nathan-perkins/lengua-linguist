import type { VideoOption } from '../types'

export async function fetchVideosByQuery(searchQuery: string): Promise<VideoOption[]> {
  try {
    const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)

    if (!response.ok) throw new Error('Failed to fetch videos')

    const data = (await response.json()) as { items: VideoOption[] }
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
