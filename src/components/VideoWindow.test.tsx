import { render, screen } from '@testing-library/react'
import VideoWindow from './VideoWindow'
import userEvent from '@testing-library/user-event'

vi.mock('react-youtube', () => {
  const MockYouTube = ({ onReady, onPause, onStateChange }: any) => {
    let currentTime = 10

    const mockPlayer = {
      seekTo: vi.fn((seconds: number) => {
        currentTime = seconds
      }),
      getCurrentTime: vi.fn(() => currentTime),
      getDuration: vi.fn(() => 120),
      getPlayerState: vi.fn(() => mockPlayer.playerState),
      getIframe: vi.fn(() => document.createElement('iframe')),
      playerState: 2,
      playVideo: vi.fn(() => {
        mockPlayer.playerState = 1
        currentTime = 18
        onStateChange?.({ target: mockPlayer, data: 1 })
      }),
      pauseVideo: vi.fn(() => {
        mockPlayer.playerState = 2
        currentTime = 22
        onStateChange?.({ target: mockPlayer, data: 2 })
        onPause?.({ target: mockPlayer, data: 2 })
      })
    }

    queueMicrotask(() => onReady?.({ target: mockPlayer }))

    return <div>Mock YouTube Player</div>
  }

  return {
    __esModule: true,
    default: MockYouTube
  }
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
    expect(await screen.findByLabelText(/segment end at 22s/i)).toBeInTheDocument()

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
    expect(await screen.findByLabelText(/segment end at 22s/i)).toBeInTheDocument()

    const exitLoopSequenceButton = screen.getByRole('button', { name: /exit loop sequence/i })
    await user.click(exitLoopSequenceButton)

    expect(screen.queryByLabelText(/segment start at 10s/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/segment end at 22s/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/pending segment start/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter loop sequence/i })).toBeInTheDocument()
  })
})
