import { useNavigate, useSearch } from '@tanstack/react-router'
import { useYouTubeSearch } from '../hooks/useYouTubeSearch'
import QueryForm from '../components/QueryForm'
import YouTubeSearchResultBox from '../components/YouTubeSearchResultBox'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const { q } = useSearch({ from: '/app/media' })
  const navigate = useNavigate({ from: '/app/media' })
  const { searchResults, isSearchError, searchError } = useYouTubeSearch(q)

  const handleSearchSubmit = (newQuery: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: newQuery })
    })
  }

  if (isSearchError) throw new Error(String(searchError))

  return (
    <div className="source-media">
      <QueryForm initialQuery={q} handleSubmit={handleSearchSubmit} />
      <div className="search-results-container">
        <p>{q ? `Results for "${q}"` : null}</p>
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((result) => (
            <YouTubeSearchResultBox key={result.id} result={result} lastViewed={!q} />
          ))}
      </div>
    </div>
  )
}
