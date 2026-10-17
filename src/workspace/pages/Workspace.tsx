import { useParams } from '@tanstack/react-router'
import { usePlayer } from '../hooks/usePlayer'
import LoopSequenceManager from '../components/LoopSequenceManager'
import YouTubeVideo from '../components/YouTubeVideo'
import Recorder from '../components/Recorder'
import ControlPanel from '../components/ControlPanel'
import { createYouTubeUrl } from '../utils/createYouTubeUrl'
import '../css/Workspace.css'

export default function Workspace() {
  const { videoId } = useParams({ from: '/app/workspace/$videoId' })
  const youtubeUrl = createYouTubeUrl(videoId)
  const player = usePlayer(youtubeUrl)

  return (
    <div className={`workspace${player.state.isActiveLoop ? ' active' : ''}`}>
      {player.state.isActiveLoop && <LoopSequenceManager player={player} />}
      <YouTubeVideo player={player} />
      {player.state.isActiveLoop && <Recorder />}
      <ControlPanel player={player} />
    </div>
  )
}
