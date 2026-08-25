export function parseLink(searchQuery: string): {
  isValid: boolean
  link: {
    videoId: string
  }
} {
  const youtubeRegex =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

  const match = searchQuery.match(youtubeRegex)
  const videoId = match ? match[1] : ''

  return {
    isValid: Boolean(match),
    link: {
      videoId
    }
  }
}
