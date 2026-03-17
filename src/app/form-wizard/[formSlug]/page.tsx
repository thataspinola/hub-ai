"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useFormStore } from "@/lib/form-wizard/form-store"
import { getFormBySlug, getFormsIndex, generateFormSlug } from "@/lib/form-wizard/forms-storage"
import { WizardBuilder } from "@/components/wizard-builder"

export default function EditFormPage() {
  const params = useParams<{ formSlug: string }>()
  const formSlug = params.formSlug
  const router = useRouter()
  const loadForm = useFormStore((s) => s.loadForm)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (formSlug === "new") {
      return
    }

    const form = getFormBySlug(formSlug)

    if (form) {
      loadForm(form)
      setIsLoading(false)
    } else {
      setNotFound(true)
      setIsLoading(false)
    }
  }, [formSlug, loadForm, router])

  if (formSlug === "new") {
    return <NewFormHandler />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading form...</div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Form Not Found</h1>
        <p className="text-muted-foreground">The form you are looking for does not exist.</p>
        <button onClick={() => router.push("/form-wizard")} className="text-primary underline">
          Go back to forms list
        </button>
      </div>
    )
  }

  return <WizardBuilder />
}

function NewFormHandler() {
  const router = useRouter()
  const resetForm = useFormStore((s) => s.resetForm)
  const form = useFormStore((s) => s.form)
  const saveFormToStorage = useFormStore((s) => s.saveFormToStorage)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    resetForm()
    setInitialized(true)
  }, [resetForm])

  useEffect(() => {
    if (!initialized) return

    const index = getFormsIndex()
    const existingSlugs = index.map((f: { slug: string }) => f.slug)

    if (!existingSlugs.includes(form.slug)) {
      saveFormToStorage()
      router.replace(`/form-wizard/${form.slug}`)
    } else {
      const newSlug = generateFormSlug(form.name, existingSlugs)
      useFormStore.setState((state) => ({
        form: { ...state.form, slug: newSlug },
      }))
    }
  }, [initialized, form.slug, form.name, saveFormToStorage, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Creating new form...</div>
    </div>
  )
}
