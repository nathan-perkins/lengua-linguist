import { useState, useEffect, useRef } from 'react'
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube'
import VideoTimeline from './VideoTimeline'
import Recorder from './Recorder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'

interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  playVideo: () => void
  pauseVideo: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getIframe: () => HTMLIFrameElement
}

interface Segment {
  start: number
  end: number
}

interface VideoWindowProps {
  activeVideo: string | null
}

function VideoWindow({ activeVideo }: VideoWindowProps) {
  const [activeLoop, setActiveLoop] = useState<boolean>(false)
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
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

  if (!activeVideo) return null

  const activeSegment = segments[activeSegmentIndex]

  const resetToStartpoint: YouTubeProps['onPause'] = (event: YouTubeEvent) => {
    const player = event.target as YouTubePlayer

    if (
      player &&
      activeLoop &&
      activeSegment &&
      event.data === 2
    ) {
      player.seekTo(activeSegment.start, true)
    }
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
    if (!duration) return

    if (activeSegmentIndex < segments.length - 1) {
      const nextIndex = activeSegmentIndex + 1
      setActiveSegmentIndex(nextIndex)
      if (playerRef.current) {
        playerRef.current.seekTo(segments[nextIndex].start, true)
      }
    } else {
      const lastSegmentEndTime = segments.length > 0 ? segments[segments.length - 1].end : 0
      if (lastSegmentEndTime < duration) {
        const newSegment = {
          start: lastSegmentEndTime,
          end: Math.min(lastSegmentEndTime + segmentLength, duration)
        }
        const updatedSegments = [...segments, newSegment].sort((a, b) => a.start - b.start)
        setSegments(updatedSegments)
        // this will need to change to be based on an id that's based on start and end times
        setActiveSegmentIndex(updatedSegments.length - 1)
        if (playerRef.current) {
          playerRef.current.seekTo(newSegment.start, true)
        }
      }
    }
  }

  const handlePreviousLoop = () => {
    if (!duration) return

    if (activeSegmentIndex > 0) {
      const prevIndex = activeSegmentIndex - 1
      setActiveSegmentIndex(prevIndex)
      if (playerRef.current) {
        playerRef.current.seekTo(segments[prevIndex].start, true)
      }
    } else {
      const prevSegmentStartTime = segments.length > 0 ? segments[0].start : 0
      if (prevSegmentStartTime > 0) {
        const newSegment = {
          start: Math.max(0, prevSegmentStartTime - segmentLength),
          end: prevSegmentStartTime
        }
        const updatedSegments = [newSegment, ...segments].sort((a, b) => a.start - b.start)
        setSegments(updatedSegments)
        // this will also need to change (see above)
        setActiveSegmentIndex(0)
        if (playerRef.current) {
          playerRef.current.seekTo(newSegment.start, true)
        }
      }
    }
  }

  const handleStartLoop = () => {
    if (!playerRef.current || duration === null) return

    const start = playerRef.current.getCurrentTime()
    const end = Math.min(start + segmentLength, duration)

    setSegments([{ start, end }])
    setActiveSegmentIndex(0)
    setActiveLoop(true)
  }

  const handleEndLoop = () => {
    setSegments([])
    setActiveSegmentIndex(0)
    setActiveLoop(false)
  }

  return (
    <>
      <div className="video-window">
        <YouTube
          videoId={activeVideo}
          opts={{
            playerVars: {
              start: activeSegment ? activeSegment.start : undefined,
              rel: 0
            }
          }}
          onReady={handleReady}
          onPause={resetToStartpoint}
          onStateChange={handleStateChange}
        />
      </div>
      <div className="video-timeline">
          <VideoTimeline currentTime={currentTime} duration={duration ?? 0} segments={segments} activeSegmentIndex={activeSegmentIndex} onSeek={handleSeek} />
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
          {activeSegment.start !== 0 ? (
            <button type="button" onClick={handlePreviousLoop} className="control-btn">Previous loop</button>
          ) : null}
          {activeSegment.end !== duration ? (
            <button type="button" onClick={handleNextLoop} className="control-btn">Next loop</button>
          ) : null}
        </div>
      )}
      <div className="btn-row">
        {activeLoop
          ? (
            <button type="button" onClick={handleEndLoop} className="loop-control-btn">End loop</button>
          ) : (
            <button type="button" onClick={handleStartLoop} className="loop-control-btn">Start loop</button>
          )}
      </div>
      {activeLoop && activeVideo && activeSegment ? (
        <Recorder videoId={activeVideo} startSegment={activeSegment.start} endSegment={activeSegment.end} />
      ) : null}
    </>
  )
}

export default VideoWindow