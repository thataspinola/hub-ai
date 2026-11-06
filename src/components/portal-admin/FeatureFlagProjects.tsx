'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChevronRight, Plus, Search } from 'lucide-react';
import type { FeatureFlagDocument, FeatureFlagProjectStore, FlagCrudStorage } from '@/lib/feature-flags/crud-storage';
import { ApiFeatureFlagStorage, SEED_PROJECT_STORE } from '@/lib/feature-flags/crud-storage';

export function FeatureFlagProjects({
  storage: storageProp,
}: {
  storage?: FlagCrudStorage;
}) {
  const [apiStorage] = useState(() => new ApiFeatureFlagStorage());
  const [store, setStore] = useState<FeatureFlagProjectStore>(SEED_PROJECT_STORE);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(!storageProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        const nextStore = storageProp ? storageProp.load() : await apiStorage.load();
        if (!active) return;
        setStore(nextStore);
        setError(null);
      } catch (error) {
        if (!active) return;
        setError(error instanceof Error ? error.message : 'Não foi possível carregar os projetos de feature flags.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProjects();

    return () => {
      active = false;
    };
  }, [apiStorage, storageProp]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return store.projects;

    return store.projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.flags.some(flag => flag.name.toLowerCase().includes(query)),
    );
  }, [searchQuery, store.projects]);

  async function createProject(event: React.FormEvent) {
    event.preventDefault();

    const name = newProjectName.trim();
    if (!name) return;

    const document: FeatureFlagDocument = {
      version: '1.0.0',
      name,
      flags: [],
    };

    try {
      setCreating(true);
      setError(null);

      if (storageProp) {
        const nextStore = { projects: [...store.projects, document] };
        storageProp.save(nextStore);
        setStore(nextStore);
      } else {
        const savedProject = await apiStorage.saveProject(document);
        setStore(current => ({ projects: [...current.projects, savedProject] }));
      }

      setNewProjectName('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Não foi possível criar o projeto.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 overflow-y-auto bg-slate-50 p-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Feature Flags</h2>
            <p className="mt-1 text-sm text-slate-500">
              Selecione um projeto para gerenciar seu arquivo flags.json.
            </p>
          </div>
          <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            <span className="font-semibold text-slate-700">{store.projects.length}</span> projetos
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={createProject} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="new-feature-flag-project" className="text-xs font-bold uppercase tracking-wider text-slate-400">Novo projeto</label>
              <input
                id="new-feature-flag-project"
                type="text"
                value={newProjectName}
                onChange={event => setNewProjectName(event.target.value)}
                placeholder="consorcio-widget"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={creating || !newProjectName.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Plus size={16} /> {creating ? 'Criando...' : 'Criar projeto'}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/40 p-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Buscar por projeto ou flag..."
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {loading && (
              <div className="p-10 text-center text-sm text-slate-400">
                Carregando projetos...
              </div>
            )}

            {error && !loading && (
              <div className="p-10 text-center text-sm text-red-500">
                {error}
              </div>
            )}

            {!loading && !error && filteredProjects.map(project => {
              const activeFlags = project.flags.filter(flag => flag.active).length;

              return (
                <Link
                  key={project.name}
                  href={`/feature-flags/${encodeURIComponent(project.name)}`}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-mono text-base font-bold text-slate-900">{project.name}</h3>
                    <p className="mt-1 truncate text-xs font-mono text-slate-500">
                      assets/feature-flags/{project.name}/flags.json
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs text-slate-500">
                      <div><span className="font-semibold text-slate-700">{project.flags.length}</span> flags</div>
                      <div><span className="font-semibold text-emerald-700">{activeFlags}</span> ativas</div>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <ChevronRight size={18} />
                    </span>
                  </div>
                </Link>
              );
            })}

            {!loading && !error && filteredProjects.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-400">
                Nenhum projeto encontrado na estrutura nova. Crie um projeto para gerar assets/feature-flags/{'{project}'}/flags.json.
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
