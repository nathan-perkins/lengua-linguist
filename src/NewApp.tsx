import { useState, useRef } from 'react'
import AppHead from './components/AppHead'
import './NewApp.css'

export default function NewApp() {
  const [headHeight, setHeadHeight] = useState(0)
  const headRef = useRef<HTMLDivElement>(null)

  return (
    <div className="new-app-container" style={{ paddingTop: `calc(${headHeight}px + 1.5rem)` }}>
      <AppHead ref={headRef} setHeadHeight={setHeadHeight} />
      <div>content</div>
    </div>
  )
}
