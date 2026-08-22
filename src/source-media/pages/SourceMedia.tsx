import { useState } from 'react'
import { useSearch } from '../hooks/useSearch'
import QueryForm from '../components/QueryForm'
import YouTubeSearchResultBox from '../components/YouTubeSearchResultBox'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const [submittedQuery, setSubmittedQuery] = useState('')
  const { searchResults, isSearchError, searchError } = useSearch(submittedQuery)

  if (isSearchError) throw new Error(String(searchError))

  return (
    <div className="source-media">
      <QueryForm setSubmittedQuery={setSubmittedQuery} />
      <div className="search-results-container">
        <p>{submittedQuery ? `Results for "${submittedQuery}"` : null}</p>
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((result) => (
            <YouTubeSearchResultBox key={result.id} result={result} lastViewed={!submittedQuery} />
          ))}
      </div>
    </div>
  )
}
