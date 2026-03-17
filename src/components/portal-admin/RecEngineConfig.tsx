
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Zap, Plus, Edit2, Play, Info, Scale } from 'lucide-react';

export const RecEngineConfig: React.FC = () => {
  const [activeLogic, setActiveLogic] = useState('bought-together');

  const logics = [
    {
      id: 'bought-together',
      title: 'Comprados Frequentemente Juntos',
      desc: 'Usa mineração de regras de associação para sugerir itens que aparecem frequentemente na mesma transação.'
    },
    {
      id: 'personalized',
      title: 'Personalizado para Você',
      desc: 'Filtragem colaborativa baseada no histórico de navegação do usuário e perfis demográficos semelhantes.'
    },
    {
      id: 'trending',
      title: 'Tendências Atuais',
      desc: 'Destaca produtos com o maior crescimento em velocidade de vendas nas últimas 24 horas.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-8 space-y-8 bg-slate-50 overflow-y-auto"
    >
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Zap size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">RecEngine <span className="text-slate-400 font-normal">/ Config</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Descartar</button>
          <button className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Salvar e Implantar</button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Logic Rules Selection */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Regras de Lógica</h2>
            <p className="text-sm text-slate-500 mb-6">Selecione a lógica principal que impulsiona este mecanismo.</p>
            
            <div className="space-y-4">
              {logics.map((logic) => (
                <button
                  key={logic.id}
                  onClick={() => setActiveLogic(logic.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    activeLogic === logic.id 
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold ${activeLogic === logic.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {logic.title}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      activeLogic === logic.id ? 'border-indigo-500' : 'border-slate-300'
                    }`}>
                      {activeLogic === logic.id && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{logic.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Scale size={18} className="text-indigo-500" />
              Variáveis de Ponderação
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Margem de Lucro', val: 40 },
                { label: 'Níveis de Estoque', val: 25 },
                { label: 'Avaliação de Clientes', val: 35 }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                    <span>{item.label}</span>
                    <span className="text-indigo-600">{item.val}%</span>
                  </div>
                  <div className="relative h-1.5 w-full bg-slate-100 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${item.val}%` }} 
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow-sm cursor-pointer" 
                      style={{ left: `${item.val}%`, transform: 'translate(-50%, -50%)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Slot Representation */}
        <section className="col-span-12 lg:col-span-5">
          <div className="bg-slate-100/50 rounded-3xl p-8 border border-slate-200 min-h-[600px] flex flex-col">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Slots de Recomendação</h2>
              <button className="p-2.5 bg-white rounded-full border border-slate-200 hover:shadow-lg transition-all text-slate-400 hover:text-indigo-600">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="flex-grow flex flex-col gap-4 relative">
              {[
                { id: 1, title: 'Carrossel Principal', desc: 'Máx 5 itens • Desktop/Mobile', color: 'border-indigo-500' },
                { id: 2, title: 'Upsell no Checkout', desc: 'Máx 2 itens • Página de Checkout', color: 'border-blue-400' },
                { id: 3, title: 'Rodapé de E-mail', desc: 'Máx 3 itens • E-mail Transacional', color: 'border-purple-400' }
              ].map((slot, i) => (
                <React.Fragment key={slot.id}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white p-5 rounded-2xl border-l-4 ${slot.color} shadow-sm flex items-center justify-between group cursor-pointer`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {slot.id}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{slot.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{slot.desc}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </motion.div>
                  {i < 2 && <div className="w-px h-8 bg-slate-300 mx-auto" />}
                </React.Fragment>
              ))}
              
              <button className="mt-6 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-white transition-all group">
                <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">Adicionar Slot</span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Test Interface */}
        <section className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Teste ao Vivo</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Perfil do Usuário Alvo</label>
                <select className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 py-2.5 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                  <option>Maria Silva (Alto Valor, Moda)</option>
                  <option>João Santos (Novo Usuário, Tech)</option>
                  <option>Alex Ferreira (Caçador de Ofertas)</option>
                </select>
              </div>
              
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                <Play size={16} fill="currentColor" />
                Executar Simulação
              </button>
              
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resultados Previstos</h3>
                  <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black tracking-tighter">AO VIVO</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Bolsa de Couro Premium', score: '0.982', img: 'https://picsum.photos/seed/bag/100/100' },
                    { name: 'Lenço de Seda Minimalista', score: '0.845', img: 'https://picsum.photos/seed/scarf/100/100' },
                    { name: 'Óculos de Sol Cat-Eye', score: '0.712', img: 'https://picsum.photos/seed/glasses/100/100' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                      <div className="relative w-10 h-10 shrink-0">
                        <Image 
                          src={item.img} 
                          alt={item.name} 
                          fill
                          className="rounded-lg object-cover border border-slate-200" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Pontuação: {item.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex gap-2">
                  <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-indigo-700 leading-normal font-medium">
                    <strong>Insight:</strong> Para este perfil, a ponderação de &quot;Alto Lucro&quot; aumentou a relevância em +14%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
