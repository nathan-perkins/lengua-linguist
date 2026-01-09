import { useState } from 'react'
import { fetchVideos } from './services/fetchVideos'
import { validateLink } from './utils/validateLink'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import VideoResult from './components/VideoResult'
import Recorder from './components/Recorder'
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
  const [activeLoop, setActiveLoop] = useState<boolean>(false)
  const [currentSegment, setCurrentSegment] = useState<{ start: number; end: number } | null>(null)

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
    sessionStorage.clear()
    setActiveVideo(null)
  }

  const handleStartLoop = () => {
    setActiveLoop(true)
  }

  const handleEndLoop = () => {
    setActiveLoop(false)
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Lengua<span className="accent">Linguist</span></h1>
      </div>
      <div className="app-body">
        {activeVideo ? (
          null
        ) : (
          <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {activeVideo
          ? (
            <div className="active-window">
              <VideoWindow activeVideo={activeVideo} activeLoop={activeLoop} onSegmentChange={setCurrentSegment} />
              <div className="btn-row">
                {activeLoop
                  ? (
                    <button type="button" onClick={handleEndLoop} className="loop-control-btn">End loop</button>
                  ) : (
                    <button type="button" onClick={handleStartLoop} className="loop-control-btn">Start loop</button>
                  )}
                <button type="button" onClick={handleDeselect} className="control-btn">Deselect</button>
              </div>
            </div>
          ) : (
            <div>
              {videoOptions.map((option, idx) => (
                <VideoResult key={option.id.videoId || idx} option={option} onSelect={handleSelect} />
              ))}
            </div>
          )}
          {activeLoop && activeVideo && currentSegment ? (
            <Recorder videoId={activeVideo} startSegment={currentSegment.start} endSegment={currentSegment.end} />
          ) : null}
      </div>
      <div className="app-footer"></div>
    </div>
  )
}

export default App