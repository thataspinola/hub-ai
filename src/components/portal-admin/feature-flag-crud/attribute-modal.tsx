'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { AttributeFlag } from '@/lib/feature-flags/crud-storage'
import { createAttributeFlag } from '@/lib/feature-flags/crud-storage'
import { ModalShell, Field, TextInput, EnabledToggle } from './modal-fields'

export function AttributeModal({
  editing,
  onClose,
  onSave,
}: {
  editing: AttributeFlag | null
  onClose: () => void
  onSave: (flag: AttributeFlag) => void
}) {
  const [name, setName] = useState(editing?.name ?? '')
  const [key, setKey] = useState(editing?.key ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [owner, setOwner] = useState(editing?.owner ?? 'Engenharia')
  const [enabled, setEnabled] = useState(editing?.enabled ?? false)
  const [attrs, setAttrs] = useState<{ key: string; value: string }[]>(() => {
    if (editing) {
      return Object.entries(editing.attributes).map(([k, v]) => ({
        key: k,
        value: String(v),
      }))
    }
    return [{ key: '', value: '' }]
  })

  const addAttr = () => setAttrs([...attrs, { key: '', value: '' }])
  const removeAttr = (i: number) =>
    setAttrs(attrs.filter((_, idx) => idx !== i))
  const updateAttr = (i: number, field: 'key' | 'value', val: string) => {
    setAttrs(attrs.map((a, idx) => (idx === i ? { ...a, [field]: val } : a)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const attributes: Record<string, string | number | boolean> = {}
    for (const a of attrs) {
      if (!a.key.trim()) continue
      // Auto-detect type
      if (a.value === 'true' || a.value === 'false') {
        attributes[a.key] = a.value === 'true'
      } else if (!isNaN(Number(a.value)) && a.value.trim() !== '') {
        attributes[a.key] = Number(a.value)
      } else {
        attributes[a.key] = a.value
      }
    }
    if (editing) {
      onSave({
        ...editing,
        name,
        key,
        description,
        owner,
        enabled,
        attributes,
        updatedAt: new Date().toISOString(),
      })
    } else {
      onSave(
        createAttributeFlag({
          name,
          key,
          description,
          owner,
          enabled,
          attributes,
        }),
      )
    }
  }

  return (
    <ModalShell
      title={editing ? 'Editar Flag com Atributos' : 'Nova Flag com Atributos'}
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
            placeholder="Ex: ML Rec Engine"
          />
        </Field>
        <Field label="Chave">
          <TextInput
            required
            value={key}
            onChange={setKey}
            placeholder="Ex: ml_rec_engine"
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
      <Field label="Responsável">
        <TextInput
          value={owner}
          onChange={setOwner}
          placeholder="Ex: Engenharia"
        />
      </Field>

      {/* Attributes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Atributos
          </label>
          <button
            type="button"
            onClick={addAttr}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>
        {attrs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={a.key}
              onChange={(e) => updateAttr(i, 'key', e.target.value)}
              placeholder="Chave"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <input
              type="text"
              value={a.value}
              onChange={(e) => updateAttr(i, 'value', e.target.value)}
              placeholder="Valor"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            {attrs.length > 1 && (
              <button
                type="button"
                onClick={() => removeAttr(i)}
                className="p-1 text-slate-300 hover:text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <p className="text-[10px] text-slate-400">
          Valores numéricos e booleanos (true/false) são detectados
          automaticamente.
        </p>
      </div>

      <EnabledToggle enabled={enabled} onToggle={() => setEnabled(!enabled)} />
    </ModalShell>
  )
}
