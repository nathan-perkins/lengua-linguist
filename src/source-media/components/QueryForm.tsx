import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '../css/QueryForm.css'

type QueryFormProps = {
  setSubmittedQuery: React.Dispatch<React.SetStateAction<string>>
}

export default function QueryForm({ setSubmittedQuery }: QueryFormProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleQuery = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmittedQuery(searchQuery)
    setSearchQuery('')
  }

  return (
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
  )
}
