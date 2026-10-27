'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type {
  CPFInputConfig,
  CNPJInputConfig,
  PhoneInputConfig,
  CEPInputConfig,
  SocialNameInputConfig,
  PrivacyPolicyConfig,
  EmailInputConfig,
} from '@/lib/form-wizard/types'

export function CPFInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CPFInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cpf-label">Label</Label>
        <Input
          id="cpf-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cpf-placeholder">Placeholder</Label>
        <Input
          id="cpf-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cpf-required">Required</Label>
        <Switch
          id="cpf-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 000.000.000-00
        <br />
        Includes automatic validation
      </div>
    </div>
  )
}

export function CNPJInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CNPJInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cnpj-label">Label</Label>
        <Input
          id="cnpj-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cnpj-placeholder">Placeholder</Label>
        <Input
          id="cnpj-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cnpj-required">Required</Label>
        <Switch
          id="cnpj-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 00.000.000/0000-00
        <br />
        Includes automatic validation
      </div>
    </div>
  )
}

export function PhoneInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PhoneInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="phone-label">Label</Label>
        <Input
          id="phone-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="phone-placeholder">Placeholder</Label>
        <Input
          id="phone-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="phone-required">Required</Label>
        <Switch
          id="phone-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="phone-international">Allow International</Label>
        <Switch
          id="phone-international"
          checked={config.allowInternational || false}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { allowInternational: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: (00) 00000-0000
        <br />
        Supports mobile and landline
      </div>
    </div>
  )
}

export function CEPInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: CEPInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="cep-label">Label</Label>
        <Input
          id="cep-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cep-placeholder">Placeholder</Label>
        <Input
          id="cep-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="cep-required">Required</Label>
        <Switch
          id="cep-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Format: 00000-000
        <br />
        Includes automatic mask
      </div>
    </div>
  )
}

export function SocialNameInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: SocialNameInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="social-name-label">Label</Label>
        <Input
          id="social-name-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="social-name-placeholder">Placeholder</Label>
        <Input
          id="social-name-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="social-name-required">Required</Label>
        <Switch
          id="social-name-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
    </div>
  )
}

export function PrivacyPolicyProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: PrivacyPolicyConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="privacy-label">Label</Label>
        <Input
          id="privacy-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="privacy-url">Policy URL</Label>
        <Input
          id="privacy-url"
          value={config.policyUrl || ''}
          onChange={(e) =>
            updateElement(stepId, elementId, { policyUrl: e.target.value })
          }
          placeholder="https://..."
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="privacy-required">Required</Label>
        <Switch
          id="privacy-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Renders as a checkbox with a link to the privacy policy
      </div>
    </div>
  )
}

export function EmailInputProperties({
  stepId,
  elementId,
  config,
}: {
  stepId: string
  elementId: string
  config: EmailInputConfig
}) {
  const updateElement = useFormStore((s) => s.updateElement)

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="email-label">Label</Label>
        <Input
          id="email-label"
          value={config.label}
          onChange={(e) =>
            updateElement(stepId, elementId, { label: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email-placeholder">Placeholder</Label>
        <Input
          id="email-placeholder"
          value={config.placeholder}
          onChange={(e) =>
            updateElement(stepId, elementId, { placeholder: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="email-required">Required</Label>
        <Switch
          id="email-required"
          checked={config.required}
          onCheckedChange={(checked) =>
            updateElement(stepId, elementId, { required: checked })
          }
        />
      </div>
      <div className="rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
        Includes e-mail format validation
      </div>
    </div>
  )
}
