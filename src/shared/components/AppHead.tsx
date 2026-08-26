import { Link } from '@tanstack/react-router'
import '../css/AppHead.css'

export default function AppHead() {
  return (
    <header className="apphead">
      <Link className="link" to="/">
        Lengua<span className="accent">Linguist</span>
      </Link>
    </header>
  )
}
