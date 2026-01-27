interface FetchVideosParams {
  searchQuery?: string
  videoId?: string
}

export async function fetchVideos({ searchQuery, videoId }: FetchVideosParams) {
  const apiKey: string = import.meta.env.VITE_YOUTUBE_DATA_API_KEY as string
  const apiUrl: string = import.meta.env.VITE_YOUTUBE_DATA_API_URL as string

  try {
    let url: string
    if (videoId) {
      url = `${apiUrl}/videos?key=${apiKey}&id=${videoId}&part=snippet`
    } else if (searchQuery) {
      url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}&maxResults=10`
    } else {
      throw new Error('Either searchQuery or videoId must be provided')
    }
    const response = await fetch(url)
    return response
  } catch (error) {
    console.error(error)
  }
}
