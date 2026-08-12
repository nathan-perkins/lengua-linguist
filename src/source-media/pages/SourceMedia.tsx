import { useState } from 'react'
import type { YouTubeSearchResponse } from '../types'
import QueryForm from '../components/QueryForm'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [, setVideoOptions] = useState<YouTubeSearchResponse['items']>([])
  const [, setActiveVideo] = useState<string | null>(null)

  return (
    <div className="source-media">
      <QueryForm setVideoOptions={setVideoOptions} setActiveVideo={setActiveVideo} />
    </div>
  )
}
