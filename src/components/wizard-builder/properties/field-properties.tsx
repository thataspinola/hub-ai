'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Trash2, Plus } from 'lucide-react'
import type {
  TextInputConfig,
  SelectConfig,
  RadioConfig,
  CheckboxConfig,
  SelectOptionConfig,
} from '@/lib/form-wizard/types'

export function TextInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: TextInputConfig
}) {
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="input-label">Label</Label>

        <Input
          id="input-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, {
              label: e.target.value,
            })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="input-placeholder">Placeholder</Label>

        <Input
          id="input-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, {
              placeholder: e.target.value,
            })
          }
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="input-required">Required</Label>

        <Switch
          id="input-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, {
              required: checked,
            })
          }
        />
      </div>
    </div>
  )
}

export function OptionsEditor({
  options,
  onChange,
}: {
  options: SelectOptionConfig[]
  onChange: (options: SelectOptionConfig[]) => void
}) {
  const addOption = () => {
    const newIndex = options.length + 1

    onChange([
      ...options,
      { label: `Option ${newIndex}`, value: `option-${newIndex}` },
    ])
  }

  const updateOption = (
    index: number,
    field: 'label' | 'value',
    value: string
  ) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    onChange(newOptions)
  }

  const removeOptions = (index: number) => {
    if (options.length <= 1) return
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <Label>Options</Label>

      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Label"
            value={option.label}
            onChange={(e) => updateOption(index, 'label', e.target.value)}
            className="flex-1"
          />

          <Input
            placeholder="Value"
            value={option.value}
            onChange={(e) => updateOption(index, 'value', e.target.value)}
            className="flex-1"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeOptions(index)}
            disabled={options.length <= 1}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={addOption}
        className="mr-1 h-3 w-3"
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Option
      </Button>
    </div>
  )
}

export function SelectProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: SelectConfig
}) {
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="select-label">Label</Label>

        <Input
          id="select-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="select-required">Required</Label>

        <Switch
          id="select-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>

      <OptionsEditor
        options={config.options}
        onChange={(options) => updateElement(stepId, elementId, { options })}
      />
    </div>
  )
}

export function RadioProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: RadioConfig
}) {
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="radio-label">Label</Label>

        <Input
          id="radio-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="radio-required">Required</Label>

        <Switch
          id="radio-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>

      <OptionsEditor
        options={config.options}
        onChange={(options) => updateElement(stepId, elementId, { options })}
      />
    </div>
  )
}

export function CheckboxProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CheckboxConfig
}) {
  const updateElement = useFormStore((state) => state.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="checkbox-label">Label</Label>

        <Input
          id="checkbox-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="checkbox-required">Required</Label>

        <Switch
          id="checkbox-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
    </div>
  )
}
