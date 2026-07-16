import { render, screen } from '@testing-library/react'
import LoopControlFrame from './LoopControlFrame'
import userEvent from '@testing-library/user-event'

const segments = [
  {
    index: 0,
    start: 10,
    end: 22,
    initialEnd: 22,
    name: 'Loop 1'
  }
]

function renderLoopControlFrame() {
  const onSegmentUpdate = vi.fn()

  return {
    user: userEvent.setup(),
    onSegmentUpdate,
    ...render(
      <LoopControlFrame
        currentTime={12}
        duration={120}
        segments={segments}
        activeSegmentIndex={0}
        pendingSegmentStart={null}
        onSeek={vi.fn()}
        onSegmentUpdate={onSegmentUpdate}
        activeVideo="pG0zn5Hvse8"
        loopController={false}
      />
    )
  }
}

describe('LoopControlFrame', () => {
  it('should bring up the rename modal when loop name is clicked', async () => {
    const { user } = renderLoopControlFrame()

    const loopName = screen.getByText('Loop 1')
    await user.click(loopName)

    expect(screen.getByDisplayValue('Loop 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('should update loop name when save button is clicked', async () => {
    const { user, onSegmentUpdate } = renderLoopControlFrame()

    const loopName = screen.getByText('Loop 1')
    await user.click(loopName)

    const nameInput = screen.getByDisplayValue('Loop 1')
    await user.clear(nameInput)
    await user.type(nameInput, 'Intro loop')

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    expect(onSegmentUpdate).toHaveBeenCalledWith(0, 22, 'Intro loop')
  })

  it('should not update loop name when cancel button is clicked', async () => {
    const { user, onSegmentUpdate } = renderLoopControlFrame()

    const loopName = screen.getByText('Loop 1')
    await user.click(loopName)

    const nameInput = screen.getByDisplayValue('Loop 1')
    await user.clear(nameInput)
    await user.type(nameInput, 'Intro loop')

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onSegmentUpdate).not.toHaveBeenCalled()
  })
})
