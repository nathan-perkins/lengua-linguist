import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders headline', () => {
    render(<App />)

    // screen.debug()

    expect(screen.getByText(/Lengua/i)).toBeInTheDocument()
  })
})
