import { useParams } from '@tanstack/react-router'
import YouTubeVideo from '../components/YouTubeVideo'
import ControlPanel from '../components/ControlPanel'
import '../css/Workspace.css'

export default function Workspace() {
  const { videoId } = useParams({ from: '/app/workspace/$videoId' })

  return (
    <div className="workspace">
      <YouTubeVideo videoId={videoId} />
      <ControlPanel />
    </div>
  )
}
