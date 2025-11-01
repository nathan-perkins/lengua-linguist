type QueryFormProps = {
  handleQuery: React.FormEventHandler<HTMLFormElement>
  searchQuery: string
  setSearchQuery: (value: string) => void
}

function QueryForm({ handleQuery, searchQuery, setSearchQuery}: QueryFormProps) {
  return (
    <form onSubmit={handleQuery}>
        <label>
          Input link:
          <input
            type="text" 
            className="search-label" 
            value={searchQuery} 
            onChange={({ target }) => setSearchQuery(target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>
  )
}

export default QueryForm