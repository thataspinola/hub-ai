
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MoreVertical, Percent, DollarSign, Repeat, Search, X, Trash2, Edit2, Code, Check, AlertCircle, Calendar } from 'lucide-react';
import { PROMOTIONS } from '@/constants/featureops';
import { Promotion } from '@/types/featureops';

const STORAGE_KEY = 'promotions_data';

export const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeTab, setActiveTab] = useState<'Cupons' | 'Descontos Progressivos' | 'Cashback'>('Cupons');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showJsonId, setShowJsonId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({
    name: '',
    code: '',
    duration: '',
    totalDays: '',
    status: 'Agendada',
    roi: '—',
    revenue: '—',
    type: 'percent',
    category: 'Cupons'
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: add default category if missing
        const migrated = parsed.map((p: any) => ({
          ...p,
          category: p.category || 'Cupons'
        }));
        setPromotions(migrated);
      } catch (e) {
        console.error('Error parsing promotions from localStorage', e);
        setPromotions(PROMOTIONS);
      }
    } else {
      setPromotions(PROMOTIONS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (promotions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions));
    }
  }, [promotions]);

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPromotions(promotions.map(p => p.id === editingId ? { ...p, ...newPromo as Promotion } : p));
    } else {
      const promo: Promotion = {
        id: Date.now().toString(),
        name: newPromo.name || 'Nova Campanha',
        code: newPromo.code || 'PROMO' + Date.now().toString().slice(-4),
        duration: newPromo.duration || 'Indefinido',
        totalDays: newPromo.totalDays || '0 dias',
        status: newPromo.status || 'Agendada',
        roi: newPromo.roi || '—',
        revenue: newPromo.revenue || '—',
        type: newPromo.type || 'percent',
        category: newPromo.category || activeTab,
      };
      setPromotions([...promotions, promo]);
    }

    closeModal();
  };

  const openEditModal = (promo: Promotion) => {
    setEditingId(promo.id);
    setNewPromo(promo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewPromo({
      name: '',
      code: '',
      duration: '',
      totalDays: '',
      status: 'Agendada',
      roi: '—',
      revenue: '—',
      type: 'percent',
      category: activeTab
    });
  };

  const handleDeletePromo = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const toggleStatus = (id: string) => {
    setPromotions(promotions.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'Ativa' ? 'Agendada' : 'Ativa' };
      }
      return p;
    }));
  };

  const filteredPromotions = useMemo(() => {
    return promotions.filter(promo => {
      const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           promo.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = promo.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [promotions, searchQuery, activeTab]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'percent': return <Percent size={20} />;
      case 'dollar': return <DollarSign size={20} />;
      case 'exchange': return <Repeat size={20} />;
      default: return <Percent size={20} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'percent': return 'bg-indigo-100 text-indigo-600';
      case 'dollar': return 'bg-amber-100 text-amber-600';
      case 'exchange': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-indigo-100 text-indigo-600';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-8 space-y-8 bg-slate-50 overflow-y-auto"
    >
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gerenciamento de Promoções</h1>
          <p className="text-sm text-slate-500 mt-1">Crie e gerencie suas campanhas de marketing</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="text-slate-400 hover:text-slate-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            Resetar Padrões
          </button>
          
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-64"
              >
                <p className="text-xs font-bold text-slate-900 mb-3">Resetar todas as promoções?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 border border-slate-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      setPromotions(PROMOTIONS);
                      localStorage.setItem(STORAGE_KEY, JSON.stringify(PROMOTIONS));
                      setShowResetConfirm(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm"
                  >
                    Confirmar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Criar Nova Campanha
          </button>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <nav className="flex border-b border-slate-200 gap-8 flex-1">
          {(['Cupons', 'Descontos Progressivos', 'Cashback'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
          ))}
        </nav>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar promoções..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm bg-white"
          />
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome da Campanha</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Duração</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Métricas de ROI</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredPromotions.map((promo) => (
                  <React.Fragment key={promo.id}>
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50 transition-colors group relative"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${getIconColor(promo.type)}`}>
                            {getIcon(promo.type)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{promo.name}</div>
                            <div className="text-xs text-slate-400 font-medium">Código: {promo.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-700">{promo.duration}</div>
                        <div className="text-xs text-slate-400">{promo.totalDays}</div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button 
                          onClick={() => toggleStatus(promo.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            promo.status === 'Ativa' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {promo.status}
                        </button>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{promo.roi}</span>
                          <span className="text-xs text-slate-400">{promo.revenue !== '—' ? `Receita: ${promo.revenue}` : '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setShowJsonId(showJsonId === promo.id ? null : promo.id)}
                            className={`p-1.5 rounded-md transition-colors ${showJsonId === promo.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`}
                            title="Ver JSON"
                          >
                            <Code size={16} />
                          </button>
                          <button 
                            onClick={() => openEditModal(promo)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-bold"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(promo.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <AnimatePresence>
                          {deleteConfirmId === promo.id && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="absolute right-0 top-0 bottom-0 z-10 bg-white border-l border-slate-200 flex items-center gap-3 px-4 shadow-xl"
                            >
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Excluir?</p>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="p-1 text-slate-400 hover:text-slate-600"
                                >
                                  <X size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeletePromo(promo.id)}
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
                    {showJsonId === promo.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={5} className="px-6 py-4 bg-slate-900">
                          <pre className="text-[11px] text-indigo-300 font-mono overflow-x-auto custom-scrollbar p-2">
                            {JSON.stringify(promo, null, 2)}
                          </pre>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
              {filteredPromotions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle size={40} strokeWidth={1.5} />
                      <p className="font-medium">Nenhuma promoção encontrada</p>
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
                  {editingId ? 'Editar Campanha' : 'Nova Campanha'}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSavePromo} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Campanha</label>
                    <input 
                      required
                      type="text" 
                      value={newPromo.name}
                      onChange={e => setNewPromo({...newPromo, name: e.target.value})}
                      placeholder="Ex: Black Friday 2024"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Código</label>
                    <input 
                      required
                      type="text" 
                      value={newPromo.code}
                      onChange={e => setNewPromo({...newPromo, code: e.target.value})}
                      placeholder="Ex: BLACK20"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duração (Texto)</label>
                    <input 
                      required
                      type="text" 
                      value={newPromo.duration}
                      onChange={e => setNewPromo({...newPromo, duration: e.target.value})}
                      placeholder="Ex: 15 Nov - 30 Nov"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Dias</label>
                    <input 
                      required
                      type="text" 
                      value={newPromo.totalDays}
                      onChange={e => setNewPromo({...newPromo, totalDays: e.target.value})}
                      placeholder="Ex: 15 dias"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Desconto</label>
                    <select 
                      value={newPromo.type}
                      onChange={e => setNewPromo({...newPromo, type: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    >
                      <option value="percent">Porcentagem (%)</option>
                      <option value="dollar">Valor Fixo ($)</option>
                      <option value="exchange">Troca/Cashback</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categoria</label>
                    <select 
                      value={newPromo.category}
                      onChange={e => setNewPromo({...newPromo, category: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    >
                      <option value="Cupons">Cupons</option>
                      <option value="Descontos Progressivos">Descontos Progressivos</option>
                      <option value="Cashback">Cashback</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Inicial</label>
                    <select 
                      value={newPromo.status}
                      onChange={e => setNewPromo({...newPromo, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    >
                      <option value="Ativa">Ativa</option>
                      <option value="Agendada">Agendada</option>
                    </select>
                  </div>
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
                    {editingId ? 'Salvar Alterações' : 'Criar Campanha'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
