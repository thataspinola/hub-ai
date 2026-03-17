"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Bell, Plus, TrendingUp, Users, Percent, Activity, ChevronRight } from 'lucide-react';
import { FEATURE_FLAGS, PILOT_PROGRAMS, SYSTEM_EVENTS } from '@/constants/featureops';

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-sm font-medium text-slate-500">Programas Piloto</p>
            <Users size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">8</h3>
            <span className="text-slate-400 text-xs font-medium">3 Agendados</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500">Conversão de Promo</p>
            <Percent size={16} className="text-indigo-500" />
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-slate-900">4.2%</h3>
            <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-1 rounded">Meta: 3.5%</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feature Flags Table */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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

        {/* Pilot Status */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Status do Programa Piloto</h3>
          <div className="space-y-6">
            {PILOT_PROGRAMS.map((pilot) => (
              <div key={pilot.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">{pilot.title}</span>
                  <span className="text-slate-400">{pilot.progress}% Concluído</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${pilot.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${pilot.progress > 50 ? 'bg-indigo-600' : 'bg-amber-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Gerenciar Pilotos
          </button>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Promotion Performance */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Desempenho Recente de Promoções</h3>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-slate-500">Venda de Verão 2023</p>
              <p className="text-2xl font-bold">12.480 <span className="text-sm font-normal text-slate-400">Cliques</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Dias Ativos</p>
              <p className="text-2xl font-bold">14 / 30</p>
            </div>
          </div>
          <div className="h-40 flex items-end gap-2 px-2">
            {[40, 60, 75, 100, 80, 90, 75, 50, 65, 100].map((height, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`flex-1 rounded-t-md transition-colors cursor-pointer ${
                  i === 9 ? 'bg-indigo-600' : 
                  i > 7 ? 'bg-indigo-400' :
                  i > 4 ? 'bg-indigo-300' : 'bg-indigo-100'
                } hover:bg-indigo-500`}
                title={`Dia ${i + 1}: ${height}%`}
              />
            ))}
          </div>
        </section>

        {/* System Health Logs */}
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
      </div>
    </motion.div>
  );
};
