import { Link, useParams } from '@tanstack/react-router'
import { IconLinkFilled, IconXFilled } from '@tabler/icons-react'
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
          <IconLinkFilled />
          <span>{url}</span>
          <Link className="x-icon" to="/app/media" search={{ q: '' }}>
            <IconXFilled />
          </Link>
        </div>
      )}
    </header>
  )
}
