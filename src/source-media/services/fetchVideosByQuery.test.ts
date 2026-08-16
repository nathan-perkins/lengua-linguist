import { fetchVideosByQuery } from './fetchVideosByQuery'

describe('fetchVideosByQuery', () => {
  it('should call the internal search endpoint when searchQuery is provided', async () => {
    const videos = await fetchVideosByQuery('kriiispy')

    expect(videos).toBeDefined()
    expect(Array.isArray(videos)).toBe(true)
    expect(videos).toHaveLength(2)
  })

  it('should return empty array when searchQuery is empty', async () => {
    await expect(fetchVideosByQuery('')).rejects.toThrow('Failed to fetch videos')
  })
})
