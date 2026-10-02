import type { PlayerState } from '../types'
import '../css/TimelineTick.css'

type TimelineTickProps = {
  state: PlayerState
}

export default function TimelineTick({ state }: TimelineTickProps) {
  return (
    <div
      className="timeline-tick"
      style={{ '--start': `${state.activeLoops[0].start}%` } as React.CSSProperties}
    />
  )
}
