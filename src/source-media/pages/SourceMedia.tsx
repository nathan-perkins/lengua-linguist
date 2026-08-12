import { useState } from 'react'
import type { VideoOption } from '../types'
import QueryForm from '../components/QueryForm'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [, setVideoOptions] = useState<VideoOption[]>([])
  const [, setActiveVideo] = useState<string | null>(null)

  return (
    <div className="source-media">
      <QueryForm setVideoOptions={setVideoOptions} setActiveVideo={setActiveVideo} />
    </div>
  )
}
