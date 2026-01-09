interface VideoResultProps {
  option: {
    id: { videoId: string }
    snippet: {
      title: string
      thumbnails: {
        medium: {
          url: string
          width: number
          height: number
        }
      }
      channelTitle: string
      description: string
    }
  }
  onSelect: (videoId: string) => void
}

function VideoResult({ option, onSelect }: VideoResultProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id.videoId)}
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
        <p className="video-option-description">{option.snippet.description}</p>
      </div>
    </button>
  )
}

export default VideoResult