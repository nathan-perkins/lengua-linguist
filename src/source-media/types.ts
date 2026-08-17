export type SearchResponse = {
  kind: 'youtube#searchResult'
  id: { kind: string; videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
  }
}

export type VideoResponse = {
  kind: 'youtube#video'
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    defaultLanguage: string
  }
}

export type QueryStatus = 'idle' | 'active'
