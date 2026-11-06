'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Search,
  Plus,
  ToggleLeft,
  Layers,
  Settings2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import type { FlagCrudStorage } from '@/lib/feature-flags/crud-storage'
import {
  ApiFeatureFlagStorage,
  LocalStorageCrudStorage,
  syncProviderStorage,
} from '@/lib/feature-flags/crud-storage'
import { useHydrated } from '@/lib/use-hydrated'
import type { Tab } from './feature-flag-crud/types'
import { TabHelpContent } from './feature-flag-crud/tab-help-content'
import { FlagTable, FlagRow } from './feature-flag-crud/flag-table'
import { BooleanModal } from './feature-flag-crud/boolean-modal'
import { MultivariantModal } from './feature-flag-crud/multivariant-modal'
import { AttributeModal } from './feature-flag-crud/attribute-modal'
import { useFlagCrud } from './feature-flag-crud/use-flag-crud'

export function FeatureFlagCrud(props: { storage?: FlagCrudStorage }) {
  const hydrated = useHydrated()

  return hydrated ? (
    <FeatureFlagCrudContent {...props} />
  ) : (
    <p>Loading flags...</p>
  )
}

function FeatureFlagCrudContent({
  storage: storageProp,
}: {
  storage?: FlagCrudStorage
}) {
  const [storage] = useState<FlagCrudStorage>(
    () => storageProp ?? new LocalStorageCrudStorage()
  )

  const {
    store,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    modal,
    setModal,
    showJsonId,
    setShowJsonId,
    deleteConfirmId,
    setDeleteConfirmId,
    showHelp,
    setShowHelp,
    persist,
    filteredBoolean,
    filteredMulti,
    filteredAttr,
    toggleBoolean,
    toggleMultivariant,
    toggleAttribute,
    handleDelete,
    relativeTime,
  } = useFlagCrud(storage, syncProviderStorage)

  const tabs: {
    id: Tab
    label: string
    icon: React.ReactNode
    count: number
  }[] = [
    {
      id: 'boolean',
      label: 'Booleanas',
      icon: <ToggleLeft size={16} />,
      count: store.booleanFlags.length,
    },
    {
      id: 'multivariant',
      label: 'Multivariantes',
      icon: <Layers size={16} />,
      count: store.multivariantFlags.length,
    },
    {
      id: 'attributes',
      label: 'Com Atributos',
      icon: <Settings2 size={16} />,
      count: store.attributeFlags.length,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto bg-slate-50 p-8"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Gerenciamento de Feature Flags
          </h2>

          <p className="text-slate-500 mt-1">
            Administre flags booleanas, multivariantes e com atributos.
          </p>
        </div>

        <button
          onClick={() =>
            setModal(
              activeTab === 'boolean'
                ? { type: 'boolean', editing: null }
                : activeTab === 'multivariant'
                  ? { type: 'multivariant', editing: null }
                  : { type: 'attributes', editing: null }
            )
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 self-start md:self-auto"
        >
          <Plus size={18} />
          Nova Flag
        </button>
      </header>

      {/* Tabs */}
      <div className="space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSearchQuery('')
                  setStatusFilter('all')
                  setShowHelp(false)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}

                <span
                  className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
              showHelp
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:border-slate-200 hover:bg-white'
            }`}
            title="Como funciona?"
          >
            <HelpCircle size={16} />
            <span className="hidden sm:inline">Como funciona?</span>

            <ChevronDown
              size={14}
              className={`transition-transform ${showHelp ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <TabHelpContent
                tab={activeTab}
                onClose={() => setShowHelp(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search + Filter */}
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

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativados</option>
            <option value="inactive">Desativados</option>
          </select>
        </div>

        {/* Boolean Tab */}
        {activeTab === 'boolean' && (
          <FlagTable
            items={filteredBoolean}
            columns={[
              'Nome',
              'Chave',
              'Status',
              'Responsável',
              'Atualizado',
              '',
            ]}
            renderRow={(flag) => (
              <FlagRow
                key={flag.id}
                flag={flag}
                showJsonId={showJsonId}
                deleteConfirmId={deleteConfirmId}
                onToggle={() => toggleBoolean(flag.id)}
                onEdit={() => setModal({ type: 'boolean', editing: flag })}
                onShowJson={() =>
                  setShowJsonId(showJsonId === flag.id ? null : flag.id)
                }
                onDeleteClick={() => setDeleteConfirmId(flag.id)}
                onDeleteConfirm={() => handleDelete(flag.id, 'boolean')}
                onDeleteCancel={() => setDeleteConfirmId(null)}
                jsonData={flag}
                extraCells={
                  <>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {flag.owner}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-400">
                      {relativeTime(flag.updatedAt)}
                    </td>
                  </>
                }
                colSpan={0}
              />
            )}
          />
        )}

        {/* Multivariant Tab */}
        {activeTab === 'multivariant' && (
          <FlagTable
            items={filteredMulti}
            columns={[
              'Nome',
              'Chave',
              'Status',
              'Tipo',
              'Valor Atual',
              'Variantes',
              '',
            ]}
            renderRow={(flag) => (
              <FlagRow
                key={flag.id}
                flag={flag}
                showJsonId={showJsonId}
                deleteConfirmId={deleteConfirmId}
                onToggle={() => toggleMultivariant(flag.id)}
                onEdit={() => setModal({ type: 'multivariant', editing: flag })}
                onShowJson={() =>
                  setShowJsonId(showJsonId === flag.id ? null : flag.id)
                }
                onDeleteClick={() => setDeleteConfirmId(flag.id)}
                onDeleteConfirm={() => handleDelete(flag.id, 'multivariant')}
                onDeleteCancel={() => setDeleteConfirmId(null)}
                jsonData={flag}
                colSpan={7}
                extraCells={
                  <>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded border border-violet-200">
                        {flag.valueType}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                      {flag.value}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {flag.variants.length} variantes
                    </td>
                  </>
                }
              />
            )}
          />
        )}

        {/* Attributes Tab */}
        {activeTab === 'attributes' && (
          <FlagTable
            items={filteredAttr}
            columns={[
              'Nome',
              'Chave',
              'Status',
              'Atributos',
              'Responsável',
              '',
            ]}
            renderRow={(flag) => (
              <FlagRow
                key={flag.id}
                flag={flag}
                showJsonId={showJsonId}
                deleteConfirmId={deleteConfirmId}
                onToggle={() => toggleAttribute(flag.id)}
                onEdit={() => setModal({ type: 'attributes', editing: flag })}
                onShowJson={() =>
                  setShowJsonId(showJsonId === flag.id ? null : flag.id)
                }
                onDeleteClick={() => setDeleteConfirmId(flag.id)}
                onDeleteConfirm={() => handleDelete(flag.id, 'attributes')}
                onDeleteCancel={() => setDeleteConfirmId(null)}
                jsonData={flag}
                extraCells={
                  <>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(flag.attributes)
                          .slice(0, 3)
                          .map(([k, v]) => (
                            <span
                              key={k}
                              className="text-[10px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200"
                            >
                              {k}: {String(v)}
                            </span>
                          ))}

                        {Object.keys(flag.attributes).length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{Object.keys(flag.attributes).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {flag.owner}
                    </td>
                  </>
                }
                colSpan={0}
              />
            )}
          />
        )}
      </section>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <FlagModal
            document={selectedProject}
            modal={modal}
            onClose={() => setModal(null)}
            onSave={(flag) => {
              const next = { ...store }

              if (modal.editing) {
                next.booleanFlags = store.booleanFlags.map((f) =>
                  f.id === flag.id ? flag : f
                )
              } else {
                next.booleanFlags = [...store.booleanFlags, flag]
              }

              persist(next)
              setModal(null)
            }}
          />
        )}

        {modal?.type === 'multivariant' && (
          <MultivariantModal
            editing={modal.editing}
            onClose={() => setModal(null)}
            onSave={(flag) => {
              const next = { ...store }

              if (modal.editing) {
                next.multivariantFlags = store.multivariantFlags.map((f) =>
                  f.id === flag.id ? flag : f
                )
              } else {
                next.multivariantFlags = [...store.multivariantFlags, flag]
              }

              persist(next)
              setModal(null)
            }}
          />
        )}

        {modal?.type === 'attributes' && (
          <AttributeModal
            editing={modal.editing}
            onClose={() => setModal(null)}
            onSave={(flag) => {
              const next = { ...store }

              if (modal.editing) {
                next.attributeFlags = store.attributeFlags.map((f) =>
                  f.id === flag.id ? flag : f
                )
              } else {
                next.attributeFlags = [...store.attributeFlags, flag]
              }

              persist(next)
              setModal(null)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
