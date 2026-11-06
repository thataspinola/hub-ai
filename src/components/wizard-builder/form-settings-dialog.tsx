"use client"

import { useEffect, useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFormStore } from "@/lib/form-wizard/form-store"
import type { FormPrefetch } from "@/lib/form-wizard/types"
import { cn } from "@/lib/utils"

function isEmptyPrefetch(p: FormPrefetch): boolean {
  return (
    !p.product &&
    !p.action &&
    !p.module &&
    (p.payload === undefined || Object.keys(p.payload).length === 0)
  )
}

export function FormSettingsDialog() {
  const form = useFormStore((s) => s.form)
  const setFormPrefetch = useFormStore((s) => s.setFormPrefetch)
  const [open, setOpen] = useState(false)

  const [product, setProduct] = useState(form.prefetch?.product ?? "")
  const [action, setAction] = useState(form.prefetch?.action ?? "")
  const [moduleValue, setModuleValue] = useState(form.prefetch?.module ?? "")
  const [payloadText, setPayloadText] = useState(() =>
    form.prefetch?.payload ? JSON.stringify(form.prefetch.payload, null, 2) : "",
  )
  const [payloadError, setPayloadError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setProduct(form.prefetch?.product ?? "")
    setAction(form.prefetch?.action ?? "")
    setModuleValue(form.prefetch?.module ?? "")
    setPayloadText(
      form.prefetch?.payload ? JSON.stringify(form.prefetch.payload, null, 2) : "",
    )
    setPayloadError(null)
  }, [open, form.prefetch])

  const commit = () => {
    let payload: Record<string, unknown> | undefined
    const trimmed = payloadText.trim()
    if (trimmed) {
      try {
        const parsed = JSON.parse(trimmed)
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          setPayloadError("Deve ser um objeto JSON")
          return
        }
        payload = parsed
      } catch (err) {
        setPayloadError((err as Error).message)
        return
      }
    }
    const next: FormPrefetch = {
      product: product || undefined,
      action: action || undefined,
      module: moduleValue || undefined,
      payload,
    }
    setFormPrefetch(isEmptyPrefetch(next) ? undefined : next)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-1 h-3 w-3" />
          Journey settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações da jornada</DialogTitle>
          <DialogDescription>
            `prefetch` é executado antes de renderizar o step. Ver{" "}
            <code>docs/journey.md</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Product</Label>
            <Input
              className="mt-1"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="ex.: consorcio"
            />
          </div>
          <div>
            <Label>Action</Label>
            <Input
              className="mt-1"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="ex.: simulate"
            />
          </div>
          <div>
            <Label>Module</Label>
            <Input
              className="mt-1"
              value={moduleValue}
              onChange={(e) => setModuleValue(e.target.value)}
              placeholder="ex.: financing"
            />
          </div>
          <div>
            <Label>Payload (JSON)</Label>
            <Textarea
              className={cn("mt-1 text-xs font-mono", payloadError && "border-destructive")}
              rows={6}
              value={payloadText}
              onChange={(e) => {
                setPayloadText(e.target.value)
                setPayloadError(null)
              }}
              placeholder='{"key": "value"}'
            />
            {payloadError && (
              <p className="mt-1 text-xs text-destructive">{payloadError}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={commit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
