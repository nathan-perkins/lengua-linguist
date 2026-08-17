import type { SearchResponse } from '../types'
import '../css/VideoOption.css'

type VideoOptionProps = {
  video: SearchResponse
  lastViewed: boolean
}

function handleSelect() {
  console.log('clicked')
}

export default function VideoOption({ video, lastViewed }: VideoOptionProps) {
  return lastViewed ? (
    <BaseOption video={video} />
  ) : (
    <button type="button" onClick={handleSelect}>
      <BaseOption video={video} />
    </button>
  )
}

type BaseOptionProps = {
  video: SearchResponse
}

function BaseOption({ video }: BaseOptionProps) {
  return (
    <div className="video-option-container">
      <img
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.title}
        className="thumbnail"
      />
      <div className="info">
        <h3>{video.snippet.title}</h3>
        <p>{video.snippet.channelTitle}</p>
      </div>
    </div>
  )
}
