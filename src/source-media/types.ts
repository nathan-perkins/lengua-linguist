export type YouTubeSearchResponse = {
  items: Array<{
    id: { videoId: string }
    snippet: {
      title: string
      thumbnails: {
        medium: {
          url: string
          width: number
          height: number
        }
      }
      channelTitle: string
      description: string
    }
  }>
}

export type VideoOption = {
  id: { videoId: string }
  snippet: {
    title: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    description: string
  }
}
