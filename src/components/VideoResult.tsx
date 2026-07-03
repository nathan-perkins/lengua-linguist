import { useState, useEffect } from 'react'
import type { VideoOption } from '../App'

interface VideoResultProps {
  option: VideoOption
  onSelect: (option: VideoOption) => void
}

function VideoResult({ option, onSelect }: VideoResultProps) {
  const [showDescription, setShowDescription] = useState<boolean>(() => window.innerWidth >= 1150)

  useEffect(() => {
    const handleResize = () => setShowDescription(window.innerWidth >= 1150)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className="video-option-btn"
    >
      <img
        src={option.snippet.thumbnails.medium.url}
        alt={option.snippet.title}
        className="video-option-thumbnail"
      />
      <div className="video-option-info">
        <h3 className="video-option-title">{option.snippet.title}</h3>
        <p className="video-option-channel">{option.snippet.channelTitle}</p>
        {showDescription && (
          <p className="video-option-description">{option.snippet.description}</p>
        )}
      </div>
    </button>
  )
}

export default VideoResult 
