import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />)
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
  })

  it('accepts type prop', () => {
    render(<Input type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
  })

  it('applies custom className', () => {
    render(<Input className="custom" data-testid="input" />)
    expect(screen.getByTestId('input').className).toContain('custom')
  })
})

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea placeholder="Message" />)
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Textarea className="custom" data-testid="ta" />)
    expect(screen.getByTestId('ta').className).toContain('custom')
  })
})

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Name</Label>)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('associates with input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="name-input">Name</Label>
        <Input id="name-input" />
      </>
    )
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })
})
