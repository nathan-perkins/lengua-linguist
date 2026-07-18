import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Recorder from './Recorder'

const TEST_VIDEO_ID = 'pG0zn5Hvse8'
const TEST_START = 10
const TEST_END = 14

const getSegmentKey = (videoId: string, start: number, end: number) =>
  `recording-${videoId}-${start}-${end}`

class MockFileReader {
  result: string | ArrayBuffer | null = null
  onloadend: null | (() => void) = null

  readAsDataURL() {
    this.result = 'data:audio/webm;base64,ZmFrZV9hdWRpbw=='
    this.onloadend?.()
  }
}

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = []

  ondataavailable: null | ((event: { data: Blob }) => void) = null
  onstop: null | (() => void) = null
  start = vi.fn()
  stop = vi.fn(() => {
    this.ondataavailable?.({
      data: new Blob(['fake audio'], { type: 'audio/webm' })
    })
    this.onstop?.()
  })

  constructor(_stream: MediaStream) {
    MockMediaRecorder.instances.push(this)
  }
}

function renderRecorder(
  props: Partial<{
    videoId: string
    startSegment: number
    endSegment: number
  }> = {}
) {
  return {
    user: userEvent.setup(),
    ...render(
      <Recorder
        videoId={props.videoId ?? TEST_VIDEO_ID}
        startSegment={props.startSegment ?? TEST_START}
        endSegment={props.endSegment ?? TEST_END}
      />
    )
  }
}

describe('Recorder', () => {
  const originalMediaRecorder = globalThis.MediaRecorder
  const originalFileReader = globalThis.FileReader
  const originalAlert = globalThis.alert
  const originalMediaDevices = navigator.mediaDevices

  const mockTrackStop = vi.fn()
  const mockStream = {
    getTracks: () => [{ stop: mockTrackStop }]
  } as unknown as MediaStream

  const mockGetUserMedia = vi.fn()

  beforeAll(() => {
    globalThis.MediaRecorder = MockMediaRecorder as unknown as typeof MediaRecorder
    globalThis.FileReader = MockFileReader as unknown as typeof FileReader
  })

  beforeEach(() => {
    sessionStorage.clear()
    MockMediaRecorder.instances = []
    mockTrackStop.mockReset()
    mockGetUserMedia.mockReset()

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia
      },
      configurable: true
    })

    globalThis.alert = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(() => {
    globalThis.MediaRecorder = originalMediaRecorder
    globalThis.FileReader = originalFileReader
    globalThis.alert = originalAlert

    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true
    })
  })

  it('should render the microphone button when no saved recording exists', () => {
    renderRecorder()

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(document.querySelector('.record-icon')).toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('should load and display a saved recording from sessionStorage for the active segment', () => {
    const key = getSegmentKey(TEST_VIDEO_ID, TEST_START, TEST_END)
    sessionStorage.setItem(key, 'data:audio/webm;base64,abc123')

    renderRecorder()

    const audio = document.querySelector('audio')
    expect(audio).toBeInTheDocument()
    expect(audio).toHaveAttribute('src', 'data:audio/webm;base64,abc123')
    expect(document.querySelector('.recorder-delete-btn')).toBeInTheDocument()
  })

  it('should not load a recording saved for a different segment key', () => {
    const otherKey = getSegmentKey(TEST_VIDEO_ID, TEST_START, TEST_END + 1)
    sessionStorage.setItem(otherKey, 'data:audio/webm;base64,other')

    renderRecorder()

    expect(document.querySelector('audio')).not.toBeInTheDocument()
    expect(document.querySelector('.record-icon')).toBeInTheDocument()
  })

  it('should delete an existing recording from sessionStorage and reset UI', async () => {
    const { user } = renderRecorder()
    const key = getSegmentKey(TEST_VIDEO_ID, TEST_START, TEST_END)
    sessionStorage.setItem(key, 'data:audio/webm;base64,abc123')

    // Re-render with saved recording visible
    renderRecorder()

    const deleteButton = document.querySelector(
      '.recorder-delete-btn'
    ) as HTMLButtonElement
    expect(deleteButton).toBeInTheDocument()

    await user.click(deleteButton)

    expect(sessionStorage.getItem(key)).toBeNull()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
    expect(document.querySelector('.record-icon')).toBeInTheDocument()
  })

  it('should swap saved audio when segment props change', () => {
    const firstKey = getSegmentKey(TEST_VIDEO_ID, 10, 14)
    const secondKey = getSegmentKey(TEST_VIDEO_ID, 14, 18)

    sessionStorage.setItem(firstKey, 'data:audio/webm;base64,first')
    sessionStorage.setItem(secondKey, 'data:audio/webm;base64,second')

    const { rerender } = render(
      <Recorder videoId={TEST_VIDEO_ID} startSegment={10} endSegment={14} />
    )

    let audio = document.querySelector('audio')
    expect(audio).toBeInTheDocument()
    expect(audio).toHaveAttribute('src', 'data:audio/webm;base64,first')

    rerender(<Recorder videoId={TEST_VIDEO_ID} startSegment={14} endSegment={18} />)

    audio = document.querySelector('audio')
    expect(audio).toBeInTheDocument()
    expect(audio).toHaveAttribute('src', 'data:audio/webm;base64,second')
  })

  it('should start recording on microphone click after permission is granted', async () => {
    const { user } = renderRecorder()
    mockGetUserMedia.mockResolvedValueOnce(mockStream)

    await user.click(screen.getByRole('button'))

    expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(screen.getByText(/recording/i)).toBeInTheDocument()
    expect(MockMediaRecorder.instances).toHaveLength(1)
    expect(MockMediaRecorder.instances[0].start).toHaveBeenCalledTimes(1)
  })

  it('should stop recording, persist audio, and render playback controls', async () => {
    const { user } = renderRecorder()
    const key = getSegmentKey(TEST_VIDEO_ID, TEST_START, TEST_END)
    mockGetUserMedia.mockResolvedValueOnce(mockStream)

    await user.click(screen.getByRole('button'))
    
    const stopIcon = document.querySelector(
      '.recorder-popup .record-icon'
    ) as HTMLElement
    expect(stopIcon).toBeInTheDocument()

    await user.click(stopIcon)

    expect(sessionStorage.getItem(key)).toBe('data:audio/webm;base64,ZmFrZV9hdWRpbw==')
    expect(document.querySelector('audio')).toBeInTheDocument()
    expect(mockTrackStop).toHaveBeenCalled()
  })

  it('should show denied-permission alert when getUserMedia rejects', async () => {
    const { user } = renderRecorder()
    mockGetUserMedia.mockRejectedValueOnce(new Error('denied'))

    await user.click(screen.getByRole('button'))

    expect(console.error).toHaveBeenCalled()
    expect(globalThis.alert).toHaveBeenCalledWith(
      'Microphone access was denied. Please grant permission to record.'
    )
  })
})
