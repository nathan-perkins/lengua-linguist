import { useState } from 'react'
import { fetchVideos } from './utils/fetchVideos'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import './css/App.css'

import { validateLink } from './utils/validateLink'

declare global {
  interface Window {
    logger: () => { isValid: boolean, isEmbed: boolean}
  }
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string }
    snippet: { title: string }
  }>
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [videoOptions, setVideoOptions] = useState<YouTubeSearchResponse['items']>([])

  const handleQuery = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setActiveVideo(null)

    const { isValid, isEmbed } = validateLink(searchQuery)

    if (isValid) {
      let videoId: string | null = null

      if (isEmbed) {
        const match = searchQuery.match(/embed\/([\w-]+)/)
        videoId = match ? match[1] : null
      } else {
        const match = searchQuery.match(/(?:v=|\/v\/|youtu\.be\/|\/watch\?v=|\/live\/|\/shorts\/|\/embed\/)?([\w-]{11})/)
        videoId = match ? match[1] : null
      }

      if (videoId) {
        setActiveVideo(videoId)
        setVideoOptions([])
        setSearchQuery('')
        return
      }
    }

    const response = await fetchVideos(searchQuery)
    if (response) {
      const data = await response.json() as YouTubeSearchResponse
      setVideoOptions(data.items || [])
    }

    setSearchQuery('')
  }

  const logger = () => validateLink('https://www.youtube.com/embed/YasnpE7ONNA?si=g1O_JqR-qPPav-RA')

  window.logger = logger

  return (
    <div className="container">
      <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {activeVideo
        ? (
          <VideoWindow activeVideo={activeVideo} />
        ) : (
          <div>
            {videoOptions.map((option, idx) => (
              <button
                type="button"
                key={option.id.videoId || idx}
                onClick={() => setActiveVideo(option.id.videoId)}
                className="video-option-btn"
              >
                {option.snippet.title}
              </button>
            ))}
          </div>
        )}
    </div>
  )
}

export default App