import {
  generateFormSlug,
  getFormsIndex,
  saveFormsIndex,
  getFormBySlug,
  saveForm,
  deleteForm,
  duplicateForm,
  getFormResponses,
  saveFormResponses,
  clearFormResponses,
  exportFormAsJson,
  importFormFromJson,
} from '@/lib/form-wizard/forms-storage'
import type { Form, FormResponses } from '@/lib/form-wizard/types'

const createTestForm = (overrides: Partial<Form> = {}): Form => ({
  id: 'test-id',
  name: 'Test Form',
  slug: 'test-form',
  steps: [
    {
      id: 'step-1',
      name: 'Step 1',
      slug: 'step-1',
      order: 0,
      elements: [],
    },
  ],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  localStorage.clear()
})

describe('generateFormSlug', () => {
  it('generates a slug from name', () => {
    expect(generateFormSlug('My Form', [])).toBe('my-form')
  })

  it('removes special characters', () => {
    expect(generateFormSlug('Hello World!@#$', [])).toBe('hello-world')
  })

  it('appends counter on collision', () => {
    expect(generateFormSlug('test', ['test'])).toBe('test-1')
    expect(generateFormSlug('test', ['test', 'test-1'])).toBe('test-2')
  })

  it('falls back to "form" for empty name', () => {
    expect(generateFormSlug('', [])).toBe('form')
  })

  it('truncates long names to 60 chars', () => {
    const longName = 'a'.repeat(100)
    const slug = generateFormSlug(longName, [])
    expect(slug.length).toBeLessThanOrEqual(60)
  })
})

describe('getFormsIndex / saveFormsIndex', () => {
  it('returns empty array when no data', () => {
    expect(getFormsIndex()).toEqual([])
  })

  it('persists and retrieves index', () => {
    const index = [{ id: '1', name: 'F', slug: 'f', updatedAt: '', stepsCount: 1 }]
    saveFormsIndex(index)
    expect(getFormsIndex()).toEqual(index)
  })

  it('returns empty array on corrupted data', () => {
    localStorage.setItem('wf:forms:index', 'not-json')
    expect(getFormsIndex()).toEqual([])
  })
})

describe('getFormBySlug', () => {
  it('returns null for non-existent slug', () => {
    expect(getFormBySlug('nope')).toBeNull()
  })

  it('returns the saved form', () => {
    const form = createTestForm()
    localStorage.setItem('wf:forms:test-form', JSON.stringify(form))
    expect(getFormBySlug('test-form')).toEqual(form)
  })
})

describe('saveForm', () => {
  it('saves form and creates index entry', () => {
    const form = createTestForm()
    saveForm(form)

    const stored = getFormBySlug('test-form')
    expect(stored).not.toBeNull()
    expect(stored?.name).toBe('Test Form')

    const index = getFormsIndex()
    expect(index).toHaveLength(1)
    expect(index[0].slug).toBe('test-form')
  })

  it('updates existing index entry', () => {
    const form = createTestForm()
    saveForm(form)
    saveForm({ ...form, name: 'Updated' })

    const index = getFormsIndex()
    expect(index).toHaveLength(1)
    expect(index[0].name).toBe('Updated')
  })

  it('removes old slug entry if slug changes', () => {
    const form = createTestForm()
    saveForm(form)
    saveForm({ ...form, slug: 'new-slug' })

    expect(getFormBySlug('test-form')).toBeNull()
    expect(getFormBySlug('new-slug')).not.toBeNull()
  })
})

describe('deleteForm', () => {
  it('removes form and index entry', () => {
    const form = createTestForm()
    saveForm(form)
    deleteForm('test-form')

    expect(getFormBySlug('test-form')).toBeNull()
    expect(getFormsIndex()).toHaveLength(0)
  })
})

describe('duplicateForm', () => {
  it('creates a copy with new slug', () => {
    const form = createTestForm()
    saveForm(form)

    const copy = duplicateForm('test-form')
    expect(copy).not.toBeNull()
    expect(copy?.slug).not.toBe('test-form')
    expect(copy?.name).toContain('(Copy)')
    expect(getFormsIndex()).toHaveLength(2)
  })

  it('returns null for non-existent slug', () => {
    expect(duplicateForm('nope')).toBeNull()
  })
})

describe('form responses', () => {
  it('returns null when no responses', () => {
    expect(getFormResponses('test')).toBeNull()
  })

  it('saves and retrieves responses', () => {
    const responses: FormResponses = {
      values: { name: 'John' },
      currentStepSlug: 'step-1',
      updatedAt: '',
    }
    saveFormResponses('test', responses)

    const loaded = getFormResponses('test')
    expect(loaded).not.toBeNull()
    expect(loaded?.values).toEqual({ name: 'John' })
  })

  it('clears responses', () => {
    const responses: FormResponses = {
      values: {},
      currentStepSlug: 'step-1',
      updatedAt: '',
    }
    saveFormResponses('test', responses)
    clearFormResponses('test')
    expect(getFormResponses('test')).toBeNull()
  })
})

describe('exportFormAsJson', () => {
  it('returns JSON string for existing form', () => {
    saveForm(createTestForm())
    const json = exportFormAsJson('test-form')
    expect(json).not.toBeNull()
    const parsed = JSON.parse(json!)
    expect(parsed.name).toBe('Test Form')
  })

  it('returns null for non-existent form', () => {
    expect(exportFormAsJson('nope')).toBeNull()
  })
})

describe('importFormFromJson', () => {
  it('imports a valid form', () => {
    const form = createTestForm({ slug: 'import-test' })
    const json = JSON.stringify(form)

    const result = importFormFromJson(json)
    expect(result).not.toBeNull()
    expect(getFormsIndex()).toHaveLength(1)
  })

  it('returns null for invalid JSON', () => {
    expect(importFormFromJson('not-json')).toBeNull()
  })

  it('returns null for object missing required fields', () => {
    expect(importFormFromJson('{"name":"test"}')).toBeNull()
  })

  it('generates slug if missing', () => {
    const form = createTestForm()
    const { slug: _slug, ...formWithoutSlug } = form
    const json = JSON.stringify({ ...formWithoutSlug, slug: '' })
    const result = importFormFromJson(json)
    expect(result).not.toBeNull()
    expect(result?.slug).toBeTruthy()
  })
})
