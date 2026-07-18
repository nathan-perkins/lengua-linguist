import { render, screen } from '@testing-library/react'
import VideoWindow from './VideoWindow'
import userEvent from '@testing-library/user-event'

const yt = vi.hoisted(() => ({
  currentTime: 10,
  playerState: 2,
  onPauseRef: null as null | ((event: any) => void),
  onStateChangeRef: null as null | ((event: any) => void)
}))

vi.mock('react-youtube', () => {
  const mockPlayer = {
    seekTo: vi.fn((seconds: number) => {
      yt.currentTime = seconds
    }),
    getCurrentTime: vi.fn(() => yt.currentTime),
    getDuration: vi.fn(() => 120),
    getPlayerState: vi.fn(() => yt.playerState),
    getIframe: vi.fn(() => document.createElement('iframe')),
    playVideo: vi.fn(() => {
      yt.playerState = 1
      yt.onStateChangeRef?.({ target: mockPlayer, data: 1 })
    }),
    pauseVideo: vi.fn(() => {
      yt.playerState = 2
      yt.currentTime += 4
      yt.onStateChangeRef?.({ target: mockPlayer, data: 2 })
      yt.onPauseRef?.({ target: mockPlayer, data: 2 })
    })
  }

  const MockYouTube = ({ onReady, onPause, onStateChange }: any) => {
    yt.onPauseRef = onPause
    yt.onStateChangeRef = onStateChange

    queueMicrotask(() => onReady?.({ target: mockPlayer }))
    return <div>Mock YouTube Player</div>
  }

  return { __esModule: true, default: MockYouTube }
})

function renderVideoWindow() {
  return {
    user: userEvent.setup(),
    ...render(
      <VideoWindow
        activeVideo={'pG0zn5Hvse8'}
        showButtonTitles={true}
        setShowButtonTitles={vi.fn()}
      />
    )
  }
}

describe('VideoWindow', () => {
  beforeEach(() => {
    yt.currentTime = 10
    yt.playerState = 2
    yt.onPauseRef = null
    yt.onStateChangeRef = null
    vi.clearAllMocks()
  })

  it('should toggle loop control title after click', async () => {
    const { user } = renderVideoWindow()

    const loopControlButton = screen.getByRole('button', { name: /enter loop sequence/i })
    await user.click(loopControlButton)

    expect(await screen.findByRole('button', { name: /exit loop sequence/i })).toBeInTheDocument()
  })

  it('should create a pending segment when loop control button is clicked once', async () => {
    const { user } = renderVideoWindow()

    const loopControlButton = screen.getByRole('button', { name: /enter loop sequence/i })
    await user.click(loopControlButton)

    expect(screen.getByRole('generic', { name: /pending segment start/i })).toBeInTheDocument()
  })

  it('should finish loop creation after loop control button is clicked and pause button is clicked', async () => {
    const { user } = renderVideoWindow()

    const loopControlButton = screen.getByRole('button', { name: /enter loop sequence/i })
    await user.click(loopControlButton)

    expect(screen.getByRole('generic', { name: /pending segment start/i })).toBeInTheDocument()

    const playButton = screen.getByRole('button', { name: /play video/i })
    await user.click(playButton)

    const pauseButton = screen.getByRole('button', { name: /pause video/i })
    await user.click(pauseButton)

    expect(await screen.findByLabelText(/segment start at 10s/i)).toBeInTheDocument()
    expect(await screen.findByLabelText(/segment end at 14s/i)).toBeInTheDocument()
  })

  it('should create a pending loop when next is clicked on the last active loop', async () => {
    const { user } = renderVideoWindow()

    const loopControlButton = screen.getByRole('button', { name: /enter loop sequence/i })
    await user.click(loopControlButton)

    const playButton = screen.getByRole('button', { name: /play video/i })
    await user.click(playButton)

    const pauseButton = screen.getByRole('button', { name: /pause video/i })
    await user.click(pauseButton)

    const nextButton = screen.getByRole('button', { name: /next loop/i })
    await user.click(nextButton)

    expect(screen.getAllByLabelText(/pending segment start/i).length).toBeGreaterThan(0)
  })

  it('should navigate between existing loops with previous and next buttons', async () => {
    const { user } = renderVideoWindow()

    await user.click(screen.getByRole('button', { name: /enter loop sequence/i }))

    // Create loop 1: 10 -> 14
    await user.click(screen.getByRole('button', { name: /play video/i }))
    await user.click(screen.getByRole('button', { name: /pause video/i }))

    // Next on last loop should create pending start for loop 2
    await user.click(screen.getByRole('button', { name: /next loop/i }))

    // Pending marker may be duplicated in DOM; assert at least one exists
    expect(screen.getAllByLabelText(/pending segment start/i).length).toBeGreaterThan(0)

    // Finish loop 2: 14 -> 18
    await user.click(screen.getByRole('button', { name: /play video/i }))
    await user.click(screen.getByRole('button', { name: /pause video/i }))

    // Confirm loop 2 is now active
    expect(await screen.findByText('Loop 2')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /previous loop/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next loop/i })).toBeInTheDocument()

    // Move back to loop 1
    await user.click(screen.getByRole('button', { name: /previous loop/i }))
    expect(await screen.findByText('Loop 1')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /previous loop/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next loop/i })).toBeInTheDocument()

    // Move forward to loop 2 again
    await user.click(screen.getByRole('button', { name: /next loop/i }))
    expect(await screen.findByText('Loop 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous loop/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next loop/i })).toBeInTheDocument()
  })

  it('should exit loop sequence and discard loops when loop control button is clicked twice', async () => {
    const { user } = renderVideoWindow()

    const enterLoopSequenceButton = screen.getByRole('button', { name: /enter loop sequence/i })
    await user.click(enterLoopSequenceButton)

    const playButton = screen.getByRole('button', { name: /play video/i })
    await user.click(playButton)

    const pauseButton = screen.getByRole('button', { name: /pause video/i })
    await user.click(pauseButton)

    expect(await screen.findByLabelText(/segment start at 10s/i)).toBeInTheDocument()
    expect(await screen.findByLabelText(/segment end at 14s/i)).toBeInTheDocument()

    const exitLoopSequenceButton = screen.getByRole('button', { name: /exit loop sequence/i })
    await user.click(exitLoopSequenceButton)

    expect(screen.queryByLabelText(/segment start at 10s/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/segment end at 22s/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/pending segment start/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter loop sequence/i })).toBeInTheDocument()
  })
})
