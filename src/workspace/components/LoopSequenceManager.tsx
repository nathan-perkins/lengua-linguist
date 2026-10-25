import { useState } from 'react'
import { IconPencil, IconPlus } from '@tabler/icons-react'
import type { Player } from '../types'
import '../css/LoopSequenceManager.css'

type LoopSequenceManagerProps = {
  player: Player
}

export default function LoopSequenceManager({ player }: LoopSequenceManagerProps) {
  const [hoveredLoopId, setHoveredLoopId] = useState<number | null>(null)

  return (
    <div className="loop-sequence-manager">
      <div className="sequence-header">
        <span>Loop sequence</span>
        <button type="button" className="add-loop-btn" onClick={player.handlers.handleNewLoop}>
          <IconPlus />
        </button>
      </div>
      <div className="sequence-list">
        {player.state.isActiveLoop &&
          player.state.activeLoops.map((loop) => {
            if (loop.isPending) return

            return (
              <button
                className={`loop-entry${loop.isCurrent ? ' current' : ''}`}
                onClick={() => player.handlers.handleSelectLoop(loop)}
                onMouseEnter={() => setHoveredLoopId(loop.id)}
                onMouseLeave={() => setHoveredLoopId(null)}
              >
                <span>{`${loop.start.toFixed(2)}s - ${loop.end!.toFixed(2)}s`}</span>
                <p>{loop.title}</p>
                {hoveredLoopId === loop.id && (
                  <button
                    className="edit-icon-btn"
                    onClick={() => alert(`edit loop ${loop.id + 1}`)}
                  >
                    <IconPencil />
                  </button>
                )}
              </button>
            )
          })}
      </div>
    </div>
  )
}
