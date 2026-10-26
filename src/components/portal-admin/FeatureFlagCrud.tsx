'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
  ToggleLeft,
  Layers,
  Settings2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import type {
  BooleanFlag,
  MultivariantFlag,
  AttributeFlag,
  FlagStore,
  FlagCrudStorage,
} from '@/lib/feature-flags/crud-storage'
import {
  LocalStorageCrudStorage,
  SEED_STORE,
  syncProviderStorage,
  createBooleanFlag,
  createMultivariantFlag,
  createAttributeFlag,
} from '@/lib/feature-flags/crud-storage'
import { useHydrated } from '@/lib/use-hydrated'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = 'boolean' | 'multivariant' | 'attributes'

type ModalMode =
  | { type: 'boolean'; editing: BooleanFlag | null }
  | { type: 'multivariant'; editing: MultivariantFlag | null }
  | { type: 'attributes'; editing: AttributeFlag | null }
  | null

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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

  const [store, setStore] = useState<FlagStore>(() => storage.load())
  const [activeTab, setActiveTab] = useState<Tab>('boolean')
  const [searchQuery, setSearchQuery] = useState('')

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')

  const [modal, setModal] = useState<ModalMode>(null)
  const [showJsonId, setShowJsonId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // ── Load / persist ────────────────────────────────────

  const [clock, setClock] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setClock(Date.now()), 60000)
    return () => clearInterval(interval)
  }, [])

  const persist = useCallback(
    (next: FlagStore) => {
      setStore(next)
      storage.save(next)
      syncProviderStorage(next)
    },
    [storage]
  )

  // ── Filtering ─────────────────────────────────────────

  const matchesFilter = useCallback(
    (flag: { key: string; name: string; enabled: boolean }) => {
      const q = searchQuery.toLowerCase()

      const matchSearch =
        !q ||
        flag.name.toLowerCase().includes(q) ||
        flag.key.toLowerCase().includes(q)

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && flag.enabled) ||
        (statusFilter === 'inactive' && !flag.enabled)

      return matchSearch && matchStatus
    },
    [searchQuery, statusFilter]
  )

  const filteredBoolean = useMemo(
    () => store.booleanFlags.filter(matchesFilter),
    [store.booleanFlags, matchesFilter]
  )

  const filteredMulti = useMemo(
    () => store.multivariantFlags.filter(matchesFilter),
    [store.multivariantFlags, matchesFilter]
  )

  const filteredAttr = useMemo(
    () => store.attributeFlags.filter(matchesFilter),
    [store.attributeFlags, matchesFilter]
  )

  // ── Toggle ────────────────────────────────────────────

  function toggleBoolean(id: string) {
    persist({
      ...store,
      booleanFlags: store.booleanFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f
      ),
    })
  }

  function toggleMulti(id: string) {
    persist({
      ...store,
      multivariantFlags: store.multivariantFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f
      ),
    })
  }

  function toggleAttr(id: string) {
    persist({
      ...store,
      attributeFlags: store.attributeFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f
      ),
    })
  }

  // ── Delete ────────────────────────────────────────────

  function handleDelete(id: string, tab: Tab) {
    const next = { ...store }

    if (tab === 'boolean')
      next.booleanFlags = store.booleanFlags.filter((f) => f.id !== id)
    else if (tab === 'multivariant')
      next.multivariantFlags = store.multivariantFlags.filter(
        (f) => f.id !== id
      )
    else next.attributeFlags = store.attributeFlags.filter((f) => f.id !== id)

    persist(next)
    setDeleteConfirmId(null)
  }

  // ── Tabs config ───────────────────────────────────────

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

  // ── Time helper ───────────────────────────────────────

  function relativeTime(iso: string) {
    const diff = clock - new Date(iso).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atrás`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`
    const days = Math.floor(hours / 24)
    return `${days}d atrás`
  }

  // ── Render ────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 p-8 space-y-8 bg-slate-50 overflow-y-auto"
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
                onToggle={() => toggleMulti(flag.id)}
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
                onToggle={() => toggleAttr(flag.id)}
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
              />
            )}
          />
        )}
      </section>

      {/* Modals */}
      <AnimatePresence>
        {modal?.type === 'boolean' && (
          <BooleanModal
            editing={modal.editing}
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

// ===========================================================================
// Tab help content
// ===========================================================================

const TAB_HELP: Record<
  Tab,
  {
    title: string
    description: string
    howItWorks: string
    useCases: { title: string; description: string }[]
    codeExample: string
  }
> = {
  boolean: {
    title: 'Flags Booleanas',
    description:
      'A forma mais simples de feature flag: ligado ou desligado. Ideal para controle binário de funcionalidades.',
    howItWorks:
      'Uma flag booleana possui apenas dois estados: ativada (true) ou desativada (false). Quando ativada, a funcionalidade associada é exibida ou executada. Quando desativada, o comportamento padrão (ou nenhum) é mantido. No código, basta verificar o estado com isEnabled() no servidor ou useIsEnabled() no cliente.',
    useCases: [
      {
        title: 'Kill Switch',
        description:
          'Desativar uma funcionalidade problemática instantaneamente sem necessidade de rollback ou novo deploy.',
      },
      {
        title: 'Lançamento Gradual',
        description:
          'Habilitar uma feature para teste interno antes de liberar para todos os usuários.',
      },
      {
        title: 'Modo Manutenção',
        description:
          'Colocar o sistema inteiro ou módulos específicos em modo de manutenção.',
      },
      {
        title: 'Feature Gate',
        description:
          'Esconder uma funcionalidade em desenvolvimento que já foi deployed mas não está pronta para uso.',
      },
    ],
    codeExample: `// Server-side (RSC)
const showCheckout = await isEnabled('new_checkout_v2');
return showCheckout ? <NewCheckout /> : <LegacyCheckout />;

// Client-side (Hook)
const showCheckout = useIsEnabled('new_checkout_v2');`,
  },
  multivariant: {
    title: 'Flags Multivariantes',
    description:
      'Retornam valores dinâmicos (string, number ou JSON) ao invés de apenas true/false. Ideais para testes A/B e configurações ajustáveis.',
    howItWorks:
      'Uma flag multivariante possui um valor atual e uma lista de variantes possíveis com pesos de distribuição. O tipo do valor pode ser string, number ou JSON. No código, use getFlagValue<T>() no servidor ou useFlagValue<T>() no cliente para obter o valor tipado com um fallback seguro.',
    useCases: [
      {
        title: 'Teste A/B',
        description:
          'Distribuir usuários entre variantes ("controle" vs "tratamento") com pesos configuráveis (50%/50%).',
      },
      {
        title: 'Tema Visual',
        description:
          'Alternar entre temas (light, dark, auto) sem deploy, controlando a variante ativa.',
      },
      {
        title: 'Limites Configuráveis',
        description:
          'Ajustar rate limits, número máximo de itens, timeouts — tudo via flag numérica.',
      },
      {
        title: 'Configuração JSON',
        description:
          'Passar objetos de configuração complexos (ex: { theme: "dark", density: "compact" }) como valor da flag.',
      },
    ],
    codeExample: `// Server-side (RSC)
const theme = await getFlagValue<string>('ui_theme', 'light');
const limit = await getFlagValue<number>('rate_limit', 100);

// Client-side (Hook)
const theme = useFlagValue<string>('ui_theme', 'light');`,
  },
  attributes: {
    title: 'Flags com Atributos',
    description:
      'Carregam metadados e configurações adicionais em pares chave-valor. Ideais para features com múltiplos parâmetros configuráveis.',
    howItWorks:
      'Uma flag com atributos possui um estado habilitado/desabilitado e um mapa de atributos (chave → valor). Os valores são auto-detectados como string, number ou boolean. No código, use getFlagAttributes() no servidor ou useFlagAttributes() no cliente para obter todos os atributos como um objeto.',
    useCases: [
      {
        title: 'Motor de ML',
        description:
          'Configurar modelo, número máximo de resultados, grupo de teste e percentual de rollout — tudo vinculado a uma flag.',
      },
      {
        title: 'Regras de Negócio',
        description:
          'Definir múltiplos parâmetros de uma regra (desconto máximo, prazo, segmento) em uma única flag.',
      },
      {
        title: 'Integração Externa',
        description:
          'Armazenar endpoint, timeout, retry count e API version como atributos de uma flag de integração.',
      },
      {
        title: 'Rollout Detalhado',
        description:
          'Combinar percentual de rollout, região, plano do usuário e outros critérios como atributos da flag.',
      },
    ],
    codeExample: `// Server-side (RSC)
const config = await getFlagAttributes('ml_rec_engine');
// → { rolloutPercentage: 50, model: "v3", maxResults: 12 }

// Client-side (Hook)
const config = useFlagAttributes('ml_rec_engine');`,
  },
}

function TabHelpContent({ tab, onClose }: { tab: Tab; onClose: () => void }) {
  const help = TAB_HELP[tab]

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{help.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{help.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Como funciona */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Como funciona
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {help.howItWorks}
          </p>
        </div>

        {/* Casos de uso */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Casos de Uso
          </h4>
          <ul className="space-y-2">
            {help.useCases.map((uc, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div>
                  <span className="text-sm font-semibold text-slate-700">
                    {uc.title}
                  </span>
                  <span className="text-sm text-slate-500">
                    {' '}
                    — {uc.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Exemplo de código */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Exemplo de Código
          </h4>
          <pre className="p-3 bg-slate-900 text-[11px] text-indigo-300 font-mono rounded-lg overflow-x-auto leading-relaxed">
            {help.codeExample}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Shared sub-components
// ===========================================================================

function FlagTable<T extends { id: string }>({
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

function FlagRow({
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

// ===========================================================================
// Modal shell
// ===========================================================================

function ModalShell({
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
              className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function Field({
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

function TextInput({
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

function EnabledToggle({
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

// ===========================================================================
// Boolean Modal
// ===========================================================================

function BooleanModal({
  editing,
  onClose,
  onSave,
}: {
  editing: BooleanFlag | null
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
      <EnabledToggle enabled={enabled} onToggle={() => setEnabled(!enabled)} />
    </ModalShell>
  )
}

// ===========================================================================
// Multivariant Modal
// ===========================================================================

function MultivariantModal({
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
    editing?.valueType ?? 'string'
  )
  const [value, setValue] = useState(editing?.value ?? '')
  const [variants, setVariants] = useState(
    editing?.variants ?? [{ label: '', value: '', weight: 100 }]
  )

  const addVariant = () =>
    setVariants([...variants, { label: '', value: '', weight: 0 }])
  const removeVariant = (i: number) =>
    setVariants(variants.filter((_, idx) => idx !== i))
  const updateVariant = (i: number, field: string, val: string | number) => {
    setVariants(
      variants.map((v, idx) => (idx === i ? { ...v, [field]: val } : v))
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
        })
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

// ===========================================================================
// Attribute Modal
// ===========================================================================

function AttributeModal({
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
        })
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
