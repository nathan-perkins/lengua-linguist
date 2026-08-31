import type { PlayerState } from '../types'
import '../css/Timeline.css'

type TimelineProps = {
  state: PlayerState
}

export default function Timeline({ state }: TimelineProps) {
  const progress = Math.min(100, Math.max(0, state.played * 100))

  return (
    <div className="timeline">
      <div
        className={`timeline-progress ${state.playing ? 'timeline-progress-playing' : ''}`}
        style={{ '--progress': `${progress}%` } as React.CSSProperties}
      />
    </div>
  )
}
