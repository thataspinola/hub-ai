import type { Form, FormIndexEntry, FormResponses } from './types'
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown) => typeof value === 'string'
export function isForm(value: unknown): value is Form {
  if (!object(value) || !text(value.id) || !value.id || !text(value.name) || !text(value.slug) || !text(value.createdAt) || !text(value.updatedAt) || !Array.isArray(value.steps)) return false
  return value.steps.every(step => object(step) && text(step.id) && text(step.name) && text(step.slug) && typeof step.order === 'number' && Array.isArray(step.elements) && step.elements.every(element => object(element) && text(element.id) && typeof element.order === 'number' && text(element.type) && object(element.config) && (!('options' in element.config) || Array.isArray(element.config.options) && element.config.options.every(option => object(option) && text(option.label) && text(option.value)))))
}
export function isFormIndex(value: unknown): value is FormIndexEntry[] {
  return Array.isArray(value) && value.every(entry => object(entry) && text(entry.id) && text(entry.name) && text(entry.slug) && text(entry.updatedAt) && Number.isInteger(entry.stepsCount) && Number(entry.stepsCount) >= 0)
}
export function isFormResponses(value: unknown): value is FormResponses {
  return object(value) && object(value.values) && text(value.currentStepSlug) && text(value.updatedAt)
}
