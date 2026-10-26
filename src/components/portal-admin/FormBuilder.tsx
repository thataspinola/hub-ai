'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Type,
  ChevronDown,
  CheckSquare,
  Upload,
  Calendar,
  GripVertical,
  Trash2,
  Settings,
  Eye,
  Database,
  Layers,
  Info,
  Plus,
} from 'lucide-react'

export const FormBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('properties')

  const elements = [
    { id: 'text', label: 'Entrada de Texto', icon: Type, category: 'Básicos' },
    {
      id: 'select',
      label: 'Menu Suspenso',
      icon: ChevronDown,
      category: 'Básicos',
    },
    {
      id: 'checkbox',
      label: 'Caixa de Seleção',
      icon: CheckSquare,
      category: 'Básicos',
    },
    {
      id: 'upload',
      label: 'Envio de Arquivo',
      icon: Upload,
      category: 'Avançados',
    },
    {
      id: 'date',
      label: 'Seletor de Data',
      icon: Calendar,
      category: 'Avançados',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex overflow-hidden bg-slate-50"
    >
      {/* Left Sidebar: Elements */}
      <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto p-6 flex flex-col gap-8 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
            Elementos Básicos
          </h3>
          <div className="space-y-3">
            {elements
              .filter((e) => e.category === 'Básicos')
              .map((el) => (
                <div
                  key={el.id}
                  draggable
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-grab hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm"
                >
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <el.icon
                      size={18}
                      className="text-slate-500 group-hover:text-indigo-600"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {el.label}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
            Elementos Avançados
          </h3>
          <div className="space-y-3">
            {elements
              .filter((e) => e.category === 'Avançados')
              .map((el) => (
                <div
                  key={el.id}
                  draggable
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-grab hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm"
                >
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <el.icon
                      size={18}
                      className="text-slate-500 group-hover:text-indigo-600"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {el.label}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-auto p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="flex gap-2">
            <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-indigo-700 font-bold mb-1">
                Dica Profissional:
              </p>
              <p className="text-[10px] text-indigo-600 leading-relaxed">
                Arraste os elementos diretamente para a tela para começar a
                construir seu formulário.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <section className="flex-1 overflow-y-auto p-12 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="max-w-2xl mx-auto bg-white min-h-[800px] shadow-2xl shadow-slate-200/50 rounded-3xl border border-slate-200 p-12 flex flex-col">
          {/* Form Header */}
          <div className="mb-12 pb-10 border-b border-slate-100">
            <input
              className="text-4xl font-black text-slate-900 border-none focus:ring-0 p-0 w-full mb-4 placeholder-slate-300"
              placeholder="Formulário sem Título"
              defaultValue="Pesquisa de Novo Projeto"
            />
            <textarea
              className="text-slate-500 border-none focus:ring-0 p-0 w-full resize-none text-lg leading-relaxed placeholder-slate-300"
              placeholder="Descreva o propósito deste projeto e como os dados serão utilizados."
              rows={2}
              defaultValue="Descreva o propósito deste projeto e como os dados serão utilizados."
            />
          </div>

          {/* Form Content */}
          <div className="space-y-10 flex-1">
            {/* Field 1 */}
            <div className="group relative p-6 -mx-6 rounded-2xl border-2 border-transparent hover:border-indigo-100 hover:bg-slate-50/50 transition-all">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-tight">
                  Nome do Projeto
                </label>
                <GripVertical
                  size={16}
                  className="text-slate-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <input
                className="w-full rounded-xl border-slate-200 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                placeholder="ex: Lançamento de Marketing Q3"
                type="text"
              />
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
                  <Settings size={16} />
                </button>
                <button className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Field 2 */}
            <div className="group relative p-6 -mx-6 rounded-2xl border-2 border-transparent hover:border-indigo-100 hover:bg-slate-50/50 transition-all">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-tight">
                  Nível de Prioridade
                </label>
                <GripVertical
                  size={16}
                  className="text-slate-300 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="relative">
                <select className="w-full rounded-xl border-slate-200 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none transition-all">
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Crítica</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Empty Dropzone */}
            <div className="border-2 border-dashed border-slate-200 rounded-3xl h-40 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-sm font-bold">
                  Arraste ou clique para adicionar
                </span>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-medium italic">
              O formulário é salvo automaticamente a cada 30s
            </p>
            <button className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
              <Eye size={18} />
              Visualizar
            </button>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Settings */}
      <aside className="w-80 bg-white border-l border-slate-200 overflow-y-auto shrink-0 flex flex-col">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'properties'
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Propriedades
            {activeTab === 'properties' && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('cms')}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'cms'
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Esquema CMS
            {activeTab === 'cms' && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
              />
            )}
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Rótulo do Campo
            </label>
            <input
              className="w-full rounded-xl border-slate-200 text-sm font-bold py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
              type="text"
              defaultValue="Nome do Projeto"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Texto de Ajuda
            </label>
            <textarea
              className="w-full rounded-xl border-slate-200 text-sm font-medium py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              placeholder="Pequena descrição abaixo do campo"
              defaultValue="Pequena descrição abaixo do campo"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Validação
            </label>
            <div className="space-y-4 mt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-sm text-slate-700 font-bold group-hover:text-indigo-600 transition-colors">
                  Campo obrigatório
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-sm text-slate-700 font-bold group-hover:text-indigo-600 transition-colors">
                  Somente entradas únicas
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Database size={12} />
              Integração CMS
            </h4>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Mapear para Tabela
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black rounded-full uppercase">
                  Vinculado
                </span>
              </div>
              <div className="relative">
                <select className="w-full text-xs font-bold rounded-lg border-slate-200 bg-white py-2 px-3 appearance-none outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>column_project_name</option>
                  <option>column_description</option>
                  <option>Criar nova coluna...</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-8">
          <button className="w-full py-3.5 px-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
            <Layers size={16} />
            Configurações Globais
          </button>
        </div>
      </aside>
    </motion.div>
  )
}
