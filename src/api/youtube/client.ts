import { createClient } from '../../client/client'

const baseUrl = process.env.VITE_GOOGLE_BASE_URL
const apiKey = process.env.YOUTUBE_DATA_API_KEY

if (!baseUrl) {
  throw new Error('Missing env variable: base url')
}

if (!apiKey) {
  throw new Error('Missing env variable: youtube api key')
}

export const youtubeApiClient = createClient({
  baseUrl,
  auth: apiKey,
  throwOnError: true,
  responseStyle: 'data'
})
