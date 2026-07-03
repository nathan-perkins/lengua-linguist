import { type SubmitEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

interface QueryFormProps {
  handleQuery: SubmitEventHandler<HTMLFormElement>
  searchQuery: string
  setSearchQuery: (value: string) => void
}

function QueryForm({
  handleQuery,
  searchQuery,
  setSearchQuery
}: QueryFormProps) {
  return (
    <div className="query-form-container">
      <p>Select a YouTube video</p>
      <form onSubmit={handleQuery} className="query-form">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-label"
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
          />
          <button type="submit" className="search-icon-btn">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </form>
      <p>Search by title or link</p>
    </div>
  )
}

export default QueryForm
