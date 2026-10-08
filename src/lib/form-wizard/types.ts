// Form Wizard Builder Types

export type ElementType =
  | "TITLE"
  | "PARAGRAPH"
  | "TEXT_INPUT"
  | "SELECT"
  | "RADIO"
  | "CHECKBOX"
  | "SUCCESS_SCREEN" // @deprecated - kept for backwards compatibility
  | "GO_TO_CHECKOUT" // @deprecated - kept for backwards compatibility
  | "CONDITIONAL_ROUTE"
  | "NAVIGATION"
  | "SERVICE_CALL"
  | "PLANS"
  | "CPF_INPUT"
  | "CNPJ_INPUT"
  | "PHONE_INPUT"
  | "CEP_INPUT"
  | "SOCIAL_NAME_INPUT"
  | "PRIVACY_POLICY"
  | "EMAIL_INPUT"

export type ServiceType = "eligibility" | "cotation" | "proposal" | "simulation"

export interface SelectOption {
  label: string
  value: string
}

export interface TitleConfig {
  text: string
  size?: "sm" | "md" | "lg" | "xl"
}

export interface ParagraphConfig {
  text: string
}

export interface TextInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface SelectConfig {
  label: string
  required: boolean
  options: SelectOption[]
  name?: string
}

export interface RadioConfig {
  label: string
  required: boolean
  options: SelectOption[]
  name?: string
}

export interface CheckboxConfig {
  label: string
  required: boolean
  name?: string
}

export interface CPFInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface CNPJInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface PhoneInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
  allowInternational?: boolean
}

export interface CEPInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface SocialNameInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface PrivacyPolicyConfig {
  label: string
  required: boolean
  name?: string
  policyUrl?: string
}

export interface EmailInputConfig {
  label: string
  placeholder: string
  required: boolean
  name?: string
}

export interface SuccessScreenConfig {
  title: string
  message: string
}

export interface GoToCheckoutConfig {
  ctaText: string
  checkoutUrl: string
}

export interface NavigationConfig {
  label: string
  url: string
}

export type ConditionalOperator = "EQUALS" | "NOT_EQUALS"

export interface ConditionalRouteConfig {
  label: string
  fieldName: string
  operator: ConditionalOperator
  value: string
  targetStepSlug: string
  fallbackStepSlug: string
}

export interface PlanBenefit {
  id: string
  text: string
  included: boolean
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  installments?: number
  installmentPrice?: number
  buttonText: string
  highlighted?: boolean
  benefits: PlanBenefit[]
}

export interface PlansConfig {
  title: string
  name?: string
  plans: Plan[]
}

export interface ServiceCallConfig {
  label: string
  service: ServiceType
  targetStepSlugOnSuccess: string
}

export type ElementConfig =
  | TitleConfig
  | ParagraphConfig
  | TextInputConfig
  | SelectConfig
  | RadioConfig
  | CheckboxConfig
  | SuccessScreenConfig
  | GoToCheckoutConfig
  | ConditionalRouteConfig
  | NavigationConfig
  | ServiceCallConfig
  | PlansConfig
  | CPFInputConfig
  | CNPJInputConfig
  | PhoneInputConfig
  | CEPInputConfig
  | SocialNameInputConfig
  | PrivacyPolicyConfig
  | EmailInputConfig

export interface FormElement {
  id: string
  type: ElementType
  order: number
  config: ElementConfig
}

export interface FormStep {
  id: string
  name: string
  slug: string
  order: number
  backStepSlug?: string
  stepType?: string // @deprecated
  elements: FormElement[]
}

export interface FormCompletion {
  type: "FINAL_SUCCESS" | "FINAL_HANDOFF_CHECKOUT"
}

export interface Form {
  id: string
  name: string
  slug: string
  completion?: FormCompletion // @deprecated
  steps: FormStep[]
  createdAt: string
  updatedAt: string
}

export interface FormResponses {
  values: Record<string, unknown>
  currentStepSlug: string
  updatedAt: string
}

export interface FormIndexEntry {
  id: string
  name: string
  slug: string
  updatedAt: string
  stepsCount: number
}

export interface LibraryItem {
  type: ElementType | "STEP"
  label: string
  category: "structure" | "content" | "fields" | "special-fields" | "plans" | "actions"
  icon: string
}

// Deprecated element types that may exist in old forms
export const DEPRECATED_ELEMENT_TYPES = ["SUCCESS_SCREEN", "GO_TO_CHECKOUT"] as const

// Drag and drop types
export interface DragItem {
  type: "library" | "canvas"
  item: LibraryItem | FormElement
  sourceStepId?: string
  sourceIndex?: number
}
