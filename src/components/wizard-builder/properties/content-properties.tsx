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
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="title-text">Title</Label>

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
            <SelectValue placeholder="Select size" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
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
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div>
      <div>
        <Label htmlFor="para-text">Paragraph</Label>

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
    </div>
  )
}
