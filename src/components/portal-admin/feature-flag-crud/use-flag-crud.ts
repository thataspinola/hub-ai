'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  FlagStore,
  FlagCrudStorage,
} from '@/lib/feature-flags/crud-storage'
import type { Tab, ModalMode } from './types'

export function useFlagCrud(
  storage: FlagCrudStorage,
  syncProviderStorage: (store: FlagStore) => void,
) {
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
    [storage, syncProviderStorage],
  )

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
    [searchQuery, statusFilter],
  )

  const filteredBoolean = useMemo(
    () => store.booleanFlags.filter(matchesFilter),
    [store.booleanFlags, matchesFilter],
  )

  const filteredMulti = useMemo(
    () => store.multivariantFlags.filter(matchesFilter),
    [store.multivariantFlags, matchesFilter],
  )

  const filteredAttr = useMemo(
    () => store.attributeFlags.filter(matchesFilter),
    [store.attributeFlags, matchesFilter],
  )

  function toggleBoolean(id: string) {
    persist({
      ...store,
      booleanFlags: store.booleanFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f,
      ),
    })
  }

  function toggleMulti(id: string) {
    persist({
      ...store,
      multivariantFlags: store.multivariantFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f,
      ),
    })
  }

  function toggleAttr(id: string) {
    persist({
      ...store,
      attributeFlags: store.attributeFlags.map((f) =>
        f.id === id
          ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() }
          : f,
      ),
    })
  }

  function handleDelete(id: string, tab: Tab) {
    const next = { ...store }

    if (tab === 'boolean')
      next.booleanFlags = store.booleanFlags.filter((f) => f.id !== id)
    else if (tab === 'multivariant')
      next.multivariantFlags = store.multivariantFlags.filter(
        (f) => f.id !== id,
      )
    else next.attributeFlags = store.attributeFlags.filter((f) => f.id !== id)

    persist(next)
    setDeleteConfirmId(null)
  }

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

  return {
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
    toggleMulti,
    toggleAttr,
    handleDelete,
    relativeTime,
  }
}
