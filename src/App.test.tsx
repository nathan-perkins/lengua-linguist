import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

vi.mock('./components/VideoWindow', () => ({
  default: () => <div>Video player loaded</div>
}))

function renderApp() {
  const queryClient = new QueryClient()

  return {
    user: userEvent.setup(),
    ...render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )
  }
}

async function searchVideo(user: ReturnType<typeof userEvent.setup>, query: string) {
  const inputElement = screen.getByLabelText(/explore target language videos/i)
  await user.type(inputElement, query)

  const submitButton = screen.getByRole('button')
  await user.click(submitButton)
}

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should return video options when user submits searchQuery', async () => {
    const { user } = renderApp()

    await searchVideo(user, 'kriiispy')

    expect(await screen.findByRole('button', { name: /nu disciples/i })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /gods timing/i })).toBeInTheDocument()
  })

  it('should render VideoWindow with the correct video when user selects an option', async () => {
    const { user } = renderApp()

    await searchVideo(user, 'kriiispy')

    const selectedOption = screen.getByRole('button', { name: /nu disciples/i })
    await user.click(selectedOption)

    expect(await screen.findByText(/video player loaded/i)).toBeInTheDocument()
    
    expect(screen.queryByLabelText(/explore target language videos/i)).not.toBeInTheDocument()

    const saved = localStorage.getItem('PREVIOUS_VIDEO')
    expect(saved).toBeTruthy()

    const parsed = JSON.parse(saved as string)
    expect(parsed.id.videoId).toBe('pG0zn5Hvse8')
    expect(parsed.snippet.title).toBe('Nu Disciples')
  })
})
