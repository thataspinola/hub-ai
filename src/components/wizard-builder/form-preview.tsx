'use client'

import { useState } from 'react'
import type { Form, FormElement } from '@/lib/form-wizard/types'
import { Button } from '@/components/ui/button'

function PreviewElement({ element }: { element: FormElement }) {
  const config = element.config as unknown as Record<string, unknown>
  const label = String(config.label ?? element.type.replaceAll('_', ' '))
  const placeholder = String(config.placeholder ?? '')
  const required = config.required === true

  const options = Array.isArray(config.options)
    ? (config.options as { label: string; value: string }[])
    : []

  const inputTypes: Record<string, string> = {
    EMAIL_INPUT: 'email',
    PHONE_INPUT: 'tel',
  }

  const fieldTypes = [
    'TEXT_INPUT',
    'CPF_INPUT',
    'CNPJ_INPUT',
    'PHONE_INPUT',
    'CEP_INPUT',
    'SOCIAL_NAME_INPUT',
    'EMAIL_INPUT',
  ]

  if (element.type === 'TITLE')
    return (
      <h3 className="text-xl font-bold text-slate-900">
        {String(config.text ?? '')}
      </h3>
    )

  if (element.type === 'PARAGRAPH')
    return (
      <p className="text-sm leading-relaxed text-slate-600">
        {String(config.text ?? '')}
      </p>
    )

  if (fieldTypes.includes(element.type))
    return (
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && ' *'}

        <input
          type={inputTypes[element.type] ?? 'text'}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal focus:border-sky-500 focus:outline-none"
        />
      </label>
    )

  if (element.type === 'SELECT')
    return (
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        {label}

        <select
          defaultValue=""
          required={required}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2"
        >
          <option value="" disabled>
            Selecione uma opção
          </option>

          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )

  if (element.type === 'RADIO')
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{label}</legend>

        {options.map((option, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={element.id}
              value={option.value}
              required={required}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    )

  if (element.type === 'CHECKBOX' || element.type === 'PRIVACY_POLICY')
    return (
      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input type="checkbox" required={required} />
        <span>{label}</span>
      </label>
    )

  if (element.type === 'PLANS') {
    const plans = Array.isArray(config.plans)
      ? (config.plans as {
          id: string
          name: string
          description?: string
          price: number
          currency: string
        }[])
      : []

    return (
      <div className="space-y-2">
        <p className="font-semibold">{String(config.title ?? 'Planos')}</p>
        {plans.map((plan) => (
          <label
            key={plan.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <span>
              <input type="radio" name={element.id} className="mr-2" />
              {plan.name}
              <small className="block text-slate-500">{plan.description}</small>
            </span>

            <strong>
              {plan.currency} {plan.price}
            </strong>
          </label>
        ))}
      </div>
    )
  }

  if (
    [
      'NAVIGATION',
      'SERVICE_CALL',
      'CONDITIONAL_ROUTE',
      'GO_TO_CHECKOUT',
    ].includes(element.type)
  )
    return (
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        {label}{' '}
        <span className="block text-xs">
          Ação externa simulada — não será executada.
        </span>
      </div>
    )

  if (element.type === 'SUCCESS_SCREEN')
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-emerald-800">
        <strong>{String(config.title ?? 'Sucesso')}</strong>
        <p>{String(config.message ?? '')}</p>
      </div>
    )

  return (
    <p className="rounded-lg bg-slate-100 p-3 text-xs text-slate-500">
      Componente {element.type} ainda sem renderização interativa.
    </p>
  )
}

export function FormPreview({ form }: { form: Form }) {
  const [index, setIndex] = useState(0)
  const steps = [...form.steps].sort((a, b) => a.order - b.order)
  const step = steps[Math.min(index, Math.max(steps.length - 1, 0))]

  if (!step)
    return (
      <p className="text-sm text-slate-500">
        Adicione uma etapa para visualizar.
      </p>
    )

  return (
    <section aria-label="Pré-visualização do formulário" className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{form.name}</h2>

          <p className="text-xs text-slate-500">
            Simulação local · Nenhum dado será enviado
          </p>
        </div>

        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          Etapa {Math.min(index + 1, steps.length)} de {steps.length}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-sky-600 transition-all"
          style={{
            width: `${((Math.min(index, steps.length - 1) + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      <div
        key={step.id}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-base font-semibold text-slate-800">{step.name}</h3>
        {[...step.elements]
          .sort((a, b) => a.order - b.order)
          .map((element) => (
            <PreviewElement key={element.id} element={element} />
          ))}

        {step.elements.length === 0 && (
          <p className="text-sm text-slate-400">
            Esta etapa ainda não possui componentes.
          </p>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Voltar
        </Button>

        <Button
          type="button"
          disabled={index >= steps.length - 1}
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
        >
          {index >= steps.length - 1 ? 'Última etapa' : 'Próxima etapa'}
        </Button>
      </div>
    </section>
  )
}
