export async function fetchVideos(searchQuery: string) {
  const apiKey: string = import.meta.env.VITE_YOUTUBE_DATA_API_KEY as string
  const apiUrl: string = import.meta.env.VITE_YOUTUBE_DATA_API_URL as string

  try {
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`
    const response = await fetch(url)
    return response
  } catch (error) {
    console.error(error)
  }
}
