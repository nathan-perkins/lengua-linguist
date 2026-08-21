import { youtubeService } from './youtubeService'

describe('fetchVideosByQuery', () => {
  it('should call the internal search endpoint when searchQuery is provided', async () => {
    const videos = await youtubeService.search('kriiispy')

    expect(videos).toBeDefined()
    expect(Array.isArray(videos)).toBe(true)
    expect(videos).toHaveLength(2)
  })

  it('should return empty array when searchQuery is empty', async () => {
    await expect(youtubeService.search('')).rejects.toThrow('Failed to fetch videos')
  })
})

describe('fetchVideosByQuery', () => {
  it('should call the internal videos endpoint when videoId is provided', async () => {
    const videoResponse = await youtubeService.videos('pG0zn5Hvse8')

    expect(videoResponse).toBeDefined()
    expect(Array.isArray(videoResponse)).toBe(true)
    expect(videoResponse).toHaveLength(1)
  })

  it('should return an error when no videoId is provided', async () => {
    await expect(youtubeService.videos('')).rejects.toThrow('Failed to fetch video')
  })

  it('should return an empty array when videoId is not found', async () => {
    await expect(youtubeService.videos('unkown-id')).resolves.toEqual([])
  })
})
