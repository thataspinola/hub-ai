import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import CodeReviewerPage from '@/app/code-reviewer/page'

describe('Code Reviewer integration', () => {
  it('renders the independent reviewer link and informational catalog', () => {
    render(<CodeReviewerPage />)
    expect(screen.getByRole('heading', { name: 'Code Reviewer' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Catálogo de capacidades' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Abrir Code Reviewer Plug and Play' })).toHaveAttribute(
      'href',
      'https://github.com/thataspinola/code-reviewer-plug-and-play'
    )
    expect(screen.getByText(/Nenhuma skill é instalada neste painel/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('5 capacidade(s) encontrada(s)')
  })

  it('filters capabilities by category and search', () => {
    render(<CodeReviewerPage />)
    fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'Backend' } })
    expect(screen.getByRole('status')).toHaveTextContent('1 capacidade(s) encontrada(s)')
    expect(screen.getByRole('heading', { name: 'Revisão backend' })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Buscar capacidades'), { target: { value: 'sem resultado' } })
    expect(screen.getByRole('status')).toHaveTextContent('0 capacidade(s) encontrada(s)')
    expect(screen.getByText('Nenhuma capacidade corresponde aos filtros.')).toBeInTheDocument()
  })
})
