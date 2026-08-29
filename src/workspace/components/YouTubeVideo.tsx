import ReactPlayer from 'react-player'
import type { PlayerState } from '../types'
import '../css/YouTubeVideo.css'

type YouTubeVideoProps = {
  state: PlayerState
}

export default function YouTubeVideo({ state }: YouTubeVideoProps) {
  return (
    <div className="youtube-video">
      <ReactPlayer className="player" src={state.src} playing={state.playing} />
    </div>
  )
}
