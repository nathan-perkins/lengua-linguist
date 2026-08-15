export type VideoOption = {
  kind: string
  id: { kind: string; videoId: string }
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

export type VideoQueryMode = 'idle' | 'id' | 'query'
