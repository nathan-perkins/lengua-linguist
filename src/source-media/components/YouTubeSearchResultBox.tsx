import { Link } from '@tanstack/react-router'
import type { YouTubeVideo } from '../schemas'
import languageMap from '../../shared/languageMap.json'
import '../css/YouTubeSearchResultBox.css'

type VideoOptionProps = {
  result: YouTubeVideo
}

export default function YouTubeSearchResultBox({ result }: VideoOptionProps) {
  const langKey = result.snippet.defaultLanguage as keyof typeof languageMap
  const langData = languageMap[langKey]

  return (
    <Link
      to="/app/workspace/$videoId"
      params={{ videoId: result.id }}
      className="youtube-search-result-btn"
    >
      <div className="youtube-results-container">
        <img
          src={result.snippet.thumbnails.medium.url}
          alt={result.snippet.title}
          className="thumbnail"
        />
        <div className="info">
          <h3 className="video-title">{result.snippet.title}</h3>
          <p>{result.snippet.channelTitle}</p>
          <span className="tag" style={{ '--theme': langData.theme } as React.CSSProperties}>
            {langData ? langData.language : null}
          </span>
        </div>
      </div>
    </Link>
  )
}
