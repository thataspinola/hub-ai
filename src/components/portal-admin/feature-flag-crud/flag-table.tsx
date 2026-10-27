'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Code, Trash2, Edit2, Check, AlertCircle } from 'lucide-react'

export function FlagTable<T extends { id: string }>({
  items,
  columns,
  renderRow,
}: {
  items: T[]
  columns: string[]
  renderRow: (item: T) => React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                  i === columns.length - 1 ? 'text-right' : 'text-left'
                }`}
              >
                {col || <span className="sr-only">Ações</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          <AnimatePresence mode="popLayout">
            {items.map((item) => renderRow(item))}
          </AnimatePresence>
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <AlertCircle size={40} strokeWidth={1.5} />
                  <p className="font-medium">Nenhuma flag encontrada</p>
                  <p className="text-xs">Tente ajustar seus filtros ou busca</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function FlagRow({
  flag,
  showJsonId,
  deleteConfirmId,
  onToggle,
  onEdit,
  onShowJson,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
  jsonData,
  extraCells,
  colSpan,
}: {
  flag: {
    id: string
    key: string
    name: string
    description: string
    enabled: boolean
  }
  showJsonId: string | null
  deleteConfirmId: string | null
  onToggle: () => void
  onEdit: () => void
  onShowJson: () => void
  onDeleteClick: () => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
  jsonData: unknown
  extraCells: React.ReactNode
  colSpan?: number
}) {
  const cols = colSpan ?? 6

  return (
    <React.Fragment>
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hover:bg-slate-50/50 transition-colors group"
      >
        {/* Name */}
        <td className="py-4 px-6">
          <div className="font-bold text-slate-900">{flag.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            {flag.description}
          </div>
        </td>
        {/* Key */}
        <td className="px-6 py-4">
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            {flag.key}
          </span>
        </td>
        {/* Status */}
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              flag.enabled
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {flag.enabled ? 'Ativado' : 'Desativado'}
          </span>
        </td>
        {/* Extra cells injected */}
        {extraCells}
        {/* Actions */}
        <td className="py-4 px-6 text-right">
          <div className="flex items-center justify-end gap-3 relative">
            <button
              onClick={onShowJson}
              className={`p-1.5 rounded-md transition-colors ${
                showJsonId === flag.id
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'
              }`}
              title="Ver JSON"
            >
              <Code size={16} />
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
              title="Editar"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={onToggle}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                flag.enabled ? 'bg-emerald-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
            <button
              onClick={onDeleteClick}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
            <AnimatePresence>
              {deleteConfirmId === flag.id && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-0 top-0 bottom-0 z-10 bg-white border-l border-slate-200 flex items-center gap-3 px-4 shadow-xl"
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Excluir?
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={onDeleteCancel}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={onDeleteConfirm}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </td>
      </motion.tr>
      {showJsonId === flag.id && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <td colSpan={cols} className="px-6 py-4 bg-slate-900">
            <pre className="text-[11px] text-indigo-300 font-mono overflow-x-auto p-2">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </td>
        </motion.tr>
      )}
    </React.Fragment>
  )
}
