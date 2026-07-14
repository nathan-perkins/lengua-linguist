import {
 useState, useEffect, useRef, type Dispatch, type SetStateAction 
} from 'react'
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'
import VideoTimeline from './VideoTimeline'
import LoopControlFrame from './LoopControlFrame'
import OptionsPopup from './OptionsPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
 faArrowLeft, faArrowRight, faPlay, faPause, faRepeat, faGear 
} from '@fortawesome/free-solid-svg-icons'

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  getIframe: () => HTMLIFrameElement
}

interface Segment {
  index: number
  start: number
  end: number
  initialEnd: number
  name?: string
}

interface VideoWindowProps {
  activeVideo: string | null
  showButtonTitles: boolean
  setShowButtonTitles: Dispatch<SetStateAction<boolean>>
}

function VideoWindow({ activeVideo, showButtonTitles, setShowButtonTitles }: VideoWindowProps) {
  const [isActiveLoop, setIsActiveLoop] = useState<boolean>(false)
  const [pendingSegmentStart, setPendingSegmentStart] = useState<number | null>(null)
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [showOptions, setShowOptions] = useState<boolean>(false)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const optionsRef = useRef<HTMLButtonElement>(null)
  const intervalRef = useRef<number | undefined>(undefined)

  const activeSegment = segments[activeSegmentIndex ?? 0]

  const handleReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer
    playerRef.current = player

    const videoDuration = player.getDuration()
    setDuration(videoDuration)
  }

  useEffect(() => {
    const player = playerRef.current
    let timeInterval: number | undefined

    if (player && isPlaying) {
      timeInterval = setInterval(() => {
        const time = player?.getCurrentTime() ?? 0
        setCurrentTime(time)
      }, 100)
    }

    return () => {
      if (timeInterval) clearInterval(timeInterval)
    }
  }, [isPlaying])

  useEffect(() => {
    setCurrentTime(0)
    setActiveSegmentIndex(0)
  }, [activeVideo])

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const handlePauseClick = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (!playerRef.current) return

      if (event.key === 'ArrowRight' && !activeSegment) {
        const currentTime = playerRef.current.getCurrentTime()
        const duration = playerRef.current.getDuration()
        playerRef.current.seekTo(Math.min(currentTime + 10, duration), true)
      }

      if (event.key === 'ArrowLeft' && !activeSegment) {
        const currentTime = playerRef.current.getCurrentTime()
        playerRef.current.seekTo(Math.max(0, currentTime - 10), true)
      }

      if (event.key === ' ') {
        event.preventDefault()
        const playerState = playerRef.current.getPlayerState()
        
        if (playerState === 1) {
          handlePauseClick()
        } else {
          handlePlay()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVideo, activeSegment])

  if (!activeVideo) return null

  const handlePause: YouTubeProps['onPause'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (!player || duration === 0) return

    if (pendingSegmentStart !== null) {
      const pendingSegmentEnd = player.getCurrentTime()

      if (pendingSegmentEnd <= pendingSegmentStart) return

      const newSegment = {
        index: segments.length,
        start: pendingSegmentStart,
        end: pendingSegmentEnd,
        initialEnd: pendingSegmentEnd,
        name: `Loop ${segments.length + 1}`
      }
      const updatedSegments = [...segments, newSegment].sort((a, b) => a.start - b.start)
      updatedSegments.forEach((segment, idx) => segment.index = idx)
      setSegments(updatedSegments)
      // this will need to change to be based on an id that's based on start and end times
      setActiveSegmentIndex(updatedSegments.length - 1)
      player.seekTo(newSegment.start, true)

      setPendingSegmentStart(null)
    } else if (activeSegment && event.data === 2) {
      player.seekTo(activeSegment.start, true)
    }

    setIsPlaying(false)
  }

  const handleStateChange: YouTubeProps['onStateChange'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (event.data === 1) {
      setIsPlaying(true)
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false)
    }

    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }

    if (
      player &&
      activeSegment &&
      pendingSegmentStart === null &&
      event.data === 1
    ) {
      intervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime()
        if (currentTime >= activeSegment.end) {
          player.pauseVideo()
          if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current)
            intervalRef.current = undefined
          }
          // simulate click to focus the cross-origin iframe
          const iframe = playerRef.current?.getIframe()
          if (iframe) {
            const rect = iframe.getBoundingClientRect()
            const clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2
            })
            iframe.dispatchEvent(clickEvent)
          }
        }
      }, 100)
    }
  }

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true)
      setCurrentTime(time)
    }
  }

  const handleNextLoop = () => {
    if (!playerRef.current || duration === null || activeSegmentIndex === null) return

    if (activeSegmentIndex < segments.length - 1) {
      const nextIndex = activeSegmentIndex + 1
      setActiveSegmentIndex(nextIndex)
      if (playerRef.current) {
        playerRef.current.seekTo(segments[nextIndex].start, true)
      }
    } else {
      const lastSegmentEndTime = segments.length > 0 ? segments[segments.length - 1].end : 0
      if (lastSegmentEndTime < duration) {
        playerRef.current.seekTo(lastSegmentEndTime, true)
        setPendingSegmentStart(lastSegmentEndTime)
      }
    }
  }

  const handlePreviousLoop = () => {
    if (!duration || activeSegmentIndex === null) return

    if (activeSegmentIndex > 0) {
      const prevIndex = activeSegmentIndex - 1
      setActiveSegmentIndex(prevIndex)
      if (playerRef.current) {
        playerRef.current.seekTo(segments[prevIndex].start, true)
      }
    }
  }

  const handleStartLoop = () => {
    if (!playerRef.current || duration === null) return

    setPendingSegmentStart(playerRef.current.getCurrentTime())
    setActiveSegmentIndex(0)
    setIsActiveLoop(true)
  }

  const handleClearLoops = () => {
    setSegments([])
    setPendingSegmentStart(null)
    setActiveSegmentIndex(null)
    setIsActiveLoop(false)

    if (!playerRef.current) return

    const playerState = playerRef.current.getPlayerState()
    if (playerState === 2) {
      playerRef.current.seekTo(currentTime, true)
    }
  }

  const handleSegmentUpdate = (index: number, newEnd: number, newName?: string) => {
    setSegments(prevSegments => 
      prevSegments.map(segment =>
        segment.index === index
          ? {
            ...segment,
            end: Math.max(newEnd, segment.start),
            name: newName !== undefined ? newName : segment.name
          }
          : segment
      )
    )
  }

  return (
    <>
      <div className="video-window">
        <YouTube
          videoId={activeVideo}
          opts={{
            playerVars: {
              rel: 0
            }
          }}
          onReady={handleReady}
          onPause={handlePause}
          onStateChange={handleStateChange}
        />
      </div>
      {isActiveLoop && segments.length > 0 ? (
        <LoopControlFrame currentTime={currentTime} duration={duration ?? 0} segments={segments} activeSegmentIndex={activeSegmentIndex} pendingSegmentStart={pendingSegmentStart} onSeek={handleSeek} onSegmentUpdate={handleSegmentUpdate} activeVideo={activeVideo} loopController={true} />
      ) : (
        <div className="video-timeline">
          <VideoTimeline currentTime={currentTime} duration={duration ?? 0} segments={segments} activeSegmentIndex={activeSegmentIndex} pendingSegmentStart={pendingSegmentStart} onSeek={handleSeek} onSegmentUpdate={handleSegmentUpdate} />
        </div>
      )}
      <div className="video-control-btns">
        <button type="button" onClick={isActiveLoop ? handleClearLoops : handleStartLoop} className={`loop-control-icon${isActiveLoop ? ' active-control-icon' : ''}`} title={showButtonTitles ? isActiveLoop ? 'Exit loop sequence' : 'Enter loop sequence' : undefined} >
          <FontAwesomeIcon icon={faRepeat} />
        </button>
        {isActiveLoop && activeSegment && activeSegmentIndex !== null && (
          <button type="button" onClick={activeSegmentIndex > 0 ? handlePreviousLoop : undefined} className={`loop-control-arrow${activeSegmentIndex > 0 ? '' : ' dummy-arrow'}`} title={showButtonTitles && activeSegmentIndex > 0 ? 'Previous loop' : ''}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {isPlaying ? (
          <button type="button" onClick={handlePauseClick} className="video-control-pause" title={showButtonTitles ? 'Pause video' : undefined}>
            <FontAwesomeIcon icon={faPause} />
          </button>
        ) : (
          <button type="button" onClick={handlePlay} className="video-control-play" title={showButtonTitles ? 'Play video' : undefined}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
        )}
        {isActiveLoop && activeSegment && (
          <button type="button" onClick={activeSegment.end !== duration ? handleNextLoop : undefined} className={`loop-control-arrow${activeSegment.end !== duration ? '' : ' dummy-arrow'}`} title={showButtonTitles && activeSegment.end !== duration ? 'Next loop' : ''}>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
        <div className="options-btn-container">
          <button type="button" ref={optionsRef} onClick={() => setShowOptions(prev => !prev)} className={`options-icon${showOptions ? ' active-control-icon' : ''}`} title={showButtonTitles ? 'Options' : undefined}>
            <FontAwesomeIcon icon={faGear} />
          </button>
          {showOptions && (
            <OptionsPopup showButtonTitles={showButtonTitles} setShowButtonTitles={setShowButtonTitles} setShowOptions={setShowOptions} optionsRef={optionsRef} />
          )}
        </div>
      </div>
    </>
  )
}

export default VideoWindow 
