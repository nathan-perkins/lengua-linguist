import { fetchVideos } from './fetchVideos'

describe('fetchVideos', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the internal search endpoint when searchQuery is provided', async () => {
    const response = await fetchVideos({ searchQuery: 'learn spanish' })
    
    expect(response).toBeDefined()
    expect(response?.ok).toBe(true)

    const data = await response?.json()
    expect(Array.isArray(data.items)).toBe(true)


  })

  it('calls the internal video endpoint when videoId is provided', async () => {
    const response = await fetchVideos({ videoId: 'abc123' })

    expect(response).toBeDefined()
    expect(response?.ok).toBe(true)

    const data = await response?.json()
    expect(Array.isArray(data.items)).toBe(true)
  })

  it('returns undefined and logs an error when neither searchQuery nor videoId is provided', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await fetchVideos({})

    expect(result).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
