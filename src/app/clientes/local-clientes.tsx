'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import type { Cliente } from '@/types/cliente'

const STORAGE_KEY = 'hub-ai:demo:clientes:v1'
const initialClients: Cliente[] = [
  { codigo: 1001, nome: 'Cliente Exemplo A', email: 'cliente.a@example.invalid' },
  { codigo: 1002, nome: 'Cliente Exemplo B', email: 'cliente.b@example.invalid' },
  { codigo: 1003, nome: 'Cliente Exemplo C', email: 'cliente.c@example.invalid' },
]

function validClients(value: unknown): value is Cliente[] {
  return Array.isArray(value) && value.every(item =>
    item !== null && typeof item === 'object' &&
    Number.isSafeInteger(item.codigo) && item.codigo > 0 &&
    typeof item.nome === 'string' && typeof item.email === 'string'
  )
}

export default function LocalClientes() {
  const [clients, setClients] = useState<Cliente[]>([])
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw === null) setClients(initialClients)
      else {
        const parsed: unknown = JSON.parse(raw)
        setClients(validClients(parsed) ? parsed : initialClients)
      }
    } catch {
      setClients(initialClients)
      setError('Não foi possível ler os dados locais.')
    }
    setReady(true)
  }, [])

  const filtered = useMemo(() => clients.filter(client =>
    `${client.codigo} ${client.nome} ${client.email}`.toLocaleLowerCase('pt-BR')
      .includes(query.toLocaleLowerCase('pt-BR').trim())
  ), [clients, query])

  function persist(next: Cliente[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setClients(next)
      setError('')
      return true
    } catch {
      setError('Não foi possível salvar os dados no navegador.')
      return false
    }
  }

  function startCreate() {
    setEditing(null)
    setName('')
    setEmail('')
    setError('')
    setOpen(true)
  }

  function startEdit(client: Cliente) {
    setEditing(client.codigo)
    setName(client.nome)
    setEmail(client.email)
    setError('')
    setOpen(true)
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Informe um nome e um e-mail válido.')
      return
    }
    if (clients.some(client => client.email.toLowerCase() === normalizedEmail && client.codigo !== editing)) {
      setError('Já existe um cliente com esse e-mail.')
      return
    }
    const next = editing !== null
      ? clients.map(client => client.codigo === editing ? { ...client, nome: normalizedName, email: normalizedEmail } : client)
      : [...clients, { codigo: Math.max(1000, ...clients.map(client => client.codigo)) + 1, nome: normalizedName, email: normalizedEmail }]
    if (persist(next)) setOpen(false)
  }

  function remove(client: Cliente) {
    if (!window.confirm(`Excluir o cliente "${client.nome}"? Esta ação não pode ser desfeita.`)) return
    persist(clients.filter(item => item.codigo !== client.codigo))
  }

  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Ambiente de demonstração</strong><p>Cadastros fictícios armazenados apenas neste navegador. Nenhuma informação é enviada à API corporativa.</p></div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-slate-900">Clientes</h1><p className="mt-1 text-sm text-slate-500">{ready ? `${clients.length} cliente(s) cadastrado(s)` : 'Carregando clientes…'}</p></div>
      <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"><Plus size={18}/> Novo cliente</button>
    </div>
    <label className="flex max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500"><Search size={18}/><span className="sr-only">Buscar clientes</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nome, código ou e-mail" className="w-full bg-transparent text-sm text-slate-900 outline-none"/></label>
    {error && !open && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-5 py-4">Código</th><th className="px-5 py-4">Nome</th><th className="px-5 py-4">E-mail</th><th className="px-5 py-4 text-right">Ações</th></tr></thead>
      <tbody className="divide-y divide-slate-100">{filtered.map(client => <tr key={client.codigo}><td className="px-5 py-4 text-slate-500">{client.codigo}</td><td className="px-5 py-4 font-medium text-slate-900">{client.nome}</td><td className="px-5 py-4 text-slate-600">{client.email}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => startEdit(client)} aria-label={`Editar ${client.nome}`} className="rounded-lg p-2 text-sky-700 hover:bg-sky-50"><Pencil size={18}/></button><button type="button" onClick={() => remove(client)} aria-label={`Excluir ${client.nome}`} className="rounded-lg p-2 text-red-700 hover:bg-red-50"><Trash2 size={18}/></button></div></td></tr>)}</tbody></table>
      {ready && filtered.length === 0 && <p className="p-8 text-center text-sm text-slate-500">Nenhum cliente encontrado.</p>}
    </div>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div role="dialog" aria-modal="true" aria-labelledby="client-dialog-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="mb-5 flex items-center justify-between"><h2 id="client-dialog-title" className="text-xl font-semibold text-slate-900">{editing === null ? 'Novo cliente' : 'Editar cliente'}</h2><button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-slate-100"><X size={20}/></button></div>
      <form onSubmit={save} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Nome<input required maxLength={120} value={name} onChange={event => setName(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label><label className="block text-sm font-medium text-slate-700">E-mail<input required type="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"/></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancelar</button><button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">Salvar cliente</button></div></form></div></div>}
  </section>
}
