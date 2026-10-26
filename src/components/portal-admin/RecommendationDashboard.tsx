'use client'

import { useState, useEffect } from 'react'
import { useRecommendationStore } from '@/lib/recommendations/store'
import { Badge } from '@/components/ui/badge'
import { Loader2, Package, Settings2, FileJson2 } from 'lucide-react'
import { motion } from 'motion/react'
import { RecommendationCatalog } from './RecommendationCatalog'
import { RecommendationRules } from './RecommendationRules'
import { RecommendationImportExport } from './RecommendationImportExport'
import { Toaster } from '@/components/ui/sonner'

export function RecommendationDashboard() {
  const { data, isLoading, loadFromStorage } = useRecommendationStore()
  const [activeTab, setActiveTab] = useState('catalog')

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const stats = {
    products: data.catalog.products.length,
    categories: data.catalog.categories.length,
    rules:
      Object.keys(
        data.recommendationRules.types.affinity_manual.maps.byCategory
      ).length +
      Object.keys(data.recommendationRules.types.affinity_manual.maps.byUrl)
        .length,
    slots: Object.keys(data.recommendationRules.types.context_slot.slots)
      .length,
  }

  const tabs = [
    { id: 'catalog', label: 'Catálogo', icon: Package, badge: stats.products },
    { id: 'rules', label: 'Regras', icon: Settings2, badge: stats.rules },
    {
      id: 'import-export',
      label: 'Importar/Exportar',
      icon: FileJson2,
      badge: null,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-slate-500">Carregando dados de recomendações...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8 overflow-y-auto flex-1"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Recomendações</h1>
        <p className="text-slate-500 mt-1">
          Gestão de catálogo e regras de recomendação de produtos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-500">Produtos</p>
          <p className="text-2xl font-bold text-slate-800">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-500">Categorias</p>
          <p className="text-2xl font-bold text-slate-800">
            {stats.categories}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-500">Regras de Afinidade</p>
          <p className="text-2xl font-bold text-slate-800">{stats.rules}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-sm text-slate-500">Slots</p>
          <p className="text-2xl font-bold text-slate-800">{stats.slots}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-4">
          <nav className="flex gap-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge !== null && (
                    <Badge
                      variant={isActive ? 'default' : 'secondary'}
                      className={`text-xs ${isActive ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' : ''}`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'catalog' && <RecommendationCatalog />}
          {activeTab === 'rules' && <RecommendationRules />}
          {activeTab === 'import-export' && <RecommendationImportExport />}
        </div>
      </div>

      <Toaster position="bottom-right" />
    </motion.div>
  )
}
