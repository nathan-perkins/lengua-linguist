import { useState } from 'react'
import { IconZoom } from '@tabler/icons-react'
import '../css/QueryForm.css'

type QueryFormProps = {
  initialQuery: string
  handleSubmit: (query: string) => void
}

export default function QueryForm({ initialQuery, handleSubmit }: QueryFormProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(searchQuery)
  }

  return (
    <form onSubmit={onSubmit} className="query-form">
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
            <IconZoom className="search-icon" />
          </button>
        </div>
      </label>
    </form>
  )
}
