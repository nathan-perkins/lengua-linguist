interface FetchVideosParams {
  searchQuery?: string
  videoId?: string
}

export async function fetchVideos({ searchQuery, videoId }: FetchVideosParams) {
  const apiKey: string = import.meta.env.VITE_YOUTUBE_DATA_API_KEY as string
  const apiUrl: string = import.meta.env.VITE_YOUTUBE_DATA_API_URL as string

  try {
    if (videoId) {
      const url = `${apiUrl}/videos?key=${apiKey}&id=${videoId}&part=snippet`
      const response = await fetch(url)
      return response
    } else if (searchQuery) {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`)
      return response
    } else {
      throw new Error('Either searchQuery or videoId must be provided')
    }
  } catch (error) {
    console.error(error)
  }
}
