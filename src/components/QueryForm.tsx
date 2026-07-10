import { type Dispatch, type SetStateAction, type SubmitEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

interface QueryFormProps {
  handleQuery: SubmitEventHandler<HTMLFormElement>
  searchQuery: string
  setSearchQuery: Dispatch<SetStateAction<string>>
}

function QueryForm({
  handleQuery,
  searchQuery,
  setSearchQuery
}: QueryFormProps) {
  return (
    <div className="query-form-container">
      <form onSubmit={handleQuery} className="query-form">
        <label>
          Explore target language videos by search or link
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
        </label>
      </form>
    </div>
  )
}

export default QueryForm
