import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useYouTubeSearch } from '../hooks/useYouTubeSearch'
import { useYouTubeVideo } from '../hooks/useYouTubeVideo'
import QueryForm from '../components/QueryForm'
import YouTubeSearchResultBox from '../components/YouTubeSearchResultBox'
import { parseLink } from '../utils/parseLink'
import '../css/SourceMedia.css'

export default function SourceMedia() {
  const { q } = useSearch({ from: '/app/media' })
  const navigate = useNavigate({ from: '/app/media' })

  const { isValid, link } = parseLink(q)
  useEffect(() => {
    if (isValid && link.videoId) {
      void navigate({ to: '/app/workspace/$videoId', params: { videoId: link.videoId } })
    }
  }, [isValid, link.videoId, navigate])

  const { searchResults, isSearchError, searchError } = useYouTubeSearch(
    !isValid ? q : link.videoId
  )

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
