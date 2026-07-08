export default {
  async fetch(request: Request) {
    try {
      const apiUrl = process.env.YOUTUBE_DATA_API_URL
      const apiKey = process.env.YOUTUBE_DATA_API_KEY

      if (!apiUrl) {
        console.error('Missing env var: YOUTUBE_DATA_API_URL')
        return Response.json({ error: 'Server config error' }, { status: 500 })
      }

      if (!apiKey) {
        console.error('Missing env var: YOUTUBE_DATA_API_KEY')
        return Response.json({ error: 'Server config error' }, { status: 500 })
      }

      const { searchParams } = new URL(request.url)
      const searchQuery = searchParams.get('q')?.trim()

      if (!searchQuery) {
        return Response.json({ error: 'Missing query param q' }, { status: 400 })
      }

      const upstream = new URL('search', apiUrl)
      upstream.searchParams.set('key', apiKey)
      upstream.searchParams.set('type', 'video')
      upstream.searchParams.set('part', 'snippet')
      upstream.searchParams.set('q', searchQuery)
      upstream.searchParams.set('maxResults', '10')


      console.log(upstream)
      const response = await fetch(upstream)
      const data = await response.json()

      return Response.json(data, { status: response.status })
    } catch (error) {
      console.error('search function failed', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}
