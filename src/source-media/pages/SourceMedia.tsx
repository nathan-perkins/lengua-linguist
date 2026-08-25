import { useNavigate, useSearch } from '@tanstack/react-router'
import { useYouTubeSearch } from '../hooks/useYouTubeSearch'
import { useYouTubeVideo } from '../hooks/useYouTubeVideo'
import QueryForm from '../components/QueryForm'
import YouTubeSearchResultBox from '../components/YouTubeSearchResultBox'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const { q } = useSearch({ from: '/app/media' })
  const navigate = useNavigate({ from: '/app/media' })
  const { searchResults, isSearchError, searchError } = useYouTubeSearch(q)

  const previousVideoId = localStorage.getItem('LL_VIDEO')
  const { videoResults, isVideoError, videoError } = useYouTubeVideo([previousVideoId || ''])

  const handleSearchSubmit = (newQuery: string) => {
    void navigate({
      search: (prev) => ({ ...prev, q: newQuery })
    })
  }

  if (isSearchError) throw new Error(String(searchError))
  if (isVideoError) throw new Error(String(videoError))

  return (
    <div className="source-media">
      <QueryForm initialQuery={q} handleSubmit={handleSearchSubmit} />
      <div className="search-results-container">
        <p>
          {previousVideoId && searchResults.length < 1
            ? 'Resume with previous video'
            : q
              ? `Results for "${q}"`
              : null}
        </p>
        {searchResults.length < 1 &&
          videoResults &&
          videoResults.length > 0 &&
          videoResults.map((result) => <YouTubeSearchResultBox key={result.id} result={result} />)}
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((result) => <YouTubeSearchResultBox key={result.id} result={result} />)}
      </div>
    </div>
  )
}
