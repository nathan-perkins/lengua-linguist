import { fetchVideos } from './fetchVideos'

// uses direct fetch spy, move to contralized mocking with MSW

function getRequestUrl(input: string | URL | Request): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return input.url
}

describe('fetchVideos', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the search endpoint when searchQuery is provided', async () => {
    Object.assign(import.meta.env, {
      VITE_YOUTUBE_DATA_API_KEY: 'test-key',
      VITE_YOUTUBE_DATA_API_URL: 'https://youtube.test'
    })

    const response = new Response(JSON.stringify({ items: [] }), { status: 200 })
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response)

    const result = await fetchVideos({ searchQuery: 'learn Spanish' })

    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const firstArg = fetchSpy.mock.calls[0]?.[0]
    expect(firstArg).toBeDefined()

    const requestedUrl = getRequestUrl(firstArg)
    expect(requestedUrl).toContain('/search')
    expect(requestedUrl).toContain('q=learn Spanish')
    expect(result).toBe(response)
  })

  it('calls the video endpoint when videoId is provided', async () => {
    Object.assign(import.meta.env, {
      VITE_YOUTUBE_DATA_API_KEY: 'test-key',
      VITE_YOUTUBE_DATA_API_URL: 'https://youtube.test'
    })

    const response = new Response(JSON.stringify({ items: [] }), { status: 200 })
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response)

    const result = await fetchVideos({ videoId: 'abc123' })

    expect(fetchSpy).toHaveBeenCalledTimes(1)

    const firstArg = fetchSpy.mock.calls[0]?.[0]
    expect(firstArg).toBeDefined()

    const requestedUrl = getRequestUrl(firstArg)
    expect(requestedUrl).toContain('/videos')
    expect(requestedUrl).toContain('id=abc123')
    expect(result).toBe(response)
  })

  it('returns undefined and logs an error when neither searchQuery nor videoId is provided', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchVideos({})

    expect(result).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
