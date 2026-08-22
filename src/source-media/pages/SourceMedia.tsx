import { useState } from 'react'
import { useSearch } from '../hooks/useSearch'
import { useVideo } from '../hooks/useVideo'
import QueryForm from '../components/QueryForm'
import YouTubeSearchResultBox from '../components/YouTubeSearchResultBox'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [selectedVideoId, setSelectedVideoId] = useState('')
  const { searchResults, isSearchError, searchError } = useSearch(submittedQuery)
  const { videos, isVideoError, videoError } = useVideo(selectedVideoId)

  if (isSearchError) throw new Error(String(searchError))
  if (isVideoError) throw new Error(String(videoError))

  console.log('search results:', searchResults)
  console.log('videos:', videos)

  return (
    <div className="source-media">
      <QueryForm setSubmittedQuery={setSubmittedQuery} />
      <div className="search-results-container">
        <p>{videos.length > 0 ? `${videos[0].id}` : `Results for "${submittedQuery}"`}</p>
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((result) => (
            <YouTubeSearchResultBox
              key={result.id}
              result={result}
              lastViewed={!submittedQuery}
              setSelectedVideoId={setSelectedVideoId}
            />
          ))}
      </div>
    </div>
  )
}
