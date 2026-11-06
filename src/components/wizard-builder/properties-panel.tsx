'use client'

import { useFormStore } from '@/lib/form-wizard/form-store'
import { StepProperties } from './properties/step-properties'
import { ElementProperties } from './properties/element-properties'

export function PropertiesPanel() {
  const selectedStepId = useFormStore((state) => state.selectedStepId)
  const selectedElementId = useFormStore((state) => state.selectedElementId)

  return (
    <div className="flex h-full w-72 flex-col border-l bg-card">
      <div className="border-b p-4">
        <h2 className="font-semibold">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedStepId ? (
          <ElementProperties />
        ) : selectedElementId ? (
          <StepProperties />
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a step or element to edit its properties.
          </p>
        )}
      </div>
    </div>
  )
}
