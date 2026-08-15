import { http, HttpResponse } from 'msw'
import type { VideoOption } from '../source-media/types'

const mockVideos = [
  {
    kind: 'youtube#video',
    id: 'pG0zn5Hvse8',
    title: 'Nu Disciples',
    description: 'First video for kriiispy search',
    channelTitle: 'KRIIISPY !'
  },
  {
    kind: 'youtube#video',
    id: 'JmgBtUM5opI',
    title: 'GODS TIMING',
    description: 'Second video for kriiispy search',
    channelTitle: 'KRIIISPY !'
  }
]

function toVideoOption(video: (typeof mockVideos)[number], kind: string) {
  return {
    kind,
    id: { kind: video.kind, videoId: video.id },
    snippet: {
      title: video.title,
      description: video.description,
      channelTitle: video.channelTitle,
      thumbnails: {
        medium: {
          url: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
          width: 320,
          height: 180
        }
      }
    }
  } satisfies VideoOption
}

export const handlers = [
  http.get('/api/youtube/search', ({ request }) => {
    const url = new URL(request.url)
    const searchQuery = url.searchParams.get('q')?.trim()

    if (!searchQuery) {
      return HttpResponse.json({ error: 'Missing query param q' }, { status: 400 })
    }

    const items =
      searchQuery.toLowerCase() === 'kriiispy'
        ? mockVideos.map((video) => toVideoOption(video, 'youtube#searchResult'))
        : []

    return HttpResponse.json({
      kind: 'youtube#searchListResponse',
      etag: 'mock-etag',
      pageInfo: { totalResults: items.length, resultsPerPage: items.length },
      items
    })
  }),

  http.get('/api/youtube/videos', ({ request }) => {
    const url = new URL(request.url)
    const idQuery = url.searchParams.get('id')

    const items = mockVideos
      .filter((video) => video.id === idQuery)
      .map((video) => toVideoOption(video, 'youtube#video'))

    return HttpResponse.json({
      kind: 'youtube#videoListResponse',
      etag: 'mock-etag',
      pageInfo: { totalResults: items.length, resultsPerPage: items.length },
      items
    })
  })
]
