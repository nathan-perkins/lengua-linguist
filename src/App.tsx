import { useState } from 'react'
import VideoWindow from './components/VideoWindow'
import QueryForm from './components/QueryForm'
import './css/App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeVideo, setActiveVideo] = useState<string>('')

  const handleQuery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setActiveVideo(searchQuery)
    setSearchQuery('')
  }

  return (
    <div className="container">
      <VideoWindow activeVideo={activeVideo} />
      <QueryForm handleQuery={handleQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
}

export default App