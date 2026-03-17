"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Globe, CreditCard, Plus, ChevronRight, X, Trash2, Code } from 'lucide-react';
import { PILOT_PROGRAMS } from '@/constants/featureops';
import { PilotProgram } from '@/types/featureops';

const STORAGE_KEY = 'pilot_programs_data';

export const PilotPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<PilotProgram[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showJsonId, setShowJsonId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<Partial<PilotProgram>>({
    title: '',
    description: '',
    type: 'Grupo de Usuários',
    userCount: '0 Usuários',
    progress: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setPrograms(JSON.parse(saved)); }
      catch { setPrograms(PILOT_PROGRAMS); }
    } else { setPrograms(PILOT_PROGRAMS); }
  }, []);

  useEffect(() => {
    if (programs.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    const isDefaultCount = !newProgram.userCount || newProgram.userCount === '0 Usuários' || newProgram.userCount === '0 Regiões' || newProgram.userCount === '0 Contas';
    if (isDefaultCount) {
      switch (newProgram.type) {
        case 'Regional': setNewProgram(prev => ({ ...prev, userCount: '0 Regiões' })); break;
        case 'Receita': setNewProgram(prev => ({ ...prev, userCount: '0 Contas' })); break;
        default: setNewProgram(prev => ({ ...prev, userCount: '0 Usuários' }));
      }
    }
  }, [newProgram.type, newProgram.userCount]);

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPrograms(programs.map(p => p.id === editingId ? { ...p, ...newProgram as PilotProgram } : p));
    } else {
      const program: PilotProgram = { id: Date.now().toString(), title: newProgram.title || 'Novo Programa', description: newProgram.description || '', type: newProgram.type || 'Grupo de Usuários', userCount: newProgram.userCount || '0 Usuários', progress: newProgram.progress || 0 };
      setPrograms([...programs, program]);
    }
    closeModal();
  };

  const openEditModal = (program: PilotProgram) => { setEditingId(program.id); setNewProgram(program); setIsModalOpen(true); };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setNewProgram({ title: '', description: '', type: 'Grupo de Usuários', userCount: '0 Usuários', progress: 0 }); };

  const handleDeleteProgram = (id: string) => { setPrograms(programs.filter(p => p.id !== id)); };

  const getIcon = (type: string) => {
    switch (type) { case 'Regional': return <Globe size={20} />; case 'Receita': return <CreditCard size={20} />; default: return <Users size={20} />; }
  };

  const getColorClass = (type: string) => {
    switch (type) { case 'Regional': return 'bg-orange-50 text-orange-700'; case 'Receita': return 'bg-emerald-50 text-emerald-700'; default: return 'bg-indigo-50 text-indigo-700'; }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 p-8 space-y-8 bg-slate-50 overflow-y-auto relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Programas Piloto</h2>
          <p className="text-slate-500 mt-1">Defina segmentos de usuários e regiões para testes de acesso antecipado.</p>
        </div>
        <button onClick={() => { closeModal(); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <Plus size={16} />Criar Novo Segmento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {programs.map((pilot) => (
            <motion.div key={pilot.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
              <button onClick={() => setDeleteConfirmId(pilot.id)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
              <AnimatePresence>
                {deleteConfirmId === pilot.id && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                    <p className="text-sm font-bold text-slate-900 mb-4">Excluir este programa?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancelar</button>
                      <button onClick={() => { handleDeleteProgram(pilot.id); setDeleteConfirmId(null); }} className="px-4 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Excluir</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${getColorClass(pilot.type)}`}>{getIcon(pilot.type)}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowJsonId(showJsonId === pilot.id ? null : pilot.id)} className={`p-1.5 rounded-md transition-colors ${showJsonId === pilot.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`} title="Ver contrato JSON"><Code size={14} /></button>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${getColorClass(pilot.type)}`}>{pilot.type}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{pilot.title}</h3>
              <AnimatePresence mode="wait">
                {showJsonId === pilot.id ? (
                  <motion.div key="json" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
                    <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
                      <pre className="text-[10px] text-indigo-300 font-mono overflow-x-auto custom-scrollbar max-h-32">{JSON.stringify(pilot, null, 2)}</pre>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-slate-500 leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">{pilot.description}</motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider"><span>Progresso da Rollout</span><span>{pilot.progress}%</span></div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pilot.progress}%` }} className={`h-full rounded-full ${pilot.progress > 50 ? 'bg-indigo-500' : 'bg-orange-500'}`} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
                <div className="text-sm text-slate-600 font-bold">{pilot.userCount}</div>
                <button onClick={() => openEditModal(pilot)} className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">Editar Regras <ChevronRight size={14} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors"><Plus size={24} /></div>
          <span className="font-bold">Novo Programa</span>
          <p className="text-xs mt-1">Defina um novo público alvo</p>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Editar Programa Piloto' : 'Novo Programa Piloto'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveProgram} className="space-y-6">
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Título</label><input required type="text" value={newProgram.title} onChange={e => setNewProgram({...newProgram, title: e.target.value})} placeholder="Ex: Alpha Interno" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</label><textarea required value={newProgram.description} onChange={e => setNewProgram({...newProgram, description: e.target.value})} placeholder="Descreva o público alvo..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-24 resize-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</label><select value={newProgram.type} onChange={e => setNewProgram({...newProgram, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"><option value="Grupo de Usuários">Usuários</option><option value="Regional">Regional</option><option value="Receita">Receita</option></select></div>
                  <div className="space-y-2"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contagem</label><input type="text" value={newProgram.userCount} onChange={e => setNewProgram({...newProgram, userCount: e.target.value})} placeholder="Ex: 100 Usuários" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" /></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progresso Inicial</label><span className="text-xs font-bold text-indigo-600">{newProgram.progress}%</span></div>
                  <input type="range" min="0" max="100" value={newProgram.progress} onChange={e => setNewProgram({...newProgram, progress: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4">{editingId ? 'Salvar Alterações' : 'Criar Programa'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
