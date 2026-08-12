import React, { useState } from 'react'
import { useQuery, queryOptions } from '@tanstack/react-query'
import type { VideoOption } from '../types'
import { videosQueryById, videosQueryByQuery } from '../queries'
import { validateLink } from '../utils/validateLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '../css/QueryForm.css'

type QueryFormProps = {
  setVideoOptions: React.Dispatch<React.SetStateAction<VideoOption[]>>
  setActiveVideo: React.Dispatch<React.SetStateAction<string | null>>
}

export default function QueryForm({
  // setVideoOptions,
  setActiveVideo
}: QueryFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [activeIdQuery, setActiveIdQuery] = useState('')

  const videoQueryOptions = activeIdQuery
    ? videosQueryById(activeIdQuery)
    : activeQuery
      ? videosQueryByQuery(activeQuery)
      : queryOptions({
          queryKey: ['youtube-search', 'idle'],
          queryFn: async (): Promise<VideoOption[]> => [],
          enabled: false
        })

  const { data: videos = [], isError } = useQuery(videoQueryOptions)

  const handleQuery = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const input = searchQuery.trim()
    if (!input) return

    setActiveVideo(null)

    const { isValid, isEmbed } = validateLink(searchQuery)

    if (isValid) {
      const videoId = isEmbed
        ? (searchQuery.match(/embed\/([\w-]+)/)?.[1] ?? null)
        : (searchQuery.match(
            /(?:v=|\/v\/|youtu\.be\/|\/watch\?v=|\/live\/|\/shorts\/|\/embed\/)?([\w-]{11})/
          )?.[1] ?? null)

      if (videoId) {
        setActiveQuery('')
        setActiveIdQuery(videoId)
        setActiveVideo(videoId)
        setSearchQuery('')
        return
      }
    }

    setActiveIdQuery('')
    setActiveQuery(input)
    setSearchQuery('')
  }

  if (isError) return

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

      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>{video.snippet.title}</li>
        ))}
      </ul>
    </form>
  )
}
