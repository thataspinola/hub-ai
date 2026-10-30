'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormStore } from '@/lib/form-wizard/form-store'
import {
  getFormBySlug,
  getFormsIndex,
  generateFormSlug,
} from '@/lib/form-wizard/forms-storage'
import { useHydrated } from '@/lib/use-hydrated'
import { WizardBuilder } from '@/components/wizard-builder'

export default function EditFormPage() {
  const { formSlug } = useParams<{ formSlug: string }>()
  const hydrated = useHydrated()
  if (!hydrated) return <p>Loading form...</p>

  return formSlug === 'new' ? (
    <NewFormHandler />
  ) : (
    <StoredForm key={formSlug} slug={formSlug} />
  )
}

function StoredForm({ slug }: { slug: string }) {
  const router = useRouter()
  const loadForm = useFormStore((state) => state.loadForm)
  const currentId = useFormStore((state) => state.form?.id)
  const form = useMemo(() => getFormBySlug(slug), [slug])

  useEffect(() => {
    if (form) loadForm(form)
  }, [form, loadForm])

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Form Not Found</h1>
        <p>The form you are looking for does not exist.</p>
        <button
          onClick={() => router.push('/form-wizard')}
          className="text-primary underline"
        >
          Go back to forms list
        </button>
      </div>
    )
  }

  return currentId === form.id ? <WizardBuilder /> : <p>Loading form...</p>
}

function NewFormHandler() {
  const router = useRouter()
  const resetForm = useFormStore((state) => state.resetForm)
  const initialized = useRef(false)
  const storageError = useFormStore((s) => s.storageError)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    resetForm()
    const state = useFormStore.getState()
    const existingSlugs = getFormsIndex().map((entry) => entry.slug)
    if (existingSlugs.includes(state.form.slug)) {
      state.setFormSlug(generateFormSlug(state.form.name, existingSlugs))
    }
    const current = useFormStore.getState()
    if (current.saveFormToStorage() === false) return
    router.replace(`/form-wizard/${current.form.slug}`)
  }, [resetForm, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-muted-foreground" role={storageError ? 'alert' : undefined}>
        {storageError || 'Creating new form...'}
      </div>
    </div>
  )
}
