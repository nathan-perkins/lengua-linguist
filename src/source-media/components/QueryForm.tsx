import React, { useState } from 'react'
import { useVideoQuery } from '../hooks/useVideoQuery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '../css/QueryForm.css'

export default function QueryForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const { videos, isPending, isError, error } = useVideoQuery(submittedQuery)

  const handleQuery = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmittedQuery(searchQuery)
    setSearchQuery('')
  }

  return (
    <>
      <form onSubmit={(e) => void handleQuery(e)} className="query-form">
        <label>
          Explore target language videos
          <div className="search-wrapper">
            <input
              type="text"
              className="searchbar"
              value={searchQuery}
              placeholder="Search videos or paste YouTube URL"
              onChange={({ target }) => setSearchQuery(target.value)}
            />
            <button type="submit" className="search-icon-btn">
              <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
            </button>
          </div>
        </label>
      </form>

      {isPending && <p>Loading...</p>}
      {isError && <p>{String(error)}</p>}
      {!isPending && !isError && (
        <ul>
          {videos.map((video) => (
            <li key={video.id.videoId}>{video.snippet.title}</li>
          ))}
        </ul>
      )}
    </>
  )
}
