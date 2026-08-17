import { useState } from 'react'
import { useVideoQuery } from '../hooks/useVideoQuery'
import QueryForm from '../components/QueryForm'
import VideoOption from '../components/VideoOption'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [submittedQuery, setSubmittedQuery] = useState('')
  const { videos, isError, error } = useVideoQuery(submittedQuery)

  if (isError) throw new Error(String(error))

  return (
    <div className="source-media">
      <QueryForm setSubmittedQuery={setSubmittedQuery} />
      <div className="video-results-container">
        <p>Results for "{submittedQuery}"</p>
        {videos &&
          videos.length > 0 &&
          videos.map((video) => (
            <VideoOption key={video.id.videoId} video={video} lastViewed={!!submittedQuery} />
          ))}
      </div>
    </div>
  )
}
