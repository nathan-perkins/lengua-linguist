import { useState, type SubmitEventHandler } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QueryForm from './QueryForm'

function MockQueryForm({ handleQuery }: { handleQuery: SubmitEventHandler<HTMLFormElement> }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <QueryForm
      handleQuery={handleQuery}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  )
}

describe('QueryForm', () => {
  it('should update the input value and submit the form', async () => {
    const user = userEvent.setup()
    const handleQuery = vi.fn<SubmitEventHandler<HTMLFormElement>>(e => {
      e.preventDefault()
    })

    render(<MockQueryForm handleQuery={handleQuery} />)

    const inputElement = screen.getByLabelText(/explore target language videos/i)
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveValue('')

    await user.type(inputElement, 'kriiispy')
    expect(inputElement).toHaveValue('kriiispy')

    await user.keyboard('{Enter}')
    expect(handleQuery).toHaveBeenCalledTimes(1)
  })
})
