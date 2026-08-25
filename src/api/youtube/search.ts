import { createEndpoint } from '../../shared/api/serverHandler'
import {
  SearchParamsSchema,
  YouTubeSearchListResponseSchema,
  YouTubeVideoListResponseSchema
} from '../../source-media/schemas'
import { youtubeFetch } from './_lib/_youtubeClient'

const handler = createEndpoint(SearchParamsSchema, async (_, params) => {
  const rawSearchData = await youtubeFetch<any>('/search', {
    q: params.q,
    part: 'snippet',
    type: 'video',
    maxResults: '10'
  })

  const searchData = YouTubeSearchListResponseSchema.parse(rawSearchData)
  const searchResults = searchData.items
  const videoIds = searchResults.map((result) => result.id.videoId).toString()

  const rawVideoData = await youtubeFetch<any>('/videos', {
    id: videoIds,
    part: 'snippet'
  })

  const payload = YouTubeVideoListResponseSchema.parse(rawVideoData)

  return Response.json(payload)
})

export default {
  async fetch(request: Request): Promise<Response> {
    return handler(request)
  }
}
