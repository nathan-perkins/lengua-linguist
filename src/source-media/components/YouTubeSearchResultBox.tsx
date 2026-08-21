import type { YouTubeSearchResult } from '../schemas'
import '../css/YouTubeSearchResultBox.css'

type VideoOptionProps = {
  result: YouTubeSearchResult
  lastViewed: boolean
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string>>
}

export default function YouTubeSearchResultBox({
  result,
  lastViewed,
  setSelectedVideoId
}: VideoOptionProps) {
  return lastViewed ? (
    <BaseResultBox result={result} />
  ) : (
    <button
      type="button"
      onClick={() => setSelectedVideoId(result.id.videoId)}
      className="youtube-search-result-btn"
    >
      <BaseResultBox result={result} />
    </button>
  )
}

type BaseResultProps = {
  result: YouTubeSearchResult
}

function BaseResultBox({ result }: BaseResultProps) {
  return (
    <div className="video-option-container">
      <img
        src={result.snippet.thumbnails.medium.url}
        alt={result.snippet.title}
        className="thumbnail"
      />
      <div className="info">
        <h3>{result.snippet.title}</h3>
        <p>{result.snippet.channelTitle}</p>
      </div>
    </div>
  )
}
