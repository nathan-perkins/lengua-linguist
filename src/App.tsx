import { useState } from 'react'
import { fetchVideos } from './services/fetchVideos'
import { validateLink } from './utils/validateLink'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import VideoResult from './components/VideoResult'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import './css/App.css'

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string }
    snippet: {
      title: string
      thumbnails: {
        medium: {
          url: string
          width: number
          height: number
        }
      }
      channelTitle: string
      description: string
    }
  }>
}

export interface VideoOption {
  id: { videoId: string }
  snippet: {
    title: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    description: string
  }
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [previousQuery, setPreviousQuery] = useState<string>('')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [videoOptions, setVideoOptions] = useState<YouTubeSearchResponse['items']>([])
  const [isLoadingVideoOptions, setIsLoadingVideoOptions] = useState<boolean>(false)
  const [isNoResults, setIsNoResults] = useState<boolean>(false)
  const [showButtonTitles, setShowButtonTitles] = useState<boolean>(false)

  const previousVideo = localStorage.getItem('PREVIOUS_VIDEO')
  let previousVideoData: VideoOption | null = null

  if (previousVideo) {
    previousVideoData = JSON.parse(previousVideo) as VideoOption
  }

  const handleQuery = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setActiveVideo(null)
    setPreviousQuery(searchQuery)
    setIsLoadingVideoOptions(true)
    setIsNoResults(false)

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

      if (data.items.length === 0) {
        setIsNoResults(true)
      }
    }

    setSearchQuery('')
    setIsLoadingVideoOptions(false)
  }

  const handleReturnToResults = async () => {
    setActiveVideo(null)
    setIsLoadingVideoOptions(true)

    if (previousQuery === '') {
      setVideoOptions([])
    }
    
    const response = await fetchVideos(previousQuery)
    if (response) {
      const data = await response.json() as YouTubeSearchResponse
      setVideoOptions(data.items || [])
    }

    setIsLoadingVideoOptions(false)
  }

  const handleSelect = (option: VideoOption) => {
    localStorage.setItem('PREVIOUS_VIDEO', JSON.stringify(option))
    setActiveVideo(option.id.videoId)
    setVideoOptions([])
    setIsNoResults(false)
  }

  const handleDeselect = () => {
    sessionStorage.clear()
    setActiveVideo(null)
    setPreviousQuery('')
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Lengua<span className="accent">Linguist</span></h1>
      </div>
      <div className="app-body">
        {!activeVideo && (
          <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        {activeVideo
          ? (
            <div className="active-window">
              <button type="button" onClick={handleReturnToResults} className="search-return-btn" title={showButtonTitles ? 'Return to previous search' : undefined}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <VideoWindow activeVideo={activeVideo} showButtonTitles={showButtonTitles} setShowButtonTitles={setShowButtonTitles} />
              <button type="button" onClick={handleDeselect} className="video-deselect-btn" title={showButtonTitles ? 'Deselect video' : undefined}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ) : (
            <div className="video-options-group">
              {videoOptions.map((option: VideoOption, idx: number) => (
                <VideoResult key={option.id.videoId || idx} option={option} onSelect={handleSelect} />
              ))}
            </div>
          )}
        {previousVideoData && !activeVideo && !videoOptions.length && !isLoadingVideoOptions && (
          <div className="previous-video-option">
            <p className="previous-video-text">{isNoResults ? 'No results found. Try another search or return to previous video:' : 'Previous video:'}</p>
            <VideoResult option={previousVideoData} onSelect={handleSelect} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App