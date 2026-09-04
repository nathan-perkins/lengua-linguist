import { useEffect } from 'react'
import ReactPlayer from 'react-player'
import type { Player } from '../types'
import '../css/YouTubeVideo.css'

type YouTubeVideoProps = {
  player: Player
}

export default function YouTubeVideo({
  player: { setPlayerRef, state, handlers }
}: YouTubeVideoProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return

      e.preventDefault()
      handlers.handlePlayPause()
    }

    window.addEventListener('keydown', handleKeyDown)
  }, [handlers])

  return (
    <div className="youtube-video">
      <ReactPlayer
        className="player"
        ref={setPlayerRef}
        src={state.src}
        playing={state.playing}
        onPlay={handlers.handlePlay}
        onPause={handlers.handlePause}
        onTimeUpdate={handlers.handleTimeUpdate}
        onDurationChange={handlers.handleDurationChange}
      />
    </div>
  )
}
