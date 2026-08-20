import { youtubeClient } from '../youtubeClient'

export default {
  async fetch(request: Request) {
    try {
      const query = new URL(request.url).searchParams.get('q')?.trim()

      if (!query) {
        return Response.json({ error: 'Missing query param: q' }, { status: 400 })
      }

      const data = await youtubeClient.search(query)

      return Response.json(data)
    } catch (error) {
      console.error('search function failed', error)
      return Response.json({ error: 'YouTube request failed' }, { status: 502 })
    }
  }
}
