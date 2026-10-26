'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Plan } from '@/lib/form-wizard/types'

interface PlansCarouselProps {
  plans: Plan[]
  selectedPlanId?: string
  onSelect: (planId: string) => void
  title?: string
  className?: string
}

export function PlansCarousel({
  plans,
  selectedPlanId,
  onSelect,
  title,
  className,
}: PlansCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)

    const cardWidth = el.firstElementChild?.clientWidth || 280
    const gap = 16
    const newIndex = Math.round(el.scrollLeft / (cardWidth + gap))
    setCurrentIndex(Math.min(newIndex, plans.length - 1))
  }, [plans.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    const cardWidth = el.firstElementChild?.clientWidth || 280
    const gap = 16
    const scrollAmount = cardWidth + gap

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€' }
    return `${symbols[currency] || currency} ${price.toFixed(2)}`
  }

  return (
    <div className={cn('space-y-4', className)}>
      {title && <h2 className="text-xl font-bold">{title}</h2>}

      <div className="relative">
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full shadow-lg md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full shadow-lg md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide snap-x snap-mandatory md:snap-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={cn(
                'flex-shrink-0 w-[280px] md:w-[300px] rounded-xl border-2 p-5 text-left transition-all snap-center',
                selectedPlanId === plan.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/40',
                plan.highlighted &&
                  !selectedPlanId &&
                  'ring-2 ring-amber-500/30 border-amber-500/50'
              )}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {plan.description}
              </p>

              <div className="mb-4">
                <span className="text-2xl font-bold">
                  {formatPrice(plan.price, plan.currency)}
                </span>
                {plan.installments && plan.installments > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    or {plan.installments}x of{' '}
                    {formatPrice(
                      plan.installmentPrice || plan.price / plan.installments,
                      plan.currency
                    )}
                  </p>
                )}
              </div>

              {plan.benefits.length > 0 && (
                <ul className="space-y-2">
                  {plan.benefits.slice(0, 5).map((benefit) => (
                    <li
                      key={benefit.id}
                      className={cn(
                        'flex items-start gap-2 text-sm',
                        benefit.included
                          ? 'text-foreground'
                          : 'text-muted-foreground line-through'
                      )}
                    >
                      {benefit.included ? (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                      ) : (
                        <span className="h-4 w-4 mt-0.5 flex-shrink-0 rounded-full border" />
                      )}
                      <span className="line-clamp-2">{benefit.text}</span>
                    </li>
                  ))}
                  {plan.benefits.length > 5 && (
                    <li className="text-xs text-muted-foreground pl-6">
                      +{plan.benefits.length - 5} more benefits
                    </li>
                  )}
                </ul>
              )}

              <div
                className={cn(
                  'mt-4 rounded-lg py-2.5 text-center text-sm font-medium transition-colors',
                  selectedPlanId === plan.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {selectedPlanId === plan.id
                  ? 'Selected'
                  : plan.buttonText || 'Select Plan'}
              </div>
            </button>
          ))}
        </div>

        {plans.length > 1 && (
          <div className="flex justify-center gap-2 pt-2 md:hidden">
            {plans.map((plan, index) => (
              <button
                key={plan.id}
                onClick={() => {
                  const el = scrollRef.current
                  if (!el) return
                  const cardWidth = el.firstElementChild?.clientWidth || 280
                  const gap = 16
                  el.scrollTo({
                    left: index * (cardWidth + gap),
                    behavior: 'smooth',
                  })
                }}
                className={cn(
                  'h-2 rounded-full transition-all',
                  currentIndex === index
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted-foreground/30'
                )}
                aria-label={`Go to plan ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function PlansPreview({
  plans,
  title,
}: {
  plans: Plan[]
  title?: string
}) {
  const formatPrice = (price: number, currency: string) => {
    const symbols: Record<string, string> = { BRL: 'R$', USD: '$', EUR: '€' }
    return `${symbols[currency] || currency} ${price.toFixed(2)}`
  }

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'flex-shrink-0 rounded-md border px-2 py-1.5 text-[10px]',
              plan.highlighted && 'border-amber-500/50 bg-amber-500/5'
            )}
          >
            <span className="font-medium">{plan.name}</span>
            <span className="ml-1.5 text-muted-foreground">
              {formatPrice(plan.price, plan.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
