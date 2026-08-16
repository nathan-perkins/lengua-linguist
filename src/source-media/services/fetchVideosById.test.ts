import { fetchVideosById } from './fetchVideosById'

describe('fetchVideosByQuery', () => {
  it('should call the internal videos endpoint when videoId is provided', async () => {
    const videoResponse = await fetchVideosById('pG0zn5Hvse8')

    expect(videoResponse).toBeDefined()
    expect(Array.isArray(videoResponse)).toBe(true)
    expect(videoResponse).toHaveLength(1)
  })

  it('should return an error when no videoId is provided', async () => {
    await expect(fetchVideosById('')).rejects.toThrow('Failed to fetch videos')
  })

  it('should return an empty array when videoId is not found', async () => {
    await expect(fetchVideosById('unkown-id')).resolves.toEqual([])
  })
})
