/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import type { Plan } from '@/lib/form-wizard/types'

import {
  PlansCarousel,
  PlansPreview,
} from '@/components/wizard-builder/plans-carousel'

const makePlan = (overrides: Partial<Plan> = {}): Plan => ({
  id: 'plan-1',
  name: 'Basic Plan',
  description: 'A basic plan',
  price: 29.99,
  currency: 'BRL',
  buttonText: 'Select Plan',
  highlighted: false,
  benefits: [],
  ...overrides,
})

const PLANS: Plan[] = [
  makePlan({ id: 'plan-1', name: 'Basic', price: 29.99 }),
  makePlan({
    id: 'plan-2',
    name: 'Pro',
    price: 99.9,
    currency: 'BRL',
    highlighted: true,
    buttonText: 'Get Pro',
    benefits: [
      { id: 'b1', text: 'Feature A', included: true },
      { id: 'b2', text: 'Feature B', included: false },
    ],
  }),
  makePlan({ id: 'plan-3', name: 'Enterprise', price: 299.0 }),
]

describe('PlansCarousel', () => {
  it('renders plan names', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(
      <PlansCarousel plans={PLANS} title="Choose a Plan" onSelect={jest.fn()} />
    )

    expect(screen.getByText('Choose a Plan')).toBeInTheDocument()
  })

  it('does not render title when omitted', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  })

  it('renders plan prices in BRL format', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    expect(screen.getByText('R$ 29.99')).toBeInTheDocument()
  })

  it('renders Recommended badge for highlighted plan', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    expect(screen.getByText('Recommended')).toBeInTheDocument()
  })

  it('calls onSelect with plan id on click', () => {
    const onSelect = jest.fn()
    render(<PlansCarousel plans={PLANS} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Basic').closest('button')!)
    expect(onSelect).toHaveBeenCalledWith('plan-1')
  })

  it('shows Selected label for selected plan', () => {
    render(
      <PlansCarousel
        plans={PLANS}
        selectedPlanId="plan-1"
        onSelect={jest.fn()}
      />
    )

    expect(screen.getByText('Selected')).toBeInTheDocument()
  })

  it('renders plan benefits', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    expect(screen.getByText('Feature A')).toBeInTheDocument()
    expect(screen.getByText('Feature B')).toBeInTheDocument()
  })

  it('renders installments info when provided', () => {
    const plan = makePlan({
      id: 'p1',
      name: 'Installment Plan',
      price: 120.0,
      installments: 12,
      installmentPrice: 10.0,
    })

    render(<PlansCarousel plans={[plan]} onSelect={jest.fn()} />)
    expect(screen.getByText(/12x of/i)).toBeInTheDocument()
  })

  it('renders more benefits indicator when > 5 benefits', () => {
    const plan = makePlan({
      id: 'p1',
      name: 'Rich Plan',
      price: 99.0,
      benefits: Array.from({ length: 7 }, (_, i) => ({
        id: `b${i}`,
        text: `Benefit ${i + 1}`,
        included: true,
      })),
    })

    render(<PlansCarousel plans={[plan]} onSelect={jest.fn()} />)
    expect(screen.getByText('+2 more benefits')).toBeInTheDocument()
  })

  it('renders navigation dots for multiple plans', () => {
    render(<PlansCarousel plans={PLANS} onSelect={jest.fn()} />)
    // Navigation dots are aria-labeled
    const dots = screen.getAllByRole('button', { name: /Go to plan/i })
    expect(dots.length).toBe(3)
  })

  it('renders with USD currency', () => {
    const plan = makePlan({
      id: 'p1',
      name: 'USD Plan',
      price: 49.99,
      currency: 'USD',
    })

    render(<PlansCarousel plans={[plan]} onSelect={jest.fn()} />)
    expect(screen.getByText('$ 49.99')).toBeInTheDocument()
  })

  it('renders with EUR currency', () => {
    const plan = makePlan({
      id: 'p1',
      name: 'EUR Plan',
      price: 39.99,
      currency: 'EUR',
    })

    render(<PlansCarousel plans={[plan]} onSelect={jest.fn()} />)
    expect(screen.getByText('€ 39.99')).toBeInTheDocument()
  })

  it('renders with custom currency symbol fallback', () => {
    const plan = makePlan({
      id: 'p1',
      name: 'GBP Plan',
      price: 49.0,
      currency: 'GBP',
    })

    render(<PlansCarousel plans={[plan]} onSelect={jest.fn()} />)
    expect(screen.getByText('GBP 49.00')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <PlansCarousel plans={PLANS} onSelect={jest.fn()} className="my-custom" />
    )

    expect(container.firstChild).toHaveClass('my-custom')
  })
})

describe('PlansPreview', () => {
  it('renders plan names in preview mode', () => {
    render(<PlansPreview plans={PLANS} />)
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('renders preview title when provided', () => {
    render(<PlansPreview plans={PLANS} title="Available Plans" />)
    expect(screen.getByText('Available Plans')).toBeInTheDocument()
  })

  it('renders prices in preview', () => {
    render(
      <PlansPreview
        plans={[makePlan({ id: 'p1', name: 'Solo', price: 9.99 })]}
      />
    )

    expect(screen.getByText('R$ 9.99')).toBeInTheDocument()
  })
})
