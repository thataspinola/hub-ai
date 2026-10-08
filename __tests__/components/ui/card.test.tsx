import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardContent>Card body</CardContent>
      </Card>
    )
    expect(screen.getByText('Card body')).toBeInTheDocument()
  })

  it('renders full card structure', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card data-testid="card" className="custom-class">Content</Card>)
    expect(screen.getByTestId('card').className).toContain('custom-class')
  })
})
