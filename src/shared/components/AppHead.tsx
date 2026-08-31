import { Link, useParams } from '@tanstack/react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faX } from '@fortawesome/free-solid-svg-icons'
import { createYouTubeUrl } from '../../workspace/utils/createYouTubeUrl'
import '../css/AppHead.css'

export default function AppHead() {
  const { videoId } = useParams({ strict: false })
  const url = videoId ? createYouTubeUrl(videoId) : null

  return (
    <header className="apphead">
      <Link className="link" to="/">
        Lengua<span className="accent">Linguist</span>
      </Link>
      {videoId && (
        <div className="source">
          <FontAwesomeIcon icon={faLink} />
          <span>{url}</span>
          <Link className="x-icon" to="/app/media">
            <FontAwesomeIcon icon={faX} />
          </Link>
        </div>
      )}
    </header>
  )
}
