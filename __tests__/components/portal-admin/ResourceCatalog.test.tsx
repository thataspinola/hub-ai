import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CodeReviewerPage from '@/app/code-reviewer/page'

describe('Code Reviewer integration', () => {
  it('links to the standalone reviewer without embedding skills or installer', () => {
    render(<CodeReviewerPage />)
    expect(screen.getByRole('heading', { name: 'Code Reviewer' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Abrir Code Reviewer Plug and Play' })
    ).toHaveAttribute(
      'href',
      'https://github.com/thataspinola/code-reviewer-plug-and-play'
    )
    expect(screen.getByText(/Nenhuma skill é instalada neste painel/)).toBeInTheDocument()
  })
})
