interface FetchVideosParams {
  searchQuery?: string
  videoId?: string
}

export async function fetchVideos({ searchQuery, videoId }: FetchVideosParams) {
  try {
    if (videoId) {
      const response = await fetch(`/api/youtube/videos?id=${encodeURIComponent(videoId)}`)
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
