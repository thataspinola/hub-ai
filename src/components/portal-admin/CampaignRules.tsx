"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Link as LinkIcon, 
  TrendingUp, 
  Megaphone, 
  Layers, 
  History, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Rule {
  id: string;
  type: string;
  value: string;
  weight: number;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
  isExpanded: boolean;
}

export const CampaignRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Campanha');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'teste',
      description: '',
      isExpanded: true,
      rules: [
        { id: 'r1', type: 'URL', value: 'Conserto de fogão', weight: 80 }
      ]
    }
  ]);

  const tabs = [
    { id: 'Padrões', icon: Settings },
    { id: 'Afinidade Manual', icon: LinkIcon },
    { id: 'Popularidade', icon: TrendingUp },
    { id: 'Campanha', icon: Megaphone },
    { id: 'Slots de Contexto', icon: Layers },
    { id: 'Histórico', icon: History },
  ];

  const toggleExpand = (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, isExpanded: !c.isExpanded } : c
    ));
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Sub-navigation Tabs */}
      <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 w-fit shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={16} />
                {tab.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Campanhas de Recomendacao</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Configure recomendacoes personalizadas por campanha (utm_campaign). O ID da campanha será capturado automaticamente da URL ou pode ser definido manualmente no script.
                </p>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                <Plus size={18} />
                Nova Campanha
              </button>
            </div>

            <div className="p-6 space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleExpand(campaign.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                        {campaign.name}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        ({campaign.rules.length} regra{campaign.rules.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                    {campaign.isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>

                  <AnimatePresence>
                    {campaign.isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                              <input 
                                type="text"
                                placeholder="Descricao da campanha..."
                                className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
                              />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                              <Plus size={16} />
                              Adicionar Regra
                            </button>
                            <button className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {campaign.rules.map((rule) => (
                              <div key={rule.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                                <div className="flex items-center gap-4">
                                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    {rule.type}
                                  </span>
                                  <span className="text-sm font-medium text-slate-700 px-3 py-1 bg-orange-100 text-orange-800 rounded-lg">
                                    {rule.value}
                                  </span>
                                  <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">peso:</span>
                                    <span className="text-sm font-bold text-slate-700">{rule.weight}</span>
                                  </div>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
