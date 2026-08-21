import { createEndpoint } from '../../shared/api/serverHandler'
import { VideoParamsSchema, YouTubeVideoListResponseSchema } from '../../source-media/schemas'
import { youtubeFetch } from './_lib/youtubeClient'

const handler = createEndpoint(VideoParamsSchema, async (_, id) => {
  const rawData = await youtubeFetch<any>('/videos', {
    id: id.id,
    part: 'snippet'
  })

  const payload = YouTubeVideoListResponseSchema.parse(rawData)

  return Response.json(payload)
})

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request)
  }
}

// export default {
//   async fetch(request: Request) {
//     try {
//       const apiUrl = process.env.YOUTUBE_DATA_API_URL
//       const apiKey = process.env.YOUTUBE_DATA_API_KEY

//       if (!apiUrl) {
//         console.error('Missing env var: YOUTUBE_DATA_API_URL')
//         return Response.json({ error: 'Server config error' }, { status: 500 })
//       }

//       if (!apiKey) {
//         console.error('Missing env var: YOUTUBE_DATA_API_KEY')
//         return Response.json({ error: 'Server config error' }, { status: 500 })
//       }

//       const { searchParams } = new URL(request.url)
//       const videoId = searchParams.get('id')?.trim()

//       if (!videoId) {
//         console.error('Missing query params: id')
//         return Response.json({ error: 'Missing query param id' }, { status: 400 })
//       }

//       const upstream = new URL('videos', apiUrl)
//       upstream.searchParams.set('key', apiKey)
//       upstream.searchParams.set('id', videoId)
//       upstream.searchParams.set('part', 'snippet')

//       const response = await fetch(upstream)
//       const data = await response.json()

//       return Response.json(data, {
//         status: response.status
//       })
//     } catch (error) {
//       console.error('video function failed', error)
//       return Response.json({ error: 'Internal server error' }, { status: 500 })
//     }
//   }
// }
