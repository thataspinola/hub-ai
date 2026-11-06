"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type {
  Condition,
  ConditionAction,
  ConditionActionFieldError,
  ConditionActionNotify,
  ConditionActionRedirect,
  ConditionCheck,
  ConditionOperand,
  ConditionOperandLiteral,
  ConditionOperandLiteralValue,
  ConditionOperandRef,
  ConditionOperator,
  ConditionSource,
} from "@/lib/form-wizard/types"

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
  { value: "EQUAL", label: "== (EQUAL)" },
  { value: "NOT_EQUAL", label: "!= (NOT_EQUAL)" },
  { value: "GREATER_THAN", label: "> (GREATER_THAN)" },
  { value: "GREATER_THAN_OR_EQUAL", label: ">= (GREATER_THAN_OR_EQUAL)" },
  { value: "LESS_THAN", label: "< (LESS_THAN)" },
  { value: "LESS_THAN_OR_EQUAL", label: "<= (LESS_THAN_OR_EQUAL)" },
  { value: "INCLUDES", label: "INCLUDES" },
  { value: "EXISTS", label: "EXISTS" },
  { value: "NOT_EXISTS", label: "NOT_EXISTS" },
]

const SOURCE_OPTIONS: { value: ConditionSource; label: string }[] = [
  { value: "fields", label: "fields" },
  { value: "parameters", label: "parameters" },
  { value: "services", label: "services" },
  { value: "business", label: "business" },
]

const UNARY_OPERATORS: ConditionOperator[] = ["EXISTS", "NOT_EXISTS"]

function isRefOperand(operand: ConditionOperand): operand is ConditionOperandRef {
  return typeof (operand as ConditionOperandRef).from === "string"
}

function coerceLiteralValue(raw: string, type: "string" | "number" | "boolean"): ConditionOperandLiteralValue {
  if (type === "number") {
    const parsed = Number(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  if (type === "boolean") return raw === "true"
  return raw
}

function inferLiteralType(value: ConditionOperandLiteralValue): "string" | "number" | "boolean" {
  if (typeof value === "number") return "number"
  if (typeof value === "boolean") return "boolean"
  return "string"
}

interface OperandEditorProps {
  operand: ConditionOperand
  onChange: (operand: ConditionOperand) => void
  labelPrefix: string
}

function OperandEditor({ operand, onChange, labelPrefix }: OperandEditorProps) {
  const isRef = isRefOperand(operand)
  const literal = !isRef ? (operand as ConditionOperandLiteral) : null
  const literalType = literal ? inferLiteralType(literal.value) : "string"

  return (
    <div className="rounded-md border p-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{labelPrefix}</Label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onChange({ from: "fields", path: "" })}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-medium",
              isRef ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            Referência
          </button>
          <button
            type="button"
            onClick={() => onChange({ value: "" })}
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-medium",
              !isRef ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            Literal
          </button>
        </div>
      </div>

      {isRef && (
        <div className="grid grid-cols-3 gap-1.5">
          <Select
            value={(operand as ConditionOperandRef).from}
            onValueChange={(value) =>
              onChange({ ...(operand as ConditionOperandRef), from: value as ConditionSource })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="col-span-2 h-8 text-xs"
            placeholder="path (ex.: age)"
            value={(operand as ConditionOperandRef).path}
            onChange={(e) => onChange({ ...(operand as ConditionOperandRef), path: e.target.value })}
          />
        </div>
      )}

      {!isRef && literal && (
        <div className="grid grid-cols-3 gap-1.5">
          <Select
            value={literalType}
            onValueChange={(newType) => {
              onChange({ value: coerceLiteralValue(String(literal.value ?? ""), newType as "string" | "number" | "boolean") })
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">string</SelectItem>
              <SelectItem value="number">number</SelectItem>
              <SelectItem value="boolean">boolean</SelectItem>
            </SelectContent>
          </Select>
          {literalType === "boolean" ? (
            <Select
              value={String(literal.value)}
              onValueChange={(v) => onChange({ value: v === "true" })}
            >
              <SelectTrigger className="col-span-2 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">true</SelectItem>
                <SelectItem value="false">false</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="col-span-2 h-8 text-xs"
              type={literalType === "number" ? "number" : "text"}
              placeholder="valor"
              value={String(literal.value ?? "")}
              onChange={(e) => onChange({ value: coerceLiteralValue(e.target.value, literalType) })}
            />
          )}
        </div>
      )}
    </div>
  )
}

interface CheckEditorProps {
  check: ConditionCheck
  onChange: (check: ConditionCheck) => void
  onRemove: () => void
  canRemove: boolean
}

function CheckEditor({ check, onChange, onRemove, canRemove }: CheckEditorProps) {
  const isUnary = UNARY_OPERATORS.includes(check.op)

  return (
    <div className="rounded-md border bg-muted/30 p-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Check</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={onRemove}
          disabled={!canRemove}
          title="Remove check"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <OperandEditor
        labelPrefix="Left"
        operand={check.left}
        onChange={(left) => onChange({ ...check, left })}
      />
      <div>
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Operador</Label>
        <Select value={check.op} onValueChange={(v) => onChange({ ...check, op: v as ConditionOperator })}>
          <SelectTrigger className="mt-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPERATOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {!isUnary && (
        <OperandEditor
          labelPrefix="Right"
          operand={check.right ?? { value: "" }}
          onChange={(right) => onChange({ ...check, right })}
        />
      )}
    </div>
  )
}

interface ActionEditorProps {
  action: ConditionAction
  onChange: (action: ConditionAction) => void
  availableFields: { name: string; label: string }[]
  availableStepSlugs: { slug: string; name: string }[]
}

function ActionEditor({ action, onChange, availableFields, availableStepSlugs }: ActionEditorProps) {
  const handleKindChange = (kind: ConditionAction["kind"]) => {
    if (kind === action.kind) return
    if (kind === "notify") {
      onChange({ kind: "notify", title: "", description: "" })
    } else if (kind === "fieldError") {
      onChange({ kind: "fieldError", field: availableFields[0]?.name ?? "", message: "", focus: true })
    } else {
      onChange({ kind: "redirect", url: "" })
    }
  }

  return (
    <div className="rounded-md border p-2 space-y-2">
      <div>
        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Ação</Label>
        <Select value={action.kind} onValueChange={(v) => handleKindChange(v as ConditionAction["kind"])}>
          <SelectTrigger className="mt-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="notify">notify (popup)</SelectItem>
            <SelectItem value="fieldError">fieldError (destacar campo)</SelectItem>
            <SelectItem value="redirect">redirect (navegar)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {action.kind === "notify" && (
        <NotifyActionFields action={action} onChange={onChange} />
      )}
      {action.kind === "fieldError" && (
        <FieldErrorActionFields action={action} onChange={onChange} availableFields={availableFields} />
      )}
      {action.kind === "redirect" && (
        <RedirectActionFields action={action} onChange={onChange} availableStepSlugs={availableStepSlugs} />
      )}
    </div>
  )
}

function NotifyActionFields({
  action,
  onChange,
}: {
  action: ConditionActionNotify
  onChange: (action: ConditionAction) => void
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          className="mt-1 h-8 text-xs"
          value={action.title}
          onChange={(e) => onChange({ ...action, title: e.target.value })}
        />
      </div>
      <div>
        <Label className="text-xs">Description</Label>
        <Textarea
          className="mt-1 text-xs"
          rows={2}
          value={action.description}
          onChange={(e) => onChange({ ...action, description: e.target.value })}
          placeholder="Suporta placeholders {{fields.age}}"
        />
      </div>
      <div>
        <Label className="text-xs">Action button label (opcional)</Label>
        <Input
          className="mt-1 h-8 text-xs"
          value={action.actionButton?.children ?? ""}
          onChange={(e) =>
            onChange({
              ...action,
              actionButton: e.target.value ? { children: e.target.value } : undefined,
            })
          }
        />
      </div>
    </div>
  )
}

function FieldErrorActionFields({
  action,
  onChange,
  availableFields,
}: {
  action: ConditionActionFieldError
  onChange: (action: ConditionAction) => void
  availableFields: { name: string; label: string }[]
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-xs">Campo</Label>
        {availableFields.length === 0 ? (
          <Input
            className="mt-1 h-8 text-xs"
            placeholder="nome do campo"
            value={action.field}
            onChange={(e) => onChange({ ...action, field: e.target.value })}
          />
        ) : (
          <Select value={action.field} onValueChange={(v) => onChange({ ...action, field: v })}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue placeholder="Selecione um campo" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                  {f.label} ({f.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div>
        <Label className="text-xs">Mensagem</Label>
        <Textarea
          className="mt-1 text-xs"
          rows={2}
          value={action.message}
          onChange={(e) => onChange({ ...action, message: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs">Focar campo</Label>
        <Switch
          checked={action.focus ?? false}
          onCheckedChange={(checked) => onChange({ ...action, focus: checked })}
        />
      </div>
    </div>
  )
}

function RedirectActionFields({
  action,
  onChange,
  availableStepSlugs,
}: {
  action: ConditionActionRedirect
  onChange: (action: ConditionAction) => void
  availableStepSlugs: { slug: string; name: string }[]
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-xs">URL / slug</Label>
        <Input
          className="mt-1 h-8 text-xs"
          value={action.url}
          onChange={(e) => onChange({ ...action, url: e.target.value })}
          placeholder="/nao-elegivel ou https://..."
        />
      </div>
      {availableStepSlugs.length > 0 && (
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Ou selecione um step
          </Label>
          <Select value="" onValueChange={(v) => onChange({ ...action, url: `/${v}` })}>
            <SelectTrigger className="mt-1 h-8 text-xs">
              <SelectValue placeholder="Preencher URL a partir de um step" />
            </SelectTrigger>
            <SelectContent>
              {availableStepSlugs.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name} — /{s.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

interface ConditionsEditorProps {
  value: Condition[] | undefined
  onChange: (conditions: Condition[]) => void
  availableFields: { name: string; label: string }[]
  availableStepSlugs: { slug: string; name: string }[]
}

export function ConditionsEditor({
  value,
  onChange,
  availableFields,
  availableStepSlugs,
}: ConditionsEditorProps) {
  const conditions = value ?? []
  const [expandedIndex, setExpandedIndex] = useState<number | null>(conditions.length > 0 ? 0 : null)

  const addCondition = () => {
    const next: Condition = {
      checks: [
        {
          left: { from: "fields", path: "" },
          op: "EQUAL",
          right: { value: "" },
        },
      ],
      action: { kind: "notify", title: "", description: "" },
    }
    const updated = [...conditions, next]
    onChange(updated)
    setExpandedIndex(updated.length - 1)
  }

  const updateCondition = (index: number, patch: Partial<Condition>) => {
    const updated = conditions.map((c, i) => (i === index ? { ...c, ...patch } : c))
    onChange(updated)
  }

  const removeCondition = (index: number) => {
    const updated = conditions.filter((_, i) => i !== index)
    onChange(updated)
    if (expandedIndex === index) setExpandedIndex(null)
  }

  const addCheck = (index: number) => {
    const current = conditions[index]
    updateCondition(index, {
      checks: [
        ...current.checks,
        { left: { from: "fields", path: "" }, op: "EQUAL", right: { value: "" } },
      ],
    })
  }

  const updateCheck = (condIdx: number, checkIdx: number, check: ConditionCheck) => {
    const current = conditions[condIdx]
    updateCondition(condIdx, {
      checks: current.checks.map((c, i) => (i === checkIdx ? check : c)),
    })
  }

  const removeCheck = (condIdx: number, checkIdx: number) => {
    const current = conditions[condIdx]
    if (current.checks.length <= 1) return
    updateCondition(condIdx, {
      checks: current.checks.filter((_, i) => i !== checkIdx),
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Conditions ({conditions.length})</Label>
        <Button variant="outline" size="sm" onClick={addCondition} className="h-7 text-xs">
          <Plus className="mr-1 h-3 w-3" />
          Adicionar regra
        </Button>
      </div>

      {conditions.length === 0 && (
        <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
          Nenhuma regra. As regras bloqueiam a ação se algum check bater.
        </p>
      )}

      {conditions.map((condition, index) => {
        const isExpanded = expandedIndex === index
        return (
          <div key={index} className="rounded-md border">
            <button
              type="button"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="flex w-full items-center justify-between p-2 text-left"
            >
              <div className="flex items-center gap-1.5">
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                <span className="text-xs font-medium">
                  Regra {index + 1}
                  {condition.id ? ` — ${condition.id}` : ""}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({condition.checks.length} check{condition.checks.length === 1 ? "" : "s"} → {condition.action.kind})
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeCondition(index)
                }}
                className="rounded p-1 text-destructive hover:bg-destructive/10"
                title="Remove rule"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>

            {isExpanded && (
              <div className="border-t p-2 space-y-2">
                <div>
                  <Label className="text-xs">Id (opcional)</Label>
                  <Input
                    className="mt-1 h-8 text-xs"
                    value={condition.id ?? ""}
                    onChange={(e) =>
                      updateCondition(index, { id: e.target.value || undefined })
                    }
                    placeholder="ex.: max-age-insurance"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Checks (AND)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => addCheck(index)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Check
                    </Button>
                  </div>
                  {condition.checks.map((check, ci) => (
                    <CheckEditor
                      key={ci}
                      check={check}
                      onChange={(next) => updateCheck(index, ci, next)}
                      onRemove={() => removeCheck(index, ci)}
                      canRemove={condition.checks.length > 1}
                    />
                  ))}
                </div>

                <ActionEditor
                  action={condition.action}
                  onChange={(action) => updateCondition(index, { action })}
                  availableFields={availableFields}
                  availableStepSlugs={availableStepSlugs}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
