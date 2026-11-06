'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  X,
} from 'lucide-react'
import type { PlansConfig, Plan, PlanBenefit } from '@/lib/form-wizard/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function PlansProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PlansConfig
}) {
  const updateElement = useFormStore((state) => state.updateElement)

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(
    config.plans?.[0]?.id ?? null
  )

  const generateId = () => Math.random().toString(36).substring(2, 11)

  const addPlan = () => {
    const newPlan: Plan = {
      id: generateId(),
      name: `Plan ${config.plans.length + 1}`,
      description: 'Plan description',
      price: 49,
      currency: 'BRL',
      installments: 1,
      installmentPrice: 49,
      buttonText: 'Select Plan',
      highlighted: false,
      benefits: [{ id: generateId(), text: 'Feature 1', included: true }],
    }

    updateElement(stepId, elementId, { plans: [...config.plans, newPlan] })
    setExpandedPlanId(newPlan.id)
  }

  const updatePlan = (planId: string, updatedPlan: Partial<Plan>) => {
    const updatedPlans = config.plans.map((plan) =>
      plan.id === planId ? { ...plan, ...updatedPlan } : plan
    )

    updateElement(stepId, elementId, { plans: updatedPlans })
  }

  const deletePlan = (planId: string) => {
    if (config.plans.length <= 1) return
    const updatedPlans = config.plans.filter((plan) => plan.id !== planId)
    updateElement(stepId, elementId, { plans: updatedPlans })

    if (expandedPlanId === planId) {
      setExpandedPlanId(updatedPlans?.[0]?.id ?? null)
    }
  }

  const addBenefit = (planId: string) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan) return

    const newBenefit: PlanBenefit = {
      id: generateId(),
      text: 'New Benefit',
      included: true,
    }

    updatePlan(planId, { benefits: [...plan.benefits, newBenefit] })
  }

  const updateBenefit = (
    planId: string,
    benefitId: string,
    updatedBenefit: Partial<PlanBenefit>
  ) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan) return

    const updatedBenefits = plan.benefits.map((benefit) =>
      benefit.id === benefitId ? { ...benefit, ...updatedBenefit } : benefit
    )

    updatePlan(planId, { benefits: updatedBenefits })
  }

  const deleteBenefit = (planId: string, benefitId: string) => {
    const plan = config.plans.find((p) => p.id === planId)
    if (!plan) return

    const updatedBenefits = plan.benefits.filter(
      (benefit) => benefit.id !== benefitId
    )

    updatePlan(planId, { benefits: updatedBenefits })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="plans-title">Section Title</Label>

        <Input
          id="plans-title"
          value={config.title ?? ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { title: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Plans ({config.plans.length})</Label>

          <Button
            variant="outline"
            size="sm"
            onClick={addPlan}
            className="h-7 text-xs bg-transparent"
          >
            <Plus className="mr-1 h-3 w-4" /> Add Plan
          </Button>
        </div>

        <div className="space-y-2">
          {config.plans.map((plan, index) => {
            const isExpanded = expandedPlanId === plan.id

            return (
              <div
                key={plan.id}
                className={cn(
                  'rounded-md border transition-all',
                  isExpanded ? 'border-primary bg-primary/5' : 'border-border',
                  plan.highlighted && 'ring-1 ring-amber-500/50'
                )}
              >
                {/* Plan Header */}
                <button
                  type="button"
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}

                    <span className="font-medium text-sm">
                      Plan {index + 1}: {plan.name}
                    </span>

                    {plan.highlighted && (
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {plan.currency} {plan.price}
                  </span>
                </button>

                {/* Plan Details */}
                {isExpanded && (
                  <div className="border-t p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Name</Label>

                        <Input
                          value={plan.name}
                          onChange={(e) =>
                            updatePlan(plan.id, { name: e.target.value })
                          }
                          className="mt-1 h-8 text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Currency</Label>

                        <Select
                          value={plan.currency}
                          onValueChange={(value) =>
                            updatePlan(plan.id, { currency: value })
                          }
                        >
                          <SelectTrigger className="mt-1 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Description</Label>

                      <Textarea
                        value={plan.description}
                        onChange={(e) =>
                          updatePlan(plan.id, { description: e.target.value })
                        }
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Price</Label>

                        <Input
                          type="number"
                          value={plan.price}
                          onChange={(e) =>
                            updatePlan(plan.id, {
                              price: Number(e.target.value),
                            })
                          }
                          className="mt-1 h-8 text-sm"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Installments</Label>

                        <Input
                          type="number"
                          min={1}
                          max={12}
                          value={plan.installments || 1}
                          onChange={(e) => {
                            const installments = Number(e.target.value)

                            updatePlan(plan.id, {
                              installments,
                              installmentPrice: plan.price / installments,
                            })
                          }}
                          className="mt-1 h-8 text-sm"
                        />
                      </div>
                    </div>

                    {(plan.installments || 1) > 1 && (
                      <div className="rounded bg-muted/50 p-2 text-xs text-muted-foreground">
                        {plan.installments} x of {plan.currency}{' '}
                        {(plan.price / (plan.installments || 1)).toFixed(2)}
                      </div>
                    )}

                    <div>
                      <Label className="text-xs">Button Text</Label>

                      <Input
                        value={plan.buttonText}
                        onChange={(e) =>
                          updatePlan(plan.id, { buttonText: e.target.value })
                        }
                        className="mt-1 h-8 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Highlight this plan</Label>

                      <Switch
                        checked={plan.highlighted || false}
                        onCheckedChange={(checked) =>
                          updatePlan(plan.id, { highlighted: checked })
                        }
                      />
                    </div>

                    {/*Benefits*/}
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Benefits</Label>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBenefit(plan.id)}
                          className="h-6 text-sx-px-2"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Add Benefit
                        </Button>
                      </div>

                      <div className="space-y-1.5">
                        {plan.benefits?.map((benefit) => (
                          <div
                            key={benefit.id}
                            className="flex items-center gap-2"
                          >
                            <button
                              onClick={() =>
                                updateBenefit(plan.id, benefit.id, {
                                  included: !benefit.included,
                                })
                              }
                              className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded',
                                benefit.included
                                  ? 'bg-emerald-500/20 text-emerald-600'
                                  : 'bg-destructive/20 text-destructive'
                              )}
                            >
                              {benefit.included ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </button>

                            <Input
                              value={benefit.text}
                              onChange={(e) =>
                                updateBenefit(plan.id, benefit.id, {
                                  text: e.target.value,
                                })
                              }
                              className="h-7 text-xs flex-1"
                            />

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteBenefit(plan.id, benefit.id)}
                              disabled={plan.benefits.length <= 1}
                              className="h-6 tw-6"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/*Delete Plan*/}
                    {config.plans.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                        className="w-full text-destructive hover:text-destructive mt-2"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete Plan
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
