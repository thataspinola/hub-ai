"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, Info, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const RulesConfig: React.FC = () => {
  const [settings, setSettings] = useState({
    title: 'Recomendacoes',
    layout: 'Grid',
    limit: '24',
    maxWidth: '1336px',
    ctaText: 'Saiba mais',
    anchorMode: 'Append (dentro)',
    contextUrl: '',
    campaign: 'teste'
  });

  const [appliedCampaign, setAppliedCampaign] = useState('teste');
  const [isApplying, setIsApplying] = useState(false);
  const [copied, setCopied] = useState(false);

  const scriptCode = `<script
  async
  src="https://vm-rgin72pgpilsapelfmjd48.vusercontent.net/sdk/widget.js"
  data-reco-instance="1.0.0"
  data-reco-engine="https://vm-rgin72pgpilsapelfmjd48.vusercontent.net/sdk/engine.js"
  data-reco-data="blob:https://vm-rgin72pgpilsapelfmjd48.vusercontent.net/647d9a76-573e-4941-9dd4-a0b050b42b9e"
  data-reco-slot="pdp_related"
  data-reco-anchor="#recommendations-container"
  data-reco-anchor-mode="${settings.anchorMode.toLowerCase().includes('append') ? 'append' : 'replace'}"
  data-reco-limit="${settings.limit}"
  data-reco-title="${settings.title}"
  data-reco-layout="${settings.layout.toLowerCase()}"
  data-reco-cta-text="${settings.ctaText}"
  data-reco-max-width="${settings.maxWidth}"
  data-reco-campaign="${settings.campaign}"
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setIsApplying(true);
    // Simulate API call/processing
    setTimeout(() => {
      setAppliedCampaign(settings.campaign);
      setIsApplying(false);
    }, 800);
  };

  const handleClear = (field: 'campaign' | 'contextUrl') => {
    setSettings({ ...settings, [field]: '' });
    if (field === 'campaign') setAppliedCampaign('');
  };

  const allRecommendations = [
    { id: 1, title: 'Conserto de fogão', category: 'CONSERTO E MANUTENÇÃO', image: 'https://picsum.photos/seed/stove/400/300' },
    { id: 2, title: 'Conserto de eletrodomésticos', category: 'CONSERTO E MANUTENÇÃO', image: 'https://picsum.photos/seed/appliance/400/300' },
    { id: 3, title: 'Eletricista', category: 'CONSERTO E MANUTENÇÃO', image: 'https://picsum.photos/seed/electrician/400/300' },
    { id: 4, title: 'Limpeza de Ar Condicionado', category: 'MANUTENÇÃO', image: 'https://picsum.photos/seed/ac/400/300' },
    { id: 5, title: 'Instalação de Chuveiro', category: 'ELÉTRICA', image: 'https://picsum.photos/seed/shower/400/300' },
    { id: 6, title: 'Pintura Residencial', category: 'REFORMA', image: 'https://picsum.photos/seed/paint/400/300' },
  ];

  // Simple logic to "change" recommendations based on campaign name
  const getDisplayRecommendations = () => {
    let list = [...allRecommendations];
    if (appliedCampaign.toLowerCase().includes('promo')) {
      list = list.reverse();
    } else if (appliedCampaign.length > 5) {
      list = list.sort((a, b) => a.title.length - b.title.length);
    }
    return list.slice(0, parseInt(settings.limit) || 3);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Script Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-medium text-slate-700">Script para incorporar em seu projeto</h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="p-6 bg-[#1e1e2e] relative group">
            <pre className="text-xs font-mono text-indigo-200 leading-relaxed overflow-x-auto">
              <code>{scriptCode}</code>
            </pre>
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
              <Info className="w-3 h-3" />
              Substitua <span className="bg-slate-200 px-1 rounded">data-reco-data</span> pela URL do seu arquivo JSON de dados hospedado.
            </p>
          </div>
        </div>

        {/* Config Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-6">Configurações do Widget</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Título</label>
                <input 
                  type="text" 
                  value={settings.title}
                  onChange={(e) => setSettings({...settings, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Layout</label>
                <select 
                  value={settings.layout}
                  onChange={(e) => setSettings({...settings, layout: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option>Grid</option>
                  <option>Carousel</option>
                  <option>List</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Limite</label>
                <input 
                  type="number" 
                  value={settings.limit}
                  onChange={(e) => setSettings({...settings, limit: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Max Width</label>
                <input 
                  type="text" 
                  value={settings.maxWidth}
                  onChange={(e) => setSettings({...settings, maxWidth: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">CTA Text</label>
                <input 
                  type="text" 
                  value={settings.ctaText}
                  onChange={(e) => setSettings({...settings, ctaText: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Anchor Mode</label>
                <select 
                  value={settings.anchorMode}
                  onChange={(e) => setSettings({...settings, anchorMode: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option>Append (dentro)</option>
                  <option>Prepend (antes)</option>
                  <option>Replace (substituir)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">URL de Contexto (Afinidade Manual)</h3>
            <p className="text-[10px] text-slate-400 mb-4">Quando definida, as regras de afinidade por URL e categoria usarão esta URL em vez da URL atual da página. Útil para testar recomendações relacionadas a um produto específico ou para uso em sites parceiros.</p>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Ex: /produto/seguro-auto ou https://site.com/produto/xyz"
                value={settings.contextUrl}
                onChange={(e) => setSettings({...settings, contextUrl: e.target.value})}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button 
                onClick={() => handleClear('contextUrl')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Limpar
              </button>
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className="px-4 py-2 text-xs font-medium bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
              >
                {isApplying ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Campanha (utm_campaign)</h3>
            <p className="text-[10px] text-slate-400 mb-4">Defina um ID de campanha para testar as regras de recomendação por campanha. O widget captura automaticamente o utm_campaign da URL e persiste em sessionStorage.</p>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={settings.campaign}
                onChange={(e) => setSettings({...settings, campaign: e.target.value})}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button 
                onClick={() => handleClear('campaign')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Limpar
              </button>
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50"
              >
                {isApplying ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
            <p className="text-[10px] text-orange-500 mt-2">Campanha ativa: As recomendações usarão as regras configuradas para &quot;{appliedCampaign}&quot;</p>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
          {isApplying && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-sm font-medium text-slate-600 text-center">Atualizando recomendações para<br/><span className="font-bold">&quot;{settings.campaign}&quot;</span></span>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{settings.title}</h2>
            <button 
              onClick={handleApply}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isApplying ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className={`grid gap-6 ${
            settings.layout === 'Grid' ? 'grid-cols-1 md:grid-cols-3' : 
            settings.layout === 'List' ? 'grid-cols-1' : 'flex overflow-x-auto pb-4'
          }`}>
            {getDisplayRecommendations().map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border border-slate-100 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                  settings.layout === 'Carousel' ? 'min-w-[300px]' : ''
                }`}
              >
                <div className="aspect-video overflow-hidden relative">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-slate-800 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <button className="w-full py-2 text-xs font-bold text-indigo-600 border border-indigo-100 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {settings.ctaText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
