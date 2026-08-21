import { http, HttpResponse } from 'msw'
import type { YouTubeSearchResult, YouTubeVideo } from '../source-media/schemas'
const mockVideos = [
  {
    kind: 'youtube#video',
    id: 'pG0zn5Hvse8',
    title: 'Nu Disciples',
    description: 'First video for kriiispy search',
    channelTitle: 'KRIIISPY !',
    defaultLanguage: 'en'
  },
  {
    kind: 'youtube#video',
    id: 'JmgBtUM5opI',
    title: 'GODS TIMING',
    description: 'Second video for kriiispy search',
    channelTitle: 'KRIIISPY !',
    defaultLanguage: 'en'
  }
]

function toSearchResult(video: (typeof mockVideos)[number]) {
  return {
    kind: 'youtube#searchResult',
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
  } satisfies YouTubeSearchResult | YouTubeVideo
}

function toVideo(video: (typeof mockVideos)[number]) {
  return {
    kind: 'youtube#video',
    id: video.id,
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
      },
      defaultLanguage: video.defaultLanguage
    }
  } satisfies YouTubeVideo
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
        ? mockVideos.map((video) => toSearchResult(video))
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

    if (!idQuery) {
      return HttpResponse.json({ error: 'Missing query param id' }, { status: 400 })
    }

    const items = mockVideos.filter((video) => video.id === idQuery).map((video) => toVideo(video))

    return HttpResponse.json({
      kind: 'youtube#videoListResponse',
      etag: 'mock-etag',
      pageInfo: { totalResults: items.length, resultsPerPage: items.length },
      items
    })
  })
]
