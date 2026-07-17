import { render, screen } from '@testing-library/react'
import VideoTimeline from './VideoTimeline'

let capturedOnDragEnd: ((event: any) => void) | undefined

vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual<any>('@dnd-kit/core')
  return {
    ...actual,
    DndContext: ({ onDragEnd, children}: any) => {
      capturedOnDragEnd = onDragEnd
      return <div>{children}</div>
    }
  }
})

function setupTimelineBarMetrics() {
  const bar = document.querySelector('.video-timeline-bar') as HTMLDivElement
  expect(bar).not.toBeNull()
  if (!bar) throw new Error('timeline bar not found')

  Object.defineProperty(bar, 'offsetWidth', {
    value: 1000,
    configurable: true 
  })

  vi.spyOn(bar, 'getBoundingClientRect').mockReturnValue({
    width: 1000,
    height: 20,
    top: 0,
    left: 0,
    right: 1000,
    bottom: 20,
    x: 0,
    y: 0,
    toJSON: () => {}
  })
}

describe('VideoTimeline', () => {
  it('should call onSegmentUpdate with computed end time when drag ends', () => {
    const onSegmentUpdate = vi.fn()

    render(
      <VideoTimeline
        currentTime={10}
        duration={120}
        segments={[
          {
            index: 0,
            start: 10,
            end: 22,
            initialEnd: 22
          }
        ]}
        activeSegmentIndex={0}
        pendingSegmentStart={null}
        onSegmentUpdate={onSegmentUpdate}
        loopController={true}
      />
    )

    expect(screen.getByLabelText(/segment end at 22s/i)).toBeInTheDocument()
    setupTimelineBarMetrics()

    capturedOnDragEnd?.({
      active: { id: 'segment-0-end' },
      delta: { x: 120 },
      activatorEvent: { clientX: 700 }
    })

    expect(onSegmentUpdate).toHaveBeenCalledTimes(1)
    const [, newEnd] = onSegmentUpdate.mock.calls[0]
    expect(newEnd).toBeCloseTo(24.88, 2)
  })
})
