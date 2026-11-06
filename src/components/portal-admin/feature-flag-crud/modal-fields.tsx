'use client'

import React from 'react'
import { motion } from 'motion/react'
import { X, Check } from 'lucide-react'

export function ModalShell({
  title,
  onClose,
  onSubmit,
  submitLabel,
  children,
}: {
  title: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {children}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-w-0 h-12 px-6 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 min-w-0 h-12 bg-indigo-600 text-white px-6 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </label>

      {children}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  required,
  mono,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  mono?: boolean
}) {
  return (
    <input
      type="text"
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm ${mono ? 'font-mono' : ''}`}
    />
  )
}

export function EnabledToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
        >
          <Check size={18} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">Estado</p>
          <p className="text-xs text-slate-500">
            {enabled ? 'Ativado' : 'Desativado'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  )
}
