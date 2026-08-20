export async function youtubeFetch<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const apiUrl = process.env.YOUTUBE_DATA_API_URL
  const apiKey = process.env.YOUTUBE_DATA_API_KEY

  if (!apiUrl) throw new Error('Missing env var: YOUTUBE_DATA_API_URL')
  if (!apiKey) throw new Error('Missing env var: YOUTUBE_DATA_API_KEY')

  const query = new URLSearchParams({ ...params, key: apiKey })

  const response = await fetch(`${apiUrl}${endpoint}?${query.toString()}`)

  if (!response.ok) throw new Error(`YouTube API Error: ${response.status} ${response.statusText}`)
  return (await response.json()) as T
}
