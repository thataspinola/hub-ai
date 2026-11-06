'use client'

import React, { useState } from 'react'
import type { BooleanFlag } from '@/lib/feature-flags/crud-storage'
import { createBooleanFlag } from '@/lib/feature-flags/crud-storage'
import { ModalShell, Field, TextInput, EnabledToggle } from './modal-fields'

export function BooleanModal({
  editing,
  onClose,
  onSave,
}: {
  editing?: BooleanFlag | null
  onClose: () => void
  onSave: (flag: BooleanFlag) => void
}) {
  const [name, setName] = useState(editing?.name ?? '')
  const [key, setKey] = useState(editing?.key ?? '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [owner, setOwner] = useState(editing?.owner ?? 'Engenharia')
  const [enabled, setEnabled] = useState(editing?.enabled ?? false)

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
        updatedAt: new Date().toISOString(),
      })
    } else {
      onSave(createBooleanFlag({ name, key, description, owner, enabled }))
    }
  }

  return (
    <ModalShell
      title={editing ? 'Editar Flag Booleana' : 'Nova Flag Booleana'}
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
            placeholder="Ex: Checkout V2"
          />
        </Field>

        <Field label="Chave">
          <TextInput
            required
            value={key}
            onChange={setKey}
            placeholder="Ex: checkout_v2"
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

      <EnabledToggle enabled={enabled} onToggle={() => setEnabled(!enabled)} />
    </ModalShell>
  )
}
