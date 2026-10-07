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
      if (e.key === 'F12') return

      e.preventDefault()

      if (e.code === 'Space') handlers.handlePlayPause()
      if (e.code === 'ArrowRight' && !state.isActiveLoop) handlers.handleForward()
      if (e.code === 'ArrowLeft' && !state.isActiveLoop) handlers.handleBackward()
      if (e.code === 'Enter' && !state.isActiveLoop) handlers.handleToggleLoops()
      if (e.code === 'Escape' && state.isActiveLoop) handlers.handleToggleLoops()
      if (e.code === 'ArrowRight' && state.isActiveLoop) handlers.handleLoopForwardStep()
      if (e.code === 'ArrowLeft' && state.isActiveLoop) handlers.handleLoopBackwardStep()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
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
        onSeeked={handlers.handleSeeked}
      />
    </div>
  )
}
