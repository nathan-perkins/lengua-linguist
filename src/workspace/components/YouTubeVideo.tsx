import ReactPlayer from 'react-player'
import type { Player } from '../types'
import '../css/YouTubeVideo.css'

type YouTubeVideoProps = {
  player: Player
}

export default function YouTubeVideo({
  player: { setPlayerRef, state, handlers }
}: YouTubeVideoProps) {
  return (
    <div className="youtube-video">
      <ReactPlayer
        className="player"
        ref={setPlayerRef}
        src={state.src}
        playing={state.playing}
        onDurationChange={handlers.handleDurationChange}
      />
    </div>
  )
}
