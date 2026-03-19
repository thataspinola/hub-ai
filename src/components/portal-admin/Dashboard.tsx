"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Bell, Plus, TrendingUp, Activity, ChevronRight } from 'lucide-react';
import { FEATURE_FLAGS, SYSTEM_EVENTS } from '@/constants/featureops';

export const Dashboard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50"
    >
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Visão Geral do Aplicativo</h2>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200">
            <Plus size={18} />
            Nova Flag
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Flags Ativas</p>
            <TrendingUp size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">24</h3>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">+2 esta semana</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Saúde do Sistema</p>
            <Activity size={16} className="text-green-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <h3 className="text-xl font-bold text-slate-900">Operacional</h3>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Flags de Recursos Críticos</h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
              Ver Todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Nome da Flag</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Tráfego</th>
                  <th className="px-6 py-3">Proprietário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FEATURE_FLAGS.map((flag) => (
                  <tr key={flag.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{flag.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        flag.status === 'Ativado' ? 'bg-green-100 text-green-800' :
                        flag.status === 'Apenas Interno' ? 'bg-amber-100 text-amber-800' :
                        'bg-indigo-100 text-indigo-800'
                      }`}>
                        {flag.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{flag.traffic}</td>
                    <td className="px-6 py-4 text-slate-500">{flag.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Saúde do Sistema e Eventos</h3>
          <div className="space-y-6">
            {SYSTEM_EVENTS.map((event) => (
              <div key={event.id} className="flex gap-4 group">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  event.type === 'success' ? 'bg-green-50 text-green-500' :
                  event.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                  'bg-indigo-50 text-indigo-500'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    event.type === 'success' ? 'bg-green-500' :
                    event.type === 'warning' ? 'bg-amber-500' :
                    'bg-indigo-500'
                  } group-hover:scale-125 transition-transform`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
    </motion.div>
  );
};
