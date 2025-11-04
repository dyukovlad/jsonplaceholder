import { render, screen } from '@testing-library/react'
import { Hello } from '../components/Hello'

describe('Hello', () => {
  it('renders with default name', () => {
    render(<Hello />)
    expect(screen.getByText('Привет, Friend!')).toBeInTheDocument()
  })

  it('renders with custom name', () => {
    render(<Hello name="World" />)
    expect(screen.getByText('Привет, World!')).toBeInTheDocument()
  })
})
