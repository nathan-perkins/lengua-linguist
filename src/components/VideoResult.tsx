interface VideoResultProps {
  option: {
    id: { videoId: string }
    snippet: { title: string }
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
      {option.snippet.title}
    </button>
  )
}

export default VideoResult