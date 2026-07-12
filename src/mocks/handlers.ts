import { http, HttpResponse } from 'msw'

interface YouTubeSearchItem {
  id: { videoId: string } | string
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

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[]
}

const resultItem = (videoId: string, title: string): YouTubeSearchItem => ({
  id: { videoId },
  snippet: {
    title,
    thumbnails: {
      medium: {
        url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        width: 320,
        height: 180
      }
    },
    channelTitle: 'KRIIISPY !',
    description: 'Mock description'
  }
})

const searchSuccess: YouTubeSearchResponse = {
  items: [resultItem('pG0zn5Hvse8', 'Nu Disciples'), resultItem('JmgBtUM5opI', 'GODS TIMING')]
}

const videoSuccess = (videoId: string): YouTubeSearchResponse => ({
  items: [resultItem(videoId, 'Mock Video ' + videoId)]
})

export const handlers = [
  http.get('/api/youtube/search', ({ request }) => {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('q')?.trim()

    if (!searchQuery) {
      return HttpResponse.json(
        { error: 'Missing query param q' },
        { status: 400 }
      )
    }

    if (searchQuery.toLowerCase() === 'no-results') {
      return HttpResponse.json({ items: [] } satisfies YouTubeSearchResponse)
    }

    return HttpResponse.json(searchSuccess)
  }),
  http.get('/api/youtube/videos', ({ request }) => {
    const url = new URL(request.url)
    const videoId = url.searchParams.get('id')?.trim()

    if (!videoId) {
      return HttpResponse.json(
        { error: 'Missing query param id' },
        { status: 400 }
      )
    }

    return HttpResponse.json(videoSuccess(videoId))
  })
]
