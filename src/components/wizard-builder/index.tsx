'use client'

import { useEffect } from 'react'
import { ComponentLibrary } from './component-library'
import { StepCanvas } from './step-canvas'
import { PropertiesPanel } from './properties-panel'
import { Toolbar } from './toolbar'
import { useFormStore } from '@/lib/form-wizard/form-store'

export function WizardBuilder() {
  const form = useFormStore((s) => s.form)
  const selectStep = useFormStore((s) => s.selectStep)
  const selectedStepId = useFormStore((s) => s.selectedStepId)
  const saveFormToStorage = useFormStore((s) => s.saveFormToStorage)

  useEffect(() => {
    if (!selectedStepId && form.steps.length > 0) {
      selectStep(form.steps[0].id)
    }
  }, [selectedStepId, form.steps, selectStep])

  useEffect(() => {
    return () => {
      saveFormToStorage()
    }
  }, [saveFormToStorage])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveFormToStorage()
      }
    }

    const handleBeforeUnload = () => {
      saveFormToStorage()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [saveFormToStorage])

  return (
    <div className="flex h-screen min-w-[1024px] flex-col bg-background">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 shrink-0 border-r">
          <ComponentLibrary />
        </div>
        <StepCanvas />
        <PropertiesPanel />
      </div>
    </div>
  )
}
