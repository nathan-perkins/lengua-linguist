import { createEndpoint } from '../../shared/api/serverHandler'
import { SearchParamsSchema, YouTubeSearchListResponseSchema } from '../../source-media/schemas'
import { youtubeFetch } from './_lib/youtubeClient'

const handler = createEndpoint(SearchParamsSchema, async (_, query) => {
  const rawData = await youtubeFetch<any>('/search', {
    q: query.q,
    part: 'snippet',
    type: 'video'
  })

  const payload = YouTubeSearchListResponseSchema.parse(rawData)

  return Response.json(payload)
})

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request)
  }
}
