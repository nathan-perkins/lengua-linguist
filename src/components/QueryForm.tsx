type QueryFormProps = {
  handleQuery: React.FormEventHandler<HTMLFormElement>
  searchQuery: string
  setSearchQuery: (value: string) => void
}

function QueryForm({ handleQuery, searchQuery, setSearchQuery}: QueryFormProps) {
  return (
    <form onSubmit={handleQuery} className="query-form">
      <input
        type="text" 
        className="search-label" 
        value={searchQuery} 
        onChange={({ target }) => setSearchQuery(target.value)}
        placeholder="Search for a YouTube video..."
      />
      <button type="submit" className="query-btn">Search</button>
    </form>
  )
}

export default QueryForm