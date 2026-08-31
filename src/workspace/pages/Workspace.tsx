import { useParams } from '@tanstack/react-router'
import { usePlayer } from '../hooks/usePlayer'
import YouTubeVideo from '../components/YouTubeVideo'
import ControlPanel from '../components/ControlPanel'
import { createYouTubeUrl } from '../utils/createYouTubeUrl'
import '../css/Workspace.css'

export default function Workspace() {
  const { videoId } = useParams({ from: '/app/workspace/$videoId' })
  const youtubeUrl = createYouTubeUrl(videoId)
  const player = usePlayer(youtubeUrl)

  return (
    <div className="workspace">
      <YouTubeVideo player={player} />
      <ControlPanel player={player} />
    </div>
  )
}
