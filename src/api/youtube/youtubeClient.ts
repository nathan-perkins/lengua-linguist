import { youtubeSearchList } from '../../client/sdk.gen'
import type { SearchListResponse } from '../../client/types.gen'
import { youtubeApiClient } from './client'

export const youtubeClient = {
  async search(query: string): Promise<SearchListResponse> {
    const result = await youtubeSearchList({
      client: youtubeApiClient,
      security: [],
      responseStyle: 'fields',
      throwOnError: true,
      query: {
        key: process.env.YOUTUBE_DATA_API_KEY,
        part: ['snippet'],
        type: ['video'],
        q: query,
        maxResults: 10
      }
    })

    return result.data
  }
}
