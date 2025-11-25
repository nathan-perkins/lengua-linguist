import { useState } from 'react'
import { fetchVideos } from './utils/fetchVideos'
import { validateLink } from './utils/validateLink'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import BreakpointPane from './components/BreakpointPane'
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
  const [breakpointPaneVisible, setBreakpointPaneVisible] = useState<boolean>(false)
  const [startInput, setStartInput] = useState<string | undefined>(undefined)
  const [endInput, setEndInput] = useState<string | undefined>(undefined)
  const [startPoint, setStartPoint] = useState<string | null>(null)
  const [endPoint, setEndPoint] = useState<string | null>(null)

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
    setBreakpointPaneVisible(false)
  }

  const handleOpenBreakpointPane = () => {
    setBreakpointPaneVisible(true)
  }

  const handleCloseBreakpointPane = () => {
    setBreakpointPaneVisible(false)
    setStartInput(undefined)
    setEndInput(undefined)
  }

  const handleSetBreakpoints = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (startInput) {
      setStartPoint(startInput)
    }
    if (endInput) {
      setEndPoint(endInput)
    }

    setBreakpointPaneVisible(false)
    console.log(activeVideo)
  }

  const handleResetBreakpoints = () => {
    setStartPoint(null)
    setEndPoint(null)
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
            <VideoWindow activeVideo={activeVideo} startPoint={startPoint} endPoint={endPoint} />
            <div className="btn-row">
              <button type="button" onClick={handleDeselect} className="deselect-btn">deselect</button>
              <button type="button" onClick={handleOpenBreakpointPane} className="breakpoint-btn">add breakpoints</button>
              {startPoint !== null || endPoint !== null ? (
                <button type="button" onClick={handleResetBreakpoints} className="reset-breakpoints-btn">reset</button>
              ) : (
                null
              )}
            </div>
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
        {breakpointPaneVisible ? (
          <BreakpointPane handleCloseBreakpointPane={handleCloseBreakpointPane} startInput={startInput} setStartInput={setStartInput} endInput={endInput} setEndInput={setEndInput} handleSetBreakpoints={handleSetBreakpoints} />
        ) : (
          null
        )}
    </div>
  )
}

export default App