"use client"

import type React from "react"

import { useState } from "react"
import { Layers, Type, AlignLeft, TextCursorInput, ChevronDown, Circle, CheckSquare, GripVertical, ChevronRight, CreditCard, Award as IdCard, Building2, Phone, GitFork, ExternalLink, Zap, MapPin, UserRound, ShieldCheck, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { libraryItems, categoryLabels } from "@/lib/form-wizard/library-items"
import { useFormStore } from "@/lib/form-wizard/form-store"
import type { LibraryItem, ElementType } from "@/lib/form-wizard/types"

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Type,
  AlignLeft,
  TextCursorInput,
  ChevronDown,
  Circle,
  CheckSquare,
  CreditCard,
  IdCard,
  Building2,
  Phone,
  GitFork,
  ExternalLink,
  Zap,
  MapPin,
  UserRound,
  ShieldCheck,
  Mail,
}

interface DraggableItemProps {
  item: LibraryItem
  disabled?: boolean
  disabledReason?: string
}

function DraggableItem({ item, disabled, disabledReason }: DraggableItemProps) {
  const Icon = iconMap[item.icon]
  const addStep = useFormStore((s) => s.addStep)
  const addElement = useFormStore((s) => s.addElement)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const form = useFormStore((s) => s.form)

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "library", item }))
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleClick = () => {
    if (disabled) return

    if (item.type === "STEP") {
      addStep()
    } else if (selectedStepId) {
      addElement(selectedStepId, item.type as ElementType)
    } else if (form.steps.length > 0) {
      addElement(form.steps[form.steps.length - 1].id, item.type as ElementType)
    }
  }

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onClick={handleClick}
      title={disabled ? disabledReason : `Click or drag to add ${item.label}`}
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm transition-all",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-grab hover:border-primary hover:bg-secondary active:cursor-grabbing",
      )}
    >
      <GripVertical className="h-3 w-3 text-muted-foreground" />
      {Icon && <Icon className="h-4 w-4" />}
      <span className="font-medium">{item.label}</span>
    </div>
  )
}

export function ComponentLibrary() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["structure", "content", "fields", "special-fields", "plans", "actions"]),
  )
  const canAddElement = useFormStore((s) => s.canAddElement)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const form = useFormStore((s) => s.form)

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const categories = ["structure", "content", "fields", "special-fields", "plans", "actions"]

  const getItemDisabledState = (item: LibraryItem) => {
    if (item.type === "STEP") return { disabled: false }

    const targetStepId = selectedStepId || form.steps[form.steps.length - 1]?.id
    if (!targetStepId) return { disabled: true, reason: "No step available" }

    const check = canAddElement(targetStepId, item.type as ElementType)
    return { disabled: !check.allowed, reason: check.reason }
  }

  return (
    <div className="flex h-full flex-col border-r bg-sidebar">
      <div className="border-b p-4">
        <h2 className="font-semibold text-sidebar-foreground">Components</h2>
        <p className="mt-1 text-xs text-muted-foreground">Drag or click to add</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {categories.map((category) => {
          const items = libraryItems.filter((i) => i.category === category)
          const isExpanded = expandedCategories.has(category)

          return (
            <div key={category} className="mb-3">
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center gap-1 rounded px-1 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:bg-secondary"
              >
                <ChevronRight className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-90")} />
                {categoryLabels[category]}
              </button>
              {isExpanded && (
                <div className="mt-2 space-y-1.5 pl-1">
                  {items.map((item) => {
                    const { disabled, reason } = getItemDisabledState(item)
                    return <DraggableItem key={item.type} item={item} disabled={disabled} disabledReason={reason} />
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
