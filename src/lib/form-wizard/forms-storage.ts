// Forms Storage Layer - localStorage persistence for forms and responses

import type { Form, FormIndexEntry, FormResponses } from "./types"

const FORMS_INDEX_KEY = "wf:forms:index"
const FORM_PREFIX = "wf:forms:"
const RESPONSES_PREFIX = "wf:responses:"

export function generateFormSlug(name: string, existingSlugs: string[]): string {
  const baseSlug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 60) || "form"

  let slug = baseSlug
  let counter = 1

  while (existingSlugs.includes(slug)) {
    const suffix = `-${counter}`
    slug = `${baseSlug.substring(0, 60 - suffix.length)}${suffix}`
    counter++
  }

  return slug
}

export function getFormsIndex(): FormIndexEntry[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(FORMS_INDEX_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveFormsIndex(index: FormIndexEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(FORMS_INDEX_KEY, JSON.stringify(index))
}

export function getFormBySlug(slug: string): Form | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(`${FORM_PREFIX}${slug}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveForm(form: Form): void {
  if (typeof window === "undefined") return

  const now = new Date().toISOString()
  const formToSave: Form = {
    ...form,
    updatedAt: now,
  }

  localStorage.setItem(`${FORM_PREFIX}${form.slug}`, JSON.stringify(formToSave))

  const index = getFormsIndex()
  const existingIndex = index.findIndex((f) => f.id === form.id)

  const indexEntry: FormIndexEntry = {
    id: form.id,
    name: form.name,
    slug: form.slug,
    updatedAt: now,
    stepsCount: form.steps.length,
  }

  if (existingIndex >= 0) {
    const oldEntry = index[existingIndex]
    if (oldEntry.slug !== form.slug) {
      localStorage.removeItem(`${FORM_PREFIX}${oldEntry.slug}`)
    }
    index[existingIndex] = indexEntry
  } else {
    index.push(indexEntry)
  }

  saveFormsIndex(index)
}

export function deleteForm(slug: string): void {
  if (typeof window === "undefined") return

  localStorage.removeItem(`${FORM_PREFIX}${slug}`)
  localStorage.removeItem(`${RESPONSES_PREFIX}${slug}`)

  const index = getFormsIndex()
  const filteredIndex = index.filter((f) => f.slug !== slug)
  saveFormsIndex(filteredIndex)
}

export function duplicateForm(slug: string): Form | null {
  const original = getFormBySlug(slug)
  if (!original) return null

  const index = getFormsIndex()
  const existingSlugs = index.map((f) => f.slug)

  const newForm: Form = {
    ...original,
    id: Math.random().toString(36).substring(2, 11),
    name: `${original.name} (Copy)`,
    slug: generateFormSlug(`${original.name}-copy`, existingSlugs),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveForm(newForm)
  return newForm
}

export function getFormResponses(formSlug: string): FormResponses | null {
  if (typeof window === "undefined") return null
  try {
    const data = localStorage.getItem(`${RESPONSES_PREFIX}${formSlug}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveFormResponses(formSlug: string, responses: FormResponses): void {
  if (typeof window === "undefined") return
  localStorage.setItem(
    `${RESPONSES_PREFIX}${formSlug}`,
    JSON.stringify({
      ...responses,
      updatedAt: new Date().toISOString(),
    }),
  )
}

export function clearFormResponses(formSlug: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(`${RESPONSES_PREFIX}${formSlug}`)
}

export function exportFormAsJson(slug: string): string | null {
  const form = getFormBySlug(slug)
  return form ? JSON.stringify(form, null, 2) : null
}

export function importFormFromJson(json: string): Form | null {
  try {
    const form = JSON.parse(json) as Form
    if (!form.id || !form.steps || !Array.isArray(form.steps)) {
      return null
    }

    const index = getFormsIndex()
    const existingSlugs = index.map((f) => f.slug)

    const formToSave: Form = {
      ...form,
      id: Math.random().toString(36).substring(2, 11),
      slug: form.slug && !existingSlugs.includes(form.slug) ? form.slug : generateFormSlug(form.name, existingSlugs),
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveForm(formToSave)
    return formToSave
  } catch {
    return null
  }
}
