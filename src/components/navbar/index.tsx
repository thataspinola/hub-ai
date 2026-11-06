'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Flag,
  WandSparkles,
  ScanSearch,
  Star,
} from 'lucide-react'
import Auth from '../auth'

const items = [
  { href: '/', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/feature-flags', label: 'Feature Flags', icon: Flag },
  { href: '/form-wizard', label: 'Formulários', icon: WandSparkles },
  { href: '/code-reviewer', label: 'Code Reviewer', icon: ScanSearch },
  { href: '/recommendations', label: 'Recomendações', icon: Star },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Portal Admin - início"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-sm">
            P
          </span>

          <span className="leading-tight">
            <strong className="block text-base text-slate-900">
              Portal Admin
            </strong>

            <small className="text-xs text-slate-500">
              Painel Administrativo
            </small>
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {items.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(href + '/')

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-sky-600 ${active ? 'bg-sky-50 text-sky-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden xl:block">
          <Auth />
        </div>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="hidden border-t border-slate-100 px-6 py-2 lg:block xl:hidden">
        <Auth />
      </div>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação móvel"
          className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          <div className="grid gap-1">
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-sky-50"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            <Auth />
          </div>
        </nav>
      )}
    </header>
  )
}
