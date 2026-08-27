import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import YouTubeVideo from '../components/YouTubeVideo'
import ControlPanel from '../components/ControlPanel'
import '../css/Workspace.css'

export default function Workspace() {
  const { videoId } = useParams({ from: '/app/workspace/$videoId' })
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="workspace">
      <YouTubeVideo videoId={videoId} isPlaying={isPlaying} />
      <ControlPanel isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </div>
  )
}
