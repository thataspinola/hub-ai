import { act } from 'react'
import { useFormStore, validateSlug, isFinalizationElement, isFieldElement, isActionElement } from '@/lib/form-wizard/form-store'

beforeEach(() => {
  localStorage.clear()
  act(() => {
    useFormStore.getState().resetForm()
  })
})

describe('validateSlug', () => {
  it('accepts valid slug', () => {
    expect(validateSlug('my-slug')).toEqual({ valid: true })
  })

  it('rejects too short', () => {
    expect(validateSlug('a').valid).toBe(false)
  })

  it('rejects too long', () => {
    expect(validateSlug('a'.repeat(61)).valid).toBe(false)
  })

  it('rejects uppercase', () => {
    expect(validateSlug('My-Slug').valid).toBe(false)
  })

  it('rejects special characters', () => {
    expect(validateSlug('my_slug').valid).toBe(false)
  })

  it('rejects starting with hyphen', () => {
    expect(validateSlug('-slug').valid).toBe(false)
  })

  it('rejects ending with hyphen', () => {
    expect(validateSlug('slug-').valid).toBe(false)
  })
})

describe('isFinalizationElement', () => {
  it('returns true for SUCCESS_SCREEN', () => {
    expect(isFinalizationElement('SUCCESS_SCREEN')).toBe(true)
  })
  it('returns true for GO_TO_CHECKOUT', () => {
    expect(isFinalizationElement('GO_TO_CHECKOUT')).toBe(true)
  })
  it('returns false for other types', () => {
    expect(isFinalizationElement('TEXT_INPUT')).toBe(false)
    expect(isFinalizationElement('TITLE')).toBe(false)
  })
})

describe('isFieldElement', () => {
  it('returns true for field types', () => {
    expect(isFieldElement('TEXT_INPUT')).toBe(true)
    expect(isFieldElement('SELECT')).toBe(true)
    expect(isFieldElement('RADIO')).toBe(true)
    expect(isFieldElement('CHECKBOX')).toBe(true)
    expect(isFieldElement('PLANS')).toBe(true)
    expect(isFieldElement('CPF_INPUT')).toBe(true)
    expect(isFieldElement('CNPJ_INPUT')).toBe(true)
    expect(isFieldElement('PHONE_INPUT')).toBe(true)
  })
  it('returns false for non-field types', () => {
    expect(isFieldElement('TITLE')).toBe(false)
    expect(isFieldElement('NAVIGATION')).toBe(false)
  })
})

describe('isActionElement', () => {
  it('returns true for action types', () => {
    expect(isActionElement('CONDITIONAL_ROUTE')).toBe(true)
    expect(isActionElement('NAVIGATION')).toBe(true)
    expect(isActionElement('SERVICE_CALL')).toBe(true)
  })
  it('returns false for non-action types', () => {
    expect(isActionElement('TEXT_INPUT')).toBe(false)
    expect(isActionElement('PLANS')).toBe(false)
  })
})

describe('useFormStore', () => {
  it('has a default form', () => {
    const state = useFormStore.getState()
    expect(state.form).toBeDefined()
    expect(state.form.name).toBe('New Form')
    expect(state.form.steps).toHaveLength(1)
  })

  describe('setFormName', () => {
    it('updates form name', () => {
      act(() => { useFormStore.getState().setFormName('My Form') })
      expect(useFormStore.getState().form.name).toBe('My Form')
    })
  })

  describe('setFormSlug', () => {
    it('updates form slug', () => {
      act(() => { useFormStore.getState().setFormSlug('my-form') })
      expect(useFormStore.getState().form.slug).toBe('my-form')
    })
  })

  describe('addStep', () => {
    it('adds a new step', () => {
      act(() => { useFormStore.getState().addStep() })
      expect(useFormStore.getState().form.steps).toHaveLength(2)
    })

    it('sets selectedStepId to new step', () => {
      act(() => { useFormStore.getState().addStep() })
      const steps = useFormStore.getState().form.steps
      expect(useFormStore.getState().selectedStepId).toBe(steps[steps.length - 1].id)
    })
  })

  describe('updateStep', () => {
    it('updates step name', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().updateStep(stepId, { name: 'Updated' }) })
      expect(useFormStore.getState().form.steps[0].name).toBe('Updated')
    })

    it('does not allow duplicate slugs', () => {
      act(() => { useFormStore.getState().addStep() })
      const steps = useFormStore.getState().form.steps
      act(() => { useFormStore.getState().updateStep(steps[1].id, { slug: steps[0].slug }) })
      expect(useFormStore.getState().form.steps[1].slug).not.toBe(steps[0].slug)
    })
  })

  describe('deleteStep', () => {
    it('removes a step', () => {
      act(() => { useFormStore.getState().addStep() })
      const stepId = useFormStore.getState().form.steps[1].id
      act(() => { useFormStore.getState().deleteStep(stepId) })
      expect(useFormStore.getState().form.steps).toHaveLength(1)
    })

    it('does not delete the last step', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().deleteStep(stepId) })
      expect(useFormStore.getState().form.steps).toHaveLength(1)
    })

    it('clears selectedStepId if deleted', () => {
      act(() => { useFormStore.getState().addStep() })
      const stepId = useFormStore.getState().form.steps[1].id
      act(() => { useFormStore.getState().selectStep(stepId) })
      act(() => { useFormStore.getState().deleteStep(stepId) })
      expect(useFormStore.getState().selectedStepId).toBeNull()
    })
  })

  describe('reorderSteps', () => {
    it('moves step from one position to another', () => {
      act(() => { useFormStore.getState().addStep() })
      act(() => { useFormStore.getState().addStep() })
      const originalFirst = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().reorderSteps(0, 2) })
      expect(useFormStore.getState().form.steps[2].id).toBe(originalFirst)
    })
  })

  describe('selectStep / selectElement', () => {
    it('selects a step and clears element', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().selectStep(stepId) })
      expect(useFormStore.getState().selectedStepId).toBe(stepId)
      expect(useFormStore.getState().selectedElementId).toBeNull()
    })

    it('selects element', () => {
      act(() => { useFormStore.getState().selectElement('el-1') })
      expect(useFormStore.getState().selectedElementId).toBe('el-1')
    })
  })

  describe('addElement', () => {
    it('adds an element to a step', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TEXT_INPUT') })
      expect(useFormStore.getState().form.steps[0].elements).toHaveLength(1)
      expect(useFormStore.getState().form.steps[0].elements[0].type).toBe('TEXT_INPUT')
    })

    it('adds element at specific index', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TITLE') })
      act(() => { useFormStore.getState().addElement(stepId, 'PARAGRAPH', 0) })
      expect(useFormStore.getState().form.steps[0].elements[0].type).toBe('PARAGRAPH')
    })

    it('rejects deprecated element types', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'SUCCESS_SCREEN') })
      expect(useFormStore.getState().form.steps[0].elements).toHaveLength(0)
    })

    it('adds all standard element types with default config', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      const types = ['TITLE', 'PARAGRAPH', 'TEXT_INPUT', 'SELECT', 'RADIO', 'CHECKBOX', 'PLANS', 'CPF_INPUT', 'CNPJ_INPUT', 'PHONE_INPUT', 'NAVIGATION', 'CONDITIONAL_ROUTE', 'SERVICE_CALL'] as const
      types.forEach((type) => {
        act(() => { useFormStore.getState().addElement(stepId, type) })
      })
      expect(useFormStore.getState().form.steps[0].elements).toHaveLength(types.length)
    })
  })

  describe('updateElement', () => {
    it('updates element config', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TITLE') })
      const elId = useFormStore.getState().form.steps[0].elements[0].id
      act(() => { useFormStore.getState().updateElement(stepId, elId, { text: 'Hello' }) })
      expect((useFormStore.getState().form.steps[0].elements[0].config as { text: string }).text).toBe('Hello')
    })
  })

  describe('deleteElement', () => {
    it('removes element', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TITLE') })
      const elId = useFormStore.getState().form.steps[0].elements[0].id
      act(() => { useFormStore.getState().deleteElement(stepId, elId) })
      expect(useFormStore.getState().form.steps[0].elements).toHaveLength(0)
    })

    it('clears selectedElementId when deleting selected element', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TITLE') })
      const elId = useFormStore.getState().form.steps[0].elements[0].id
      act(() => { useFormStore.getState().selectElement(elId) })
      act(() => { useFormStore.getState().deleteElement(stepId, elId) })
      expect(useFormStore.getState().selectedElementId).toBeNull()
    })
  })

  describe('reorderElements', () => {
    it('reorders elements in a step', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'TITLE') })
      act(() => { useFormStore.getState().addElement(stepId, 'PARAGRAPH') })
      const firstId = useFormStore.getState().form.steps[0].elements[0].id
      act(() => { useFormStore.getState().reorderElements(stepId, 0, 1) })
      expect(useFormStore.getState().form.steps[0].elements[1].id).toBe(firstId)
    })
  })

  describe('moveElementToStep', () => {
    it('moves element between steps', () => {
      act(() => { useFormStore.getState().addStep() })
      const step1 = useFormStore.getState().form.steps[0].id
      const step2 = useFormStore.getState().form.steps[1].id
      act(() => { useFormStore.getState().addElement(step1, 'TITLE') })
      const elId = useFormStore.getState().form.steps[0].elements[0].id
      act(() => { useFormStore.getState().moveElementToStep(step1, step2, elId, 0) })
      expect(useFormStore.getState().form.steps[0].elements).toHaveLength(0)
      expect(useFormStore.getState().form.steps[1].elements).toHaveLength(1)
    })
  })

  describe('canAddElement', () => {
    it('allows normal element types', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      expect(useFormStore.getState().canAddElement(stepId, 'TEXT_INPUT').allowed).toBe(true)
    })

    it('rejects deprecated elements', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      expect(useFormStore.getState().canAddElement(stepId, 'SUCCESS_SCREEN').allowed).toBe(false)
    })

    it('returns false for non-existent step', () => {
      expect(useFormStore.getState().canAddElement('fake', 'TITLE').allowed).toBe(false)
    })
  })

  describe('getValidationErrors', () => {
    it('reports missing actions', () => {
      const errors = useFormStore.getState().getValidationErrors()
      expect(errors.some((e) => e.includes('no actions'))).toBe(true)
    })

    it('reports no errors for valid forms', () => {
      const stepId = useFormStore.getState().form.steps[0].id
      act(() => { useFormStore.getState().addElement(stepId, 'NAVIGATION') })
      const errors = useFormStore.getState().getValidationErrors()
      expect(errors).toHaveLength(0)
    })
  })

  describe('resetForm', () => {
    it('resets to default form', () => {
      act(() => { useFormStore.getState().setFormName('Custom') })
      act(() => { useFormStore.getState().resetForm() })
      expect(useFormStore.getState().form.name).toBe('New Form')
    })
  })

  describe('loadForm', () => {
    it('loads a complete form', () => {
      const form = {
        id: 'loaded-id',
        name: 'Loaded Form',
        slug: 'loaded-form',
        steps: [{ id: 's1', name: 'S1', slug: 's1', order: 0, elements: [] }],
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      }
      act(() => { useFormStore.getState().loadForm(form) })
      expect(useFormStore.getState().form.name).toBe('Loaded Form')
      expect(useFormStore.getState().selectedStepId).toBeNull()
    })
  })

  describe('exportForm / importForm', () => {
    it('exports form as JSON string', () => {
      const json = useFormStore.getState().exportForm()
      const parsed = JSON.parse(json)
      expect(parsed.name).toBe('New Form')
    })

    it('imports valid form JSON', () => {
      const form = {
        id: 'imp',
        name: 'Imported',
        slug: 'imported',
        steps: [{ id: 's1', name: 'S1', slug: 's1', order: 0, elements: [] }],
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
      }
      const result = useFormStore.getState().importForm(JSON.stringify(form))
      expect(result).toBe(true)
      expect(useFormStore.getState().form.name).toBe('Imported')
    })

    it('rejects invalid JSON', () => {
      expect(useFormStore.getState().importForm('bad')).toBe(false)
    })

    it('rejects object without steps', () => {
      expect(useFormStore.getState().importForm('{"id":"x","name":"n"}')).toBe(false)
    })
  })

  describe('saveFormToStorage', () => {
    it('saves current form to localStorage', () => {
      act(() => { useFormStore.getState().setFormName('Saved') })
      act(() => { useFormStore.getState().setFormSlug('saved-form') })
      act(() => { useFormStore.getState().saveFormToStorage() })
      const index = JSON.parse(localStorage.getItem('wf:forms:index') || '[]')
      expect(index.length).toBeGreaterThan(0)
    })
  })
})
