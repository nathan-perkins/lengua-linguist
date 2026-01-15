import { useState, useEffect, useRef } from 'react'
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

interface VideoWindowProps {
  activeVideo: string | null
  activeLoop: boolean
  onSegmentChange?: (segment: { start: number; end: number }) => void
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getIframe: () => HTMLIFrameElement
}

function VideoWindow({ activeVideo, activeLoop, onSegmentChange }: VideoWindowProps) {
  const [startSegment, setStartSegment] = useState<number | null>(null)
  const [endSegment, setEndSegment] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)

  const segmentLength = 4

  const handleReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer
    playerRef.current = player

    const videoDuration = player.getDuration()
    setDuration(videoDuration)
  }

  useEffect(() => {
    const player = playerRef.current

    if (player === null || duration === null) return

    if (activeLoop && duration < segmentLength * 2) {
      setStartSegment(0)
      setEndSegment(duration)
    }

    if (activeLoop) {
      const currentTime = player.getCurrentTime()
      setStartSegment(currentTime)
      setEndSegment(currentTime + segmentLength)
    } else {
      setStartSegment(null)
      setEndSegment(null)
    }
  }, [activeLoop, duration])

  useEffect(() => {
    if (startSegment !== null && endSegment !== null && onSegmentChange) {
      onSegmentChange({ start: startSegment, end: endSegment })
    }
  }, [startSegment, endSegment, onSegmentChange])

  if (!activeVideo) return null

  const resetToStartpoint: YouTubeProps['onPause'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (
      player &&
      activeLoop &&
      startSegment !== null &&
      event.data === 2
    ) {
      player.seekTo(startSegment, true)
    }
  }

  const handleStateChange: YouTubeProps['onStateChange'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }

    if (
      player &&
      endSegment &&
      event.data === 1
    ) {
      intervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime()
        if (currentTime >= endSegment) {
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

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo()
      setIsPlaying(true)
    }
  }

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo()
      setIsPlaying(false)
    }
  }

  const handleNextLoop = () => {
    if (startSegment === null || endSegment === null || duration === null) return

    const newStartSegment = startSegment + segmentLength
    const newEndSegment = newStartSegment + segmentLength

    if (newEndSegment > duration) {
      const adjustedStart = Math.max(0, duration - segmentLength)
      setStartSegment(adjustedStart)
      setEndSegment(duration)
      return
    }

    setStartSegment(newStartSegment)
    setEndSegment(newEndSegment)
  }

  const handlePreviousLoop = () => {
    if (startSegment === null || endSegment === null) return

    const newStartSegment = startSegment - segmentLength
    const newEndSegment = newStartSegment + segmentLength

    if (newStartSegment <= 0) {
      setStartSegment(0)
      setEndSegment(segmentLength)
      return
    }

    setStartSegment(newStartSegment)
    setEndSegment(newEndSegment)
  }

  return (
    <>
      <div className="video-window">
        <YouTube
          videoId={activeVideo}
          opts={{
            playerVars: {
              start: startSegment ? startSegment : undefined,
              rel: 0
            }
          }}
          onReady={handleReady}
          onPause={resetToStartpoint}
          onStateChange={handleStateChange}
        />
      </div>
      <div className="video-control-btns">
        {isPlaying ? (
          <button type="button" onClick={handlePause} className="video-control-pause">
            <FontAwesomeIcon icon={faPause} />
          </button>
        ) : (
          <button type="button" onClick={handlePlay} className="video-control-play">
            <FontAwesomeIcon icon={faPlay} />
          </button>
        )}
      </div>
      {activeLoop && (
        <div className="btn-row">
          {startSegment !== 0 ? (
            <button type="button" onClick={handlePreviousLoop} className="control-btn">Previous loop</button>
          ) : null}
          {endSegment !== duration ? (
            <button type="button" onClick={handleNextLoop} className="control-btn">Next loop</button>
          ) : null}
        </div>
      )}
    </>
  )
}

export default VideoWindow