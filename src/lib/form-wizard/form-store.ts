'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Form,
  FormStep,
  FormElement,
  ElementType,
  ElementConfig,
  Plan,
} from './types'
import { DEPRECATED_ELEMENT_TYPES } from './types'
import { saveForm, getFormsIndex, generateFormSlug } from './forms-storage'

const generateId = () => Math.random().toString(36).substring(2, 11)

const generateSlug = (name: string, existingSlugs: string[]): string => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60)

  let slug = baseSlug || 'step'
  let counter = 1

  while (existingSlugs.includes(slug)) {
    const suffix = `-${counter}`
    slug = `${baseSlug.substring(0, 60 - suffix.length)}${suffix}`
    counter++
  }

  return slug
}

export const validateSlug = (
  slug: string
): { valid: boolean; error?: string } => {
  if (slug.length < 2)
    return { valid: false, error: 'Slug must be at least 2 characters' }

  if (slug.length > 60)
    return { valid: false, error: 'Slug must be 60 characters or less' }

  if (!/^[a-z0-9-]+$/.test(slug))
    return {
      valid: false,
      error: 'Only lowercase letters, numbers, and hyphens allowed',
    }

  if (slug.startsWith('-') || slug.endsWith('-'))
    return { valid: false, error: 'Slug cannot start or end with hyphen' }

  return { valid: true }
}

const generateDefaultPlan = (): Plan => ({
  id: generateId(),
  name: 'Basic Plan',
  description: 'Perfect for getting started',
  price: 29,
  currency: 'BRL',
  installments: 1,
  installmentPrice: 29,
  buttonText: 'Select Plan',
  highlighted: false,
  benefits: [
    { id: generateId(), text: 'Feature 1', included: true },
    { id: generateId(), text: 'Feature 2', included: true },
    { id: generateId(), text: 'Feature 3', included: false },
  ],
})

const generateFieldName = (type: ElementType, elementId: string): string => {
  const prefix = type.toLowerCase().replace(/_/g, '-')
  return `field_${prefix}_${elementId.substring(0, 6)}`
}

const getDefaultConfig = (
  type: ElementType,
  elementId: string
): ElementConfig => {
  switch (type) {
    case 'TITLE':
      return { text: 'New Title', size: 'lg' }
    case 'PARAGRAPH':
      return { text: 'Enter your paragraph text here.' }
    case 'TEXT_INPUT':
      return {
        label: 'Text Field',
        placeholder: 'Enter text...',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'SELECT':
      return {
        label: 'Select Field',
        required: false,
        options: [{ label: 'Option 1', value: 'option-1' }],
        name: generateFieldName(type, elementId),
      }
    case 'RADIO':
      return {
        label: 'Radio Field',
        required: false,
        options: [{ label: 'Option 1', value: 'option-1' }],
        name: generateFieldName(type, elementId),
      }
    case 'CHECKBOX':
      return {
        label: 'Checkbox Field',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'SUCCESS_SCREEN':
      return {
        title: 'Success!',
        message: 'Your form has been submitted successfully.',
      }
    case 'GO_TO_CHECKOUT':
      return { ctaText: 'Proceed to Checkout', checkoutUrl: '/checkout' }
    case 'PLANS':
      return {
        title: 'Choose Your Plan',
        name: generateFieldName(type, elementId),
        plans: [generateDefaultPlan()],
      }
    case 'CPF_INPUT':
      return {
        label: 'CPF',
        placeholder: '000.000.000-00',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'CNPJ_INPUT':
      return {
        label: 'CNPJ',
        placeholder: '00.000.000/0000-00',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'PHONE_INPUT':
      return {
        label: 'Phone',
        placeholder: '(00) 00000-0000',
        required: false,
        name: generateFieldName(type, elementId),
        allowInternational: false,
      }
    case 'CEP_INPUT':
      return {
        label: 'CEP',
        placeholder: '00000-000',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'SOCIAL_NAME_INPUT':
      return {
        label: 'Nome Social',
        placeholder: 'Digite o nome social...',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'PRIVACY_POLICY':
      return {
        label: 'Li e aceito a Política de Privacidade',
        required: false,
        name: generateFieldName(type, elementId),
        policyUrl: '',
      }
    case 'EMAIL_INPUT':
      return {
        label: 'E-mail',
        placeholder: 'exemplo@email.com',
        required: false,
        name: generateFieldName(type, elementId),
      }
    case 'CONDITIONAL_ROUTE':
      return {
        label: 'Continue',
        fieldName: '',
        operator: 'EQUALS',
        value: '',
        targetStepSlug: '',
        fallbackStepSlug: '',
      }
    case 'NAVIGATION':
      return { label: 'Navigate', url: '' }
    case 'SERVICE_CALL':
      return {
        label: 'Submit',
        service: 'eligibility',
        targetStepSlugOnSuccess: '',
      }
    default:
      return { text: 'Deprecated element' } as ElementConfig
  }
}

interface FormState {
  form: Form
  selectedStepId: string | null
  selectedElementId: string | null

  setFormName: (name: string) => void
  setFormSlug: (slug: string) => void
  addStep: () => void
  updateStep: (
    stepId: string,
    updates: Partial<Pick<FormStep, 'name' | 'slug' | 'backStepSlug'>>
  ) => void
  deleteStep: (stepId: string) => void
  reorderSteps: (fromIndex: number, toIndex: number) => void
  selectStep: (stepId: string | null) => void

  addElement: (stepId: string, type: ElementType, atIndex?: number) => void
  updateElement: (
    stepId: string,
    elementId: string,
    config: Partial<ElementConfig>
  ) => void
  deleteElement: (stepId: string, elementId: string) => void
  reorderElements: (stepId: string, fromIndex: number, toIndex: number) => void
  moveElementToStep: (
    fromStepId: string,
    toStepId: string,
    elementId: string,
    toIndex: number
  ) => void
  selectElement: (elementId: string | null) => void

  canAddElement: (
    stepId: string,
    elementType: ElementType
  ) => { allowed: boolean; reason?: string }
  getValidationErrors: () => string[]

  resetForm: () => void
  loadForm: (form: Form) => void
  saveFormToStorage: () => void
  exportForm: () => string
  importForm: (json: string) => boolean
}

const createDefaultForm = (): Form => {
  const id = generateId()
  const now = new Date().toISOString()
  return {
    id,
    name: 'New Form',
    slug: `form-${id.substring(0, 6)}`,
    steps: [
      {
        id: generateId(),
        name: 'Step 1',
        slug: 'step-1',
        order: 0,
        elements: [],
      },
    ],
    createdAt: now,
    updatedAt: now,
  }
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      form: createDefaultForm(),
      selectedStepId: null,
      selectedElementId: null,

      setFormName: (name) =>
        set((state) => ({
          form: { ...state.form, name },
        })),

      setFormSlug: (slug) =>
        set((state) => ({
          form: { ...state.form, slug },
        })),

      addStep: () =>
        set((state) => {
          const existingSlugs = state.form.steps.map((s) => s.slug)
          const newStep: FormStep = {
            id: generateId(),
            name: 'New Step',
            slug: generateSlug('new-step', existingSlugs),
            order: state.form.steps.length,
            elements: [],
          }
          return {
            form: {
              ...state.form,
              steps: [...state.form.steps, newStep],
            },
            selectedStepId: newStep.id,
          }
        }),

      updateStep: (stepId, updates) =>
        set((state) => {
          const steps = state.form.steps.map((step) => {
            if (step.id !== stepId) return step

            if (updates.slug) {
              const otherSlugs = state.form.steps
                .filter((s) => s.id !== stepId)
                .map((s) => s.slug)
              if (otherSlugs.includes(updates.slug)) {
                return step
              }
            }

            return { ...step, ...updates }
          })
          return { form: { ...state.form, steps } }
        }),

      deleteStep: (stepId) =>
        set((state) => {
          if (state.form.steps.length <= 1) return state

          const steps = state.form.steps
            .filter((s) => s.id !== stepId)
            .map((s, i) => ({ ...s, order: i }))

          return {
            form: { ...state.form, steps },
            selectedStepId:
              state.selectedStepId === stepId ? null : state.selectedStepId,
            selectedElementId: null,
          }
        }),

      reorderSteps: (fromIndex, toIndex) =>
        set((state) => {
          const steps = [...state.form.steps]
          const [moved] = steps.splice(fromIndex, 1)
          steps.splice(toIndex, 0, moved)

          return {
            form: {
              ...state.form,
              steps: steps.map((s, i) => ({ ...s, order: i })),
            },
          }
        }),

      selectStep: (stepId) =>
        set({ selectedStepId: stepId, selectedElementId: null }),

      addElement: (stepId, type, atIndex) =>
        set((state) => {
          const { allowed, reason } = get().canAddElement(stepId, type)
          if (!allowed) {
            console.warn('Cannot add element:', reason)
            return state
          }

          const elementId = generateId()

          const steps = state.form.steps.map((step) => {
            if (step.id !== stepId) return step

            const newElement: FormElement = {
              id: elementId,
              type,
              order: atIndex ?? step.elements.length,
              config: getDefaultConfig(type, elementId),
            }

            const elements = [...step.elements]
            if (atIndex !== undefined) {
              elements.splice(atIndex, 0, newElement)
            } else {
              elements.push(newElement)
            }

            return {
              ...step,
              elements: elements.map((e, i) => ({ ...e, order: i })),
            }
          })

          return { form: { ...state.form, steps } }
        }),

      updateElement: (stepId, elementId, config) =>
        set((state) => {
          const steps = state.form.steps.map((step) => {
            if (step.id !== stepId) return step
            return {
              ...step,
              elements: step.elements.map((el) =>
                el.id === elementId
                  ? { ...el, config: { ...el.config, ...config } }
                  : el
              ),
            }
          })
          return { form: { ...state.form, steps } }
        }),

      deleteElement: (stepId, elementId) =>
        set((state) => {
          const steps = state.form.steps.map((step) => {
            if (step.id !== stepId) return step
            return {
              ...step,
              elements: step.elements
                .filter((el) => el.id !== elementId)
                .map((el, i) => ({ ...el, order: i })),
            }
          })
          return {
            form: { ...state.form, steps },
            selectedElementId:
              state.selectedElementId === elementId
                ? null
                : state.selectedElementId,
          }
        }),

      reorderElements: (stepId, fromIndex, toIndex) =>
        set((state) => {
          const steps = state.form.steps.map((step) => {
            if (step.id !== stepId) return step
            const elements = [...step.elements]
            const [moved] = elements.splice(fromIndex, 1)
            elements.splice(toIndex, 0, moved)
            return {
              ...step,
              elements: elements.map((e, i) => ({ ...e, order: i })),
            }
          })
          return { form: { ...state.form, steps } }
        }),

      moveElementToStep: (fromStepId, toStepId, elementId, toIndex) =>
        set((state) => {
          const fromStep = state.form.steps.find((s) => s.id === fromStepId)
          const element = fromStep?.elements.find((e) => e.id === elementId)
          if (!element) return state

          const { allowed } = get().canAddElement(toStepId, element.type)
          if (!allowed) return state

          const steps = state.form.steps.map((step) => {
            if (step.id === fromStepId) {
              return {
                ...step,
                elements: step.elements
                  .filter((e) => e.id !== elementId)
                  .map((e, i) => ({ ...e, order: i })),
              }
            }
            if (step.id === toStepId) {
              const elements = [...step.elements]
              elements.splice(toIndex, 0, element)
              return {
                ...step,
                elements: elements.map((e, i) => ({ ...e, order: i })),
              }
            }
            return step
          })
          return { form: { ...state.form, steps } }
        }),

      selectElement: (elementId) => set({ selectedElementId: elementId }),

      canAddElement: (stepId, elementType) => {
        const state = get()
        const step = state.form.steps.find((s) => s.id === stepId)
        if (!step) return { allowed: false, reason: 'Step not found' }

        if (
          DEPRECATED_ELEMENT_TYPES.includes(
            elementType as (typeof DEPRECATED_ELEMENT_TYPES)[number]
          )
        ) {
          return { allowed: false, reason: 'This element type is deprecated' }
        }

        if (isActionElement(elementType)) {
          return { allowed: true }
        }

        return { allowed: true }
      },

      getValidationErrors: () => {
        const state = get()
        const errors: string[] = []

        const deprecatedElements: { stepName: string; elementType: string }[] =
          []
        state.form.steps.forEach((step) => {
          step.elements.forEach((el) => {
            if (
              DEPRECATED_ELEMENT_TYPES.includes(
                el.type as (typeof DEPRECATED_ELEMENT_TYPES)[number]
              )
            ) {
              deprecatedElements.push({
                stepName: step.name,
                elementType: el.type,
              })
            }
          })
        })
        if (deprecatedElements.length > 0) {
          deprecatedElements.forEach(({ stepName, elementType }) => {
            errors.push(
              `Step "${stepName}" contains deprecated element "${elementType}". Please replace it with the new Actions (Navigation, Conditional Route, or Service Call).`
            )
          })
        }

        state.form.steps.forEach((step) => {
          if (step.stepType === 'BRANCH') {
            errors.push(
              `Step "${step.name}" uses the deprecated Branch Step type. All steps are now regular steps.`
            )
          }
        })

        state.form.steps.forEach((step) => {
          const hasActions = step.elements.some((el) =>
            isActionElement(el.type)
          )
          const hasDeprecatedActions = step.elements.some((el) =>
            isFinalizationElement(el.type)
          )
          if (!hasActions && !hasDeprecatedActions) {
            errors.push(
              `Step "${step.name}" has no actions. Add a Navigation, Conditional Route, or Service Call action so users can proceed.`
            )
          }
        })

        state.form.steps.forEach((step) => {
          const validation = validateSlug(step.slug)
          if (!validation.valid) {
            errors.push(`Step "${step.name}": ${validation.error}`)
          }
        })

        const slugs = state.form.steps.map((s) => s.slug)
        const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i)
        if (duplicates.length > 0) {
          errors.push(
            `Duplicate slugs found: ${[...new Set(duplicates)].join(', ')}`
          )
        }

        return errors
      },

      resetForm: () =>
        set({
          form: createDefaultForm(),
          selectedStepId: null,
          selectedElementId: null,
        }),

      loadForm: (form) => {
        return set({
          form,
          selectedStepId: null,
          selectedElementId: null,
        })
      },

      saveFormToStorage: () => {
        const state = get()
        saveForm(state.form)
      },

      exportForm: () => JSON.stringify(get().form, null, 2),

      importForm: (json) => {
        try {
          const form = JSON.parse(json) as Form
          if (!form.id || !form.steps || !Array.isArray(form.steps)) {
            return false
          }

          if (!form.slug) {
            const index = getFormsIndex()
            const existingSlugs = index.map((f) => f.slug)
            form.slug = generateFormSlug(form.name, existingSlugs)
          }

          set({ form, selectedStepId: null, selectedElementId: null })
          return true
        } catch {
          return false
        }
      },
    }),
    {
      name: 'form-wizard-builder',
    }
  )
)

export const isFinalizationElement = (type: ElementType): boolean => {
  return type === 'SUCCESS_SCREEN' || type === 'GO_TO_CHECKOUT'
}

export const isFieldElement = (type: ElementType): boolean => {
  return [
    'TEXT_INPUT',
    'SELECT',
    'RADIO',
    'CHECKBOX',
    'PLANS',
    'CPF_INPUT',
    'CNPJ_INPUT',
    'PHONE_INPUT',
    'CEP_INPUT',
    'SOCIAL_NAME_INPUT',
    'PRIVACY_POLICY',
    'EMAIL_INPUT',
  ].includes(type)
}

export const isActionElement = (type: ElementType): boolean => {
  return ['CONDITIONAL_ROUTE', 'NAVIGATION', 'SERVICE_CALL'].includes(type)
}
