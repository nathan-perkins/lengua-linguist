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
