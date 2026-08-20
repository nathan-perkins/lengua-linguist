import { createClient } from '../../client/client'

const baseUrl = process.env.YOUTUBE_DATA_BASE_URL

if (!baseUrl) {
  throw new Error('Missing env variable: base url')
}

export const youtubeApiClient = createClient({
  baseUrl,
  throwOnError: true,
  responseStyle: 'fields'
})
