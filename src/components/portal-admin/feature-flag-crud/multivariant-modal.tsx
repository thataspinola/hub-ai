'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { MultivariantFlag } from '@/lib/feature-flags/crud-storage'
import { createMultivariantFlag } from '@/lib/feature-flags/crud-storage'
import { ModalShell, Field, TextInput, EnabledToggle } from './modal-fields'

export function MultivariantModal({
  editing,
  onClose,
  onSave,
}: {
  editing: MultivariantFlag | null
  onClose: () => void
  onSave: (flag: MultivariantFlag) => void
}) {
  const [name, setName] = useState(editing?.name ?? '')
  const [key, setKey] = useState(editing?.key ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [owner, setOwner] = useState(editing?.owner ?? 'Engenharia')
  const [enabled, setEnabled] = useState(editing?.enabled ?? false)
  const [valueType, setValueType] = useState<'string' | 'number' | 'json'>(
    editing?.valueType ?? 'string',
  )
  const [value, setValue] = useState(editing?.value ?? '')
  const [variants, setVariants] = useState(
    editing?.variants ?? [{ label: '', value: '', weight: 100 }],
  )

  const addVariant = () =>
    setVariants([...variants, { label: '', value: '', weight: 0 }])
  const removeVariant = (i: number) =>
    setVariants(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i: number, field: string, val: string | number) => {
    setVariants(
      variants.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      onSave({
        ...editing,
        name,
        key,
        description,
        owner,
        enabled,
        valueType,
        value,
        variants,
        updatedAt: new Date().toISOString(),
      })
    } else {
      onSave(
        createMultivariantFlag({
          name,
          key,
          description,
          owner,
          enabled,
          valueType,
          value,
          variants,
        }),
      )
    }
  }

  return (
    <ModalShell
      title={editing ? 'Editar Flag Multivariante' : 'Nova Flag Multivariante'}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={editing ? 'Salvar' : 'Criar'}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome">
          <TextInput
            required
            value={name}
            onChange={setName}
            placeholder="Ex: Dark Mode"
          />
        </Field>
        <Field label="Chave">
          <TextInput
            required
            value={key}
            onChange={setKey}
            placeholder="Ex: ui_dark_mode"
            mono
          />
        </Field>
      </div>
      <Field label="Descrição">
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Para que serve esta flag?"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm h-20 resize-none"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo do Valor">
          <select
            value={valueType}
            onChange={(e) => setValueType(e.target.value as typeof valueType)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="json">JSON</option>
          </select>
        </Field>
        <Field label="Valor Atual">
          <TextInput
            required
            value={value}
            onChange={setValue}
            placeholder={
              valueType === 'number'
                ? '100'
                : valueType === 'json'
                  ? '{"key": "value"}'
                  : 'beta'
            }
            mono
          />
        </Field>
      </div>
      <Field label="Responsável">
        <TextInput
          value={owner}
          onChange={setOwner}
          placeholder="Ex: Engenharia"
        />
      </Field>

      {/* Variants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Variantes
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={v.label}
              onChange={(e) => updateVariant(i, 'label', e.target.value)}
              placeholder="Label"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <input
              type="text"
              value={v.value}
              onChange={(e) => updateVariant(i, 'value', e.target.value)}
              placeholder="Valor"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <input
              type="number"
              value={v.weight}
              onChange={(e) =>
                updateVariant(i, 'weight', Number(e.target.value))
              }
              placeholder="%"
              min={0}
              max={100}
              className="w-16 px-3 py-2 rounded-lg border border-slate-200 text-sm text-center focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="p-1 text-slate-300 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      <EnabledToggle enabled={enabled} onToggle={() => setEnabled(!enabled)} />
    </ModalShell>
  )
}
