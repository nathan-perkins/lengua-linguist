import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

describe('App integration', () => {
  beforeEach(() => {
    const queryClient = new QueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
  })

  it('should return video options when user submits searchQuery', async () => {
    await searchVideo('kriiispy')

    expect(await screen.findByText('Nu Disciples')).toBeInTheDocument()
    expect(await screen.findByText('GODS TIMING')).toBeInTheDocument()
  })

  it('should render VideoWindow with the correct video when user selects an option', async () => {
    const user = userEvent.setup()

    await searchVideo('kriiispy')

    const videoOption = screen.getByRole('button', { name: /nu disciples/i })
    await user.click(videoOption)

    expect(videoOption).not.toBeInTheDocument()
  })
})

async function searchVideo(query: string) {
  const user = userEvent.setup()

  const inputElement = screen.getByLabelText(/explore target language videos/i)
  await user.type(inputElement, query)

  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
}
