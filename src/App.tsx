import { useState } from 'react'
import { fetchVideos } from './utils/fetchVideos'
import { validateLink } from './utils/validateLink'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import './css/App.css'

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

  const handleSelect = (videoId: string) => {
    setActiveVideo(videoId)
    setVideoOptions([])
  }

  const handleDeselect = () => {
    setActiveVideo(null)
  }

  return (
    <div className="container">
      {activeVideo ? (
        null
      ) : (
        <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
      {activeVideo
        ? (
          <div className="active-window">
            <VideoWindow activeVideo={activeVideo} />
            <button type="button" onClick={handleDeselect} className="deselect-btn">deselect</button>
          </div>
        ) : (
          <div>
            {videoOptions.map((option, idx) => (
              <button
                type="button"
                key={option.id.videoId || idx}
                onClick={() => handleSelect(option.id.videoId)}
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