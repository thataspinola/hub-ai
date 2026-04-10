"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Trash2, GripVertical, Type, AlignLeft, TextCursorInput, ChevronDown, Circle, CheckSquare, ChevronUp, ChevronDownIcon, CreditCard, Award as IdCard, Building2, Phone, GitFork, ExternalLink, Zap, AlertTriangle, MapPin, UserRound, ShieldCheck, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFormStore, isFieldElement, isActionElement } from "@/lib/form-wizard/form-store"
import { Button } from "@/components/ui/button"
import type { FormElement, FormStep, ElementType, LibraryItem } from "@/lib/form-wizard/types"
import { DEPRECATED_ELEMENT_TYPES } from "@/lib/form-wizard/types"

import { PlansPreview } from "@/components/wizard-builder/plans-carousel"
import type { PlansConfig } from "@/lib/form-wizard/types"

const elementIcons: Record<string, React.ElementType> = {
  TITLE: Type,
  PARAGRAPH: AlignLeft,
  TEXT_INPUT: TextCursorInput,
  SELECT: ChevronDown,
  RADIO: Circle,
  CHECKBOX: CheckSquare,
  SUCCESS_SCREEN: AlertTriangle,
  GO_TO_CHECKOUT: AlertTriangle,
  CONDITIONAL_ROUTE: GitFork,
  NAVIGATION: ExternalLink,
  SERVICE_CALL: Zap,
  PLANS: CreditCard,
  CPF_INPUT: IdCard,
  CNPJ_INPUT: Building2,
  PHONE_INPUT: Phone,
  CEP_INPUT: MapPin,
  SOCIAL_NAME_INPUT: UserRound,
  PRIVACY_POLICY: ShieldCheck,
  EMAIL_INPUT: Mail,
}

const elementLabels: Record<string, string> = {
  TITLE: "Title",
  PARAGRAPH: "Paragraph",
  TEXT_INPUT: "Text Input",
  SELECT: "Select",
  RADIO: "Radio",
  CHECKBOX: "Checkbox",
  SUCCESS_SCREEN: "Success Screen (Deprecated)",
  GO_TO_CHECKOUT: "Go To Checkout (Deprecated)",
  CONDITIONAL_ROUTE: "Conditional Route",
  NAVIGATION: "Navigation",
  SERVICE_CALL: "Service Call",
  PLANS: "Plans",
  CPF_INPUT: "CPF",
  CNPJ_INPUT: "CNPJ",
  PHONE_INPUT: "Phone",
  CEP_INPUT: "CEP",
  SOCIAL_NAME_INPUT: "Nome Social",
  PRIVACY_POLICY: "Política de Privacidade",
  EMAIL_INPUT: "E-mail",
}

interface CanvasElementProps {
  element: FormElement
  stepId: string
  index: number
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
}

function CanvasElement({
  element,
  stepId: _stepId,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
}: CanvasElementProps) {
  const Icon = elementIcons[element.type]
  const isDeprecated = DEPRECATED_ELEMENT_TYPES.includes(element.type as (typeof DEPRECATED_ELEMENT_TYPES)[number])
  const isField = isFieldElement(element.type)
  const isPlan = element.type === "PLANS"
  const isAction = isActionElement(element.type)

  const getPreviewText = () => {
    const config = element.config as unknown as Record<string, unknown>
    if (element.type === "TITLE" || element.type === "PARAGRAPH") {
      return (config.text as string) || ""
    }
    if (isField) {
      return (config.label as string) || ""
    }
    if (element.type === "SUCCESS_SCREEN") {
      return "Deprecated - please remove"
    }
    if (element.type === "GO_TO_CHECKOUT") {
      return "Deprecated - please remove"
    }
    if (element.type === "PLANS") {
      return null
    }
    if (element.type === "CONDITIONAL_ROUTE") {
      const routeConfig = config as { label?: string; fieldName?: string; operator?: string; value?: string; targetStepSlug?: string }
      const label = routeConfig.label ? `[${routeConfig.label}] ` : ""
      if (routeConfig.fieldName && routeConfig.targetStepSlug) {
        const op = routeConfig.operator === "NOT_EQUALS" ? "!=" : "="
        return `${label}If ${routeConfig.fieldName} ${op} "${routeConfig.value}" → ${routeConfig.targetStepSlug}`
      }
      return `${label}Not configured`
    }
    if (element.type === "NAVIGATION") {
      const navConfig = config as { label?: string; url?: string }
      return navConfig.url ? `[${navConfig.label || "Navigate"}] → ${navConfig.url}` : `[${navConfig.label || "Navigate"}] Not configured`
    }
    if (element.type === "SERVICE_CALL") {
      const serviceConfig = config as { label?: string; service?: string; targetStepSlugOnSuccess?: string }
      const label = serviceConfig.label ? `[${serviceConfig.label}] ` : ""
      if (serviceConfig.service && serviceConfig.targetStepSlugOnSuccess) {
        return `${label}${serviceConfig.service} → ${serviceConfig.targetStepSlugOnSuccess}`
      }
      return `${label}${serviceConfig.service || "Not configured"}`
    }
    return ""
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className={cn(
        "group relative flex items-center gap-3 rounded-md border bg-background p-2.5 transition-all",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/40",
        isDeprecated && "border-amber-500/50 bg-amber-500/5 opacity-70",
        isPlan && "border-amber-500/50 bg-amber-500/5",
        isAction && !isDeprecated && "border-violet-500/50 bg-violet-500/5",
        "cursor-pointer",
      )}
    >
      <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded",
          isDeprecated ? "bg-amber-500/20 text-amber-600" : "bg-muted text-muted-foreground",
          isPlan && "bg-amber-500/20 text-amber-600",
          isAction && !isDeprecated && "bg-violet-500/20 text-violet-600",
        )}
      >
        {Icon && <Icon className="h-3.5 w-3.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none">{elementLabels[element.type]}</p>
        {getPreviewText() && <p className="mt-0.5 truncate text-xs text-muted-foreground">{getPreviewText()}</p>}
        {isPlan && (
          <div className="mt-2">
            <PlansPreview
              plans={(element.config as PlansConfig).plans || []}
              title={(element.config as PlansConfig).title}
            />
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  )
}

interface StepCardProps {
  step: FormStep
  stepNumber: number
  totalSteps: number
  isSelected: boolean
  selectedElementId: string | null
  onSelectStep: () => void
  onSelectElement: (elementId: string) => void
  onDeleteElement: (elementId: string) => void
  onMoveStep: (direction: "up" | "down") => void
  onDeleteStep: () => void
  canAddElement: (stepId: string, elementType: ElementType) => { allowed: boolean; reason?: string }
  onDrop: (e: React.DragEvent, stepId: string) => void
}

function StepCard({
  step,
  stepNumber,
  totalSteps,
  isSelected,
  selectedElementId,
  onSelectStep,
  onSelectElement,
  onDeleteElement,
  onMoveStep,
  onDeleteStep,
  canAddElement: _canAddElement,
  onDrop,
}: StepCardProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const reorderElements = useFormStore((s) => s.reorderElements)

  const handleElementDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({
          type: "canvas",
          sourceStepId: step.id,
          sourceIndex: index,
        }),
      )
      e.dataTransfer.effectAllowed = "move"
    },
    [step.id],
  )

  const handleElementDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverIndex(index)
  }, [])

  const handleElementDragEnd = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleStepDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))

        if (data.type === "canvas" && data.sourceStepId === step.id && dragOverIndex !== null) {
          reorderElements(step.id, data.sourceIndex, dragOverIndex)
        } else {
          onDrop(e, step.id)
        }
      } catch {
        onDrop(e, step.id)
      }

      setDragOverIndex(null)
    },
    [step.id, dragOverIndex, reorderElements, onDrop],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div
      onClick={onSelectStep}
      onDrop={handleStepDrop}
      onDragOver={handleDragOver}
      className={cn(
        "rounded-lg border-2 bg-card transition-all",
        isSelected ? "border-primary shadow-sm" : "border-border hover:border-muted-foreground/40",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b",
          isSelected ? "bg-primary/5" : "bg-muted/30",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground",
            )}
          >
            {stepNumber}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{step.name}</h3>
            <p className="text-xs text-muted-foreground">/{step.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onMoveStep("up")
            }}
            disabled={stepNumber === 1}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onMoveStep("down")
            }}
            disabled={stepNumber === totalSteps}
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteStep()
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-3 min-h-[80px]">
        {step.elements.length === 0 ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-md border-2 border-dashed py-6 text-sm text-muted-foreground transition-colors",
              dragOverIndex !== null ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOverIndex(0)
            }}
            onDragLeave={() => setDragOverIndex(null)}
          >
            Drag elements here
          </div>
        ) : (
          <div className="space-y-1.5">
            {step.elements.map((element, index) => (
              <CanvasElement
                key={element.id}
                element={element}
                stepId={step.id}
                index={index}
                isSelected={element.id === selectedElementId}
                onSelect={() => onSelectElement(element.id)}
                onDelete={() => onDeleteElement(element.id)}
                onDragStart={handleElementDragStart}
                onDragOver={handleElementDragOver}
                onDragEnd={handleElementDragEnd}
              />
            ))}

            <div
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDragOverIndex(step.elements.length)
              }}
              onDragLeave={() => setDragOverIndex(null)}
              className={cn(
                "rounded-md border-2 border-dashed py-2 text-center text-xs text-muted-foreground transition-colors",
                dragOverIndex === step.elements.length ? "border-primary bg-primary/5" : "border-transparent",
              )}
            >
              Drop to add
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function StepCanvas() {
  const form = useFormStore((s) => s.form)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const selectedElementId = useFormStore((s) => s.selectedElementId)
  const selectStep = useFormStore((s) => s.selectStep)
  const selectElement = useFormStore((s) => s.selectElement)
  const addElement = useFormStore((s) => s.addElement)
  const addStep = useFormStore((s) => s.addStep)
  const deleteElement = useFormStore((s) => s.deleteElement)
  const deleteStep = useFormStore((s) => s.deleteStep)
  const reorderSteps = useFormStore((s) => s.reorderSteps)
  const canAddElement = useFormStore((s) => s.canAddElement)

  const sortedSteps = [...form.steps].sort((a, b) => a.order - b.order)

  const handleMoveStep = useCallback(
    (stepIndex: number, direction: "up" | "down") => {
      const newIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1
      if (newIndex >= 0 && newIndex < form.steps.length) {
        reorderSteps(stepIndex, newIndex)
      }
    },
    [form.steps.length, reorderSteps],
  )

  const handleStepDrop = useCallback(
    (e: React.DragEvent, stepId: string) => {
      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))

        if (data.type === "library") {
          const item = data.item as LibraryItem
          if (item.type === "STEP") {
            return
          }
          const { allowed } = canAddElement(stepId, item.type as ElementType)
          if (allowed) {
            addElement(stepId, item.type as ElementType)
          }
        }
      } catch {
        // Invalid drag data
      }
    },
    [addElement, canAddElement],
  )

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"))
        if (data.type === "library" && data.item?.type === "STEP") {
          addStep()
        }
      } catch {
        // Invalid drag data
      }
    },
    [addStep],
  )

  return (
    <div className="flex flex-1 flex-col bg-muted/20" onDrop={handleCanvasDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between border-b bg-background px-6 py-3">
        <div>
          <h2 className="font-semibold">Wizard Steps</h2>
          <p className="text-xs text-muted-foreground">
            {form.steps.length} step{form.steps.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={addStep}>
          Add Step
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {sortedSteps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              stepNumber={index + 1}
              totalSteps={sortedSteps.length}
              isSelected={step.id === selectedStepId}
              selectedElementId={selectedElementId}
              onSelectStep={() => selectStep(step.id)}
              onSelectElement={selectElement}
              onDeleteElement={(elementId) => deleteElement(step.id, elementId)}
              onMoveStep={(direction) => handleMoveStep(index, direction)}
              onDeleteStep={() => deleteStep(step.id)}
              canAddElement={canAddElement}
              onDrop={handleStepDrop}
            />
          ))}

          {sortedSteps.length > 0 && (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="h-8 w-px bg-border" />
              <button
                onClick={() => addStep()}
                className="rounded-full border-2 border-dashed border-muted-foreground/30 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                + Add another step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
