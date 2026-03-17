"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  Percent, 
  Settings, 
  FileText,
  LogOut,
  Code,
  ShoppingCart,
  Sparkles,
  Wand2
} from 'lucide-react';

export const PortalSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'clientes', label: 'Clientes', icon: ShoppingCart, href: '/clientes' },
    { id: 'recomendacoes', label: 'Recomendações', icon: Sparkles, href: '/recomendacoes' },
    { id: 'feature-flags', label: 'Feature Flags', icon: Flag, href: '/feature-flags' },
    { id: 'pilots', label: 'Pilotos', icon: Users, href: '/pilots' },
    { id: 'promotions', label: 'Promoções', icon: Percent, href: '/promotions' },
    { id: 'rec-engine', label: 'RecEngine', icon: Settings, href: '/rec-engine' },
    { id: 'form-builder', label: 'DataStore', icon: FileText, href: '/form-builder' },
    { id: 'form-wizard', label: 'Form Wizard', icon: Wand2, href: '/form-wizard' },
    { id: 'regras', label: 'Regras', icon: Code, href: '/regras' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white">A</span>
          PortalAdm
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center ring-2 ring-slate-800">
            <span className="text-xs font-bold">JD</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Jane Doe</p>
            <p className="text-xs text-slate-400 truncate">Administrador do Sistema</p>
          </div>
        </div>
        <button className="mt-4 w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-500 hover:text-white transition-colors">
          <LogOut size={14} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
};
