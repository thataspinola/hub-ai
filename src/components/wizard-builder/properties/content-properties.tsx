'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TitleConfig, ParagraphConfig } from '@/lib/form-wizard/types'

export function TitleProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: TitleConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="title-text">Text</Label>
        <Textarea
          id="title-text"
          value={config.text}
          onChange={(e) =>
            updateElement(stepId, elementId, { text: e.target.value })
          }
          className="mt-1"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="title-size">Size</Label>
        <Select
          value={config.size || 'lg'}
          onValueChange={(value) =>
            updateElement(stepId, elementId, {
              size: value as TitleConfig['size'],
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function ParagraphProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: ParagraphConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div>
      <Label htmlFor="para-text">Text</Label>
      <Textarea
        id="para-text"
        value={config.text}
        onChange={(e) =>
          updateElement(stepId, elementId, { text: e.target.value })
        }
        className="mt-1"
        rows={4}
      />
    </div>
  )
}
