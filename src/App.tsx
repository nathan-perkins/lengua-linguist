import { useState } from 'react'
import { fetchVideos } from './utils/fetchVideos'
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

    const response = await fetchVideos(searchQuery)
    if (response) {
      const data = await response.json() as YouTubeSearchResponse
      setVideoOptions(data.items || [])

      // if (data.items && data.items.length > 0) {
      //   console.log(data.items)
      //   setActiveVideo(data.items[0].id.videoId)
      // }
    }
    setSearchQuery('')
  }

  return (
    <div className="container">
      <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {activeVideo
        ? (
          <VideoWindow activeVideo={activeVideo} />
        ) : (
          <div>
            {videoOptions.map(option => (
              <button
                type="button"
                key={option.id.videoId}
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