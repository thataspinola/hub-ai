'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Plus,
  X,
  Code,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
} from 'lucide-react'
import { FEATURE_FLAGS } from '@/constants/featureops'
import { FeatureFlag } from '@/types/featureops'

import { useHydrated } from '@/lib/use-hydrated'

const STORAGE_KEY = 'feature_flags_data'

export const FeatureFlags: React.FC = () => {
  const hydrated = useHydrated()
  return hydrated ? <FeatureFlagsContent /> : <p>Loading flags...</p>
}

function FeatureFlagsContent() {
  const [flags, setFlags] = useState<FeatureFlag[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : FEATURE_FLAGS
    } catch (e) {
      console.log('Error parsing feature flags from localStorage', e)
      return FEATURE_FLAGS
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showJsonId, setShowJsonId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const [newFlag, setNewFlag] = useState<Partial<FeatureFlag>>({
    name: '',
    description: '',
    key: '',
    status: 'Desativado',
    traffic: '0%',
    owner: 'Engenharia',
    enabled: false,
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags))
  }, [flags])

  const toggleFlag = (id: string) => {
    setFlags(
      flags.map((f) => {
        if (f.id === id) {
          const newEnabled = !f.enabled

          return {
            ...f,
            enabled: newEnabled,
            status: newEnabled ? 'Ativado' : 'Desativado',
            lastModified: 'Agora',
          }
        }

        return f
      })
    )
  }

  const handleSaveFlag = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      setFlags(
        flags.map((f) =>
          f.id === editingId
            ? {
                ...f,
                ...(newFlag as FeatureFlag),
                lastModified: 'Agora',
              }
            : f
        )
      )
    } else {
      const id = crypto.randomUUID()

      const flag: FeatureFlag = {
        id,
        name: newFlag.name || 'Nova Flag',
        description: newFlag.description || '',
        key: newFlag.key || `flag_${id}`,
        status: newFlag.enabled ? 'Ativado' : 'Desativado',
        traffic: newFlag.traffic || '0%',
        owner: newFlag.owner || 'Engenharia',
        lastModified: 'Agora',
        enabled: newFlag.enabled || false,
      }

      setFlags([...flags, flag])
    }

    closeModal()
  }

  const openEditModal = (flag: FeatureFlag) => {
    setEditingId(flag.id)
    setNewFlag(flag)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)

    setNewFlag({
      name: '',
      description: '',
      key: '',
      status: 'Desativado',
      traffic: '0%',
      owner: 'Engenharia',
      enabled: false,
    })
  }

  const handleDeleteFlag = (id: string) => {
    setFlags(flags.filter((f) => f.id !== id))
    setDeleteConfirmId(null)
  }

  const filteredFlags = useMemo(() => {
    return flags.filter((flag) => {
      const matchesSearch =
        flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flag.key.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && flag.enabled) ||
        (statusFilter === 'inactive' && !flag.enabled)

      return matchesSearch && matchesStatus
    })
  }, [flags, searchQuery, statusFilter])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 p-8 space-y-8 bg-slate-50 overflow-y-auto"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Feature Flags</h2>
          <p className="text-slate-500 mt-1">
            Gerencie as funcionalidades principais e sua visibilidade nos
            ambientes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-indigo-50 text-indigo-600">
              Staging
            </button>

            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
              Produção
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            Nova Funcionalidade
          </button>
        </div>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar flags por nome ou chave..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativados</option>
              <option value="inactive">Desativados</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nome da Funcionalidade
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Chave
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tráfego %
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Última Modificação
                </th>

                <th className="relative py-4 px-6 text-right">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              <AnimatePresence mode="popLayout">
                {filteredFlags.map((flag) => (
                  <React.Fragment key={flag.id}>
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          {flag.name}
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5">
                          {flag.description}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                          {flag.key}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            flag.enabled
                              ? 'bg-green-100 text-green-700'
                              : flag.status === 'Apenas Piloto'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {flag.enabled ? 'Ativado' : flag.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {flag.traffic}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {flag.lastModified}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              setShowJsonId(
                                showJsonId === flag.id ? null : flag.id
                              )
                            }
                            className={`p-1.5 rounded-md transition-colors ${showJsonId === flag.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`}
                            title="Ver JSON"
                          >
                            <Code size={16} />
                          </button>

                          <button
                            onClick={() => openEditModal(flag)}
                            className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            onClick={() => toggleFlag(flag.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                              flag.enabled ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                flag.enabled ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(flag.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

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
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-1 text-slate-400 hover:text-slate-600"
                                >
                                  <X size={14} />
                                </button>

                                <button
                                  onClick={() => handleDeleteFlag(flag.id)}
                                  className="p-1 text-red-500 hover:text-red-700"
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>

                    {showJsonId === flag.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={6} className="px-6 py-4 bg-slate-900">
                          <pre className="text-[11px] text-indigo-300 font-mono overflow-x-auto custom-scrollbar p-2">
                            {JSON.stringify(flag, null, 2)}
                          </pre>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>

              {filteredFlags.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle size={40} strokeWidth={1.5} />
                      <p className="font-medium">Nenhuma flag encontrada</p>

                      <p className="text-xs">
                        Tente ajustar seus filtros ou busca
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Editar Feature Flag' : 'Nova Feature Flag'}
                </h3>

                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveFlag} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nome
                    </label>

                    <input
                      required
                      type="text"
                      value={newFlag.name}
                      onChange={(e) =>
                        setNewFlag({ ...newFlag, name: e.target.value })
                      }
                      placeholder="Ex: Novo Layout Checkout"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Chave (Key)
                    </label>

                    <input
                      required
                      type="text"
                      value={newFlag.key}
                      onChange={(e) =>
                        setNewFlag({ ...newFlag, key: e.target.value })
                      }
                      placeholder="Ex: checkout_v2_new"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Descrição
                  </label>

                  <textarea
                    required
                    value={newFlag.description}
                    onChange={(e) =>
                      setNewFlag({ ...newFlag, description: e.target.value })
                    }
                    placeholder="Para que serve esta funcionalidade?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm h-20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Tráfego (%)
                    </label>

                    <input
                      type="text"
                      value={newFlag.traffic}
                      onChange={(e) =>
                        setNewFlag({ ...newFlag, traffic: e.target.value })
                      }
                      placeholder="Ex: 15%"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Responsável
                    </label>

                    <input
                      type="text"
                      value={newFlag.owner}
                      onChange={(e) =>
                        setNewFlag({ ...newFlag, owner: e.target.value })
                      }
                      placeholder="Ex: Engenharia"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${newFlag.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
                    >
                      <Check size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Estado Inicial
                      </p>

                      <p className="text-xs text-slate-500">
                        {newFlag.enabled
                          ? 'Ativado por padrão'
                          : 'Desativado por padrão'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNewFlag({ ...newFlag, enabled: !newFlag.enabled })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${newFlag.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newFlag.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    {editingId ? 'Salvar Alterações' : 'Criar Flag'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
