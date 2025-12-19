import { useState, useEffect, useRef } from 'react'
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'

interface VideoWindowProps {
  activeVideo: string | null
  activeLoop: boolean
}

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  pauseVideo: () => void
  getCurrentTime: () => number
}

function VideoWindow({ activeVideo, activeLoop }: VideoWindowProps) {
  const [startSegment, setStartSegment] = useState<number | null>(null)
  const [endSegment, setEndSegment] = useState<number | null>(null)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)

  const handleReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
    playerRef.current = event.target as YouTubePlayer
  }

  useEffect(() => {
    const player = playerRef.current

    if (player && activeLoop) {
      const currentTime = player.getCurrentTime()
      setStartSegment(currentTime)
      setEndSegment(currentTime + 8)
    } else {
      setStartSegment(null)
      setEndSegment(null)
    }
  }, [activeLoop])

  if (!activeVideo) return null

  const resetToStartpoint: YouTubeProps['onPause'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (
      player &&
      startSegment &&
      event.data === 0
    ) {
      player.seekTo(startSegment, true)
      player.pauseVideo()
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
        console.log(currentTime)
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

  return (
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
  )
}

export default VideoWindow