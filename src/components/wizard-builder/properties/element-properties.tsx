'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type {
  TitleConfig,
  ParagraphConfig,
  TextInputConfig,
  SelectConfig,
  RadioConfig,
  CheckboxConfig,
  ConditionalRouteConfig,
  NavigationConfig,
  ServiceCallConfig,
  PlansConfig,
  CPFInputConfig,
  CNPJInputConfig,
  PhoneInputConfig,
  CEPInputConfig,
  SocialNameInputConfig,
  PrivacyPolicyConfig,
  EmailInputConfig,
} from '@/lib/form-wizard/types'
import { TitleProperties, ParagraphProperties } from './content-properties'
import {
  TextInputProperties,
  SelectProperties,
  RadioProperties,
  CheckboxProperties,
} from './field-properties'
import {
  CPFInputProperties,
  CNPJInputProperties,
  PhoneInputProperties,
  CEPInputProperties,
  SocialNameInputProperties,
  PrivacyPolicyProperties,
  EmailInputProperties,
} from './document-properties'
import {
  DeprecatedElementNotice,
  NavigationProperties,
  ServiceCallProperties,
  ConditionalRouteProperties,
} from './action-properties'
import { PlansProperties } from './plans-properties'

export function ElementProperties() {
  const form = useFormStore((s) => s.form)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const selectedElementId = useFormStore((s) => s.selectedElementId)
  const deleteElement = useFormStore((s) => s.deleteElement)

  if (!selectedStepId || !selectedElementId) return null

  const step = form.steps.find((s) => s.id === selectedStepId)
  const element = step?.elements.find((e) => e.id === selectedElementId)

  if (!element) return null

  const elementTypeLabels: Record<string, string> = {
    TITLE: 'Title',
    PARAGRAPH: 'Paragraph',
    TEXT_INPUT: 'Text Input',
    SELECT: 'Select',
    RADIO: 'Radio',
    CHECKBOX: 'Checkbox',
    SUCCESS_SCREEN: 'Success Screen (Deprecated)',
    GO_TO_CHECKOUT: 'Go to Checkout (Deprecated)',
    CONDITIONAL_ROUTE: 'Conditional Route',
    NAVIGATION: 'Navigation',
    SERVICE_CALL: 'Service Call',
    PLANS: 'Plans',
    CPF_INPUT: 'CPF Input',
    CNPJ_INPUT: 'CNPJ Input',
    PHONE_INPUT: 'Phone Input',
    CEP_INPUT: 'CEP Input',
    SOCIAL_NAME_INPUT: 'Social Name Input',
    PRIVACY_POLICY: 'Privacy Policy',
    EMAIL_INPUT: 'Email Input',
  }

  const renderProperties = () => {
    switch (element.type) {
      case 'TITLE':
        return (
          <TitleProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as TitleConfig}
          />
        )
      case 'PARAGRAPH':
        return (
          <ParagraphProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as ParagraphConfig}
          />
        )
      case 'TEXT_INPUT':
        return (
          <TextInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as TextInputConfig}
          />
        )
      case 'SELECT':
        return (
          <SelectProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as SelectConfig}
          />
        )
      case 'RADIO':
        return (
          <RadioProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as RadioConfig}
          />
        )
      case 'CHECKBOX':
        return (
          <CheckboxProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as CheckboxConfig}
          />
        )
      case 'SUCCESS_SCREEN':
        return <DeprecatedElementNotice elementType="Success Screen" />
      case 'GO_TO_CHECKOUT':
        return <DeprecatedElementNotice elementType="Go to Checkout" />
      case 'CONDITIONAL_ROUTE':
        return (
          <ConditionalRouteProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as ConditionalRouteConfig}
          />
        )
      case 'NAVIGATION':
        return (
          <NavigationProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as NavigationConfig}
          />
        )
      case 'SERVICE_CALL':
        return (
          <ServiceCallProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as ServiceCallConfig}
          />
        )
      case 'PLANS':
        return (
          <PlansProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as PlansConfig}
          />
        )
      case 'CPF_INPUT':
        return (
          <CPFInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as CPFInputConfig}
          />
        )
      case 'CNPJ_INPUT':
        return (
          <CNPJInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as CNPJInputConfig}
          />
        )
      case 'PHONE_INPUT':
        return (
          <PhoneInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as PhoneInputConfig}
          />
        )
      case 'CEP_INPUT':
        return (
          <CEPInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as CEPInputConfig}
          />
        )
      case 'SOCIAL_NAME_INPUT':
        return (
          <SocialNameInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as SocialNameInputConfig}
          />
        )
      case 'PRIVACY_POLICY':
        return (
          <PrivacyPolicyProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as PrivacyPolicyConfig}
          />
        )
      case 'EMAIL_INPUT':
        return (
          <EmailInputProperties
            stepId={selectedStepId}
            elementId={selectedElementId}
            config={element.config as EmailInputConfig}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{elementTypeLabels[element.type]}</h3>

        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </div>

      {renderProperties()}
    </div>
  )
}
