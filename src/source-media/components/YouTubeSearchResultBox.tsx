import type { YouTubeVideo } from '../schemas'
import languageMap from '../../shared/languageMap.json'
import '../css/YouTubeSearchResultBox.css'

type VideoOptionProps = {
  result: YouTubeVideo
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
      onClick={() => setSelectedVideoId(result.id)}
      className="youtube-search-result-btn"
    >
      <BaseResultBox result={result} />
    </button>
  )
}

type BaseResultProps = {
  result: YouTubeVideo
}

function BaseResultBox({ result }: BaseResultProps) {
  const langKey = result.snippet.defaultLanguage as keyof typeof languageMap
  const langData = languageMap[langKey]

  return (
    <div className="youtube-results-container">
      <img
        src={result.snippet.thumbnails.medium.url}
        alt={result.snippet.title}
        className="thumbnail"
      />
      <div className="info">
        <h3>{result.snippet.title}</h3>
        <p>{result.snippet.channelTitle}</p>
        <span className="tag" style={{ '--theme': langData.theme } as React.CSSProperties}>
          {langData ? langData.language : null}
        </span>
      </div>
    </div>
  )
}
