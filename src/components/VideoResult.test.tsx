import VideoResult from './VideoResult'
import type { VideoOption } from '../App'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const option: VideoOption = {
  id: { videoId: 'abc123' },
  snippet: {
    title: 'Selected Video',
    thumbnails: {
      medium: {
        url: 'www.exampleurl.com',
        width: 320,
        height: 180
      }
    },
    channelTitle: 'Kriiispy !',
    description: 'Mock description'
  }
}

describe('VideoResult', () => {
  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(<VideoResult option={option} onSelect={onSelect} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
