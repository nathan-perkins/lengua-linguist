import { useState, useEffect, useRef } from 'react'
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'

interface VideoWindowProps {
  activeVideo: string | null
  activeLoop: boolean
  onSegmentChange?: (segment: { start: number; end: number }) => void
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  pauseVideo: () => void
  getCurrentTime: () => number
  getDuration: () => number
}

function VideoWindow({ activeVideo, activeLoop, onSegmentChange }: VideoWindowProps) {
  const [startSegment, setStartSegment] = useState<number | null>(null)
  const [endSegment, setEndSegment] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)

  const handleReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer
    playerRef.current = player

    const videoDuration = player.getDuration()
    setDuration(videoDuration)
  }

  useEffect(() => {
    const player = playerRef.current

    if (player === null || duration === null) return

    if (activeLoop && duration < 16) {
      setStartSegment(0)
      setEndSegment(duration)
    }

    if (activeLoop) {
      const currentTime = player.getCurrentTime()
      setStartSegment(currentTime)
      setEndSegment(currentTime + 8)
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
      startSegment &&
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
        }
      }, 100)
    }
  }

  const handleNextLoop = () => {
    if (startSegment === null || endSegment === null || duration === null) return

    const newStartSegment = startSegment + 8
    const newEndSegment = newStartSegment + 8

    if (newEndSegment > duration) {
      const adjustedStart = Math.max(0, duration - 8)
      setStartSegment(adjustedStart)
      setEndSegment(duration)
      return
    }

    setStartSegment(newStartSegment)
    setEndSegment(newEndSegment)
  }

  const handlePreviousLoop = () => {
    if (startSegment === null || endSegment === null) return

    const newStartSegment = startSegment - 8
    const newEndSegment = newStartSegment + 8

    if (newStartSegment <= 0) {
      setStartSegment(0)
      setEndSegment(8)
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
              start: startSegment ? startSegment : undefined
            }
          }}
          onReady={handleReady}
          onPause={resetToStartpoint}
          onStateChange={handleStateChange}
        />
      </div>
      {activeLoop && (
        <div className="btn-row">
          <button type="button" onClick={handlePreviousLoop} className="control-btn">Previous loop</button>
          <button type="button" onClick={handleNextLoop} className="control-btn">Next loop</button>
        </div>
      )}
    </>
  )
}

export default VideoWindow