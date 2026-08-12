import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { YouTubeSearchResponse, VideoOption } from '../types'
import { fetchVideos } from '../services/fetchVideos'
import { validateLink } from '../utils/validateLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import '../css/QueryForm.css'

type QueryFormProps = {
  setVideoOptions: React.Dispatch<React.SetStateAction<YouTubeSearchResponse['items']>>
  setActiveVideo: React.Dispatch<React.SetStateAction<string | null>>
}

export default function QueryForm({ setVideoOptions, setActiveVideo }: QueryFormProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const fetchVideosMutation = useMutation({
    mutationFn: fetchVideos
  })

  const handleQuery = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setVideoOptions([])
    setActiveVideo(null)
    // setPreviousQuery(searchQuery)
    // setIsNoResults(false)

    const { isValid, isEmbed } = validateLink(searchQuery)

    if (isValid) {
      const videoId = isEmbed
        ? (searchQuery.match(/embed\/([\w-]+)/)?.[1] ?? null)
        : (searchQuery.match(
            /(?:v=|\/v\/|youtu\.be\/|\/watch\?v=|\/live\/|\/shorts\/|\/embed\/)?([\w-]{11})/
          )?.[1] ?? null)

      if (videoId) {
        const response = await fetchVideosMutation.mutateAsync({ videoId })

        if (!response) return

        const data = (await response.json()) as YouTubeSearchResponse
        if (data.items && data.items.length > 0) {
          const video = data.items[0]
          const videoOption: VideoOption = {
            ...video,
            id: {
              videoId: typeof video.id === 'string' ? video.id : video.id.videoId
            }
          }
          localStorage.setItem('PREVIOUS_VIDEO', JSON.stringify(videoOption))
        }
        setActiveVideo(videoId)
        setVideoOptions([])
        setSearchQuery('')
        return
      }
    }

    const response = await fetchVideosMutation.mutateAsync({
      searchQuery
    })
    if (response) {
      const data = (await response.json()) as YouTubeSearchResponse

      if (!response.ok) {
        console.error('search failed', data)
        setVideoOptions([])
        // setIsNoResults(false)
        return
      }

      const items = Array.isArray(data.items) ? data.items : []
      setVideoOptions(items)

      // if (items.length === 0) setIsNoResults(true)
    }

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
