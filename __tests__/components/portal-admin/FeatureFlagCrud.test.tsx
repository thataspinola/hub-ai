/**
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FeatureFlagCrud } from '@/components/portal-admin/FeatureFlagCrud';
import { FeatureFlagProjects } from '@/components/portal-admin/FeatureFlagProjects';
import type { FlagCrudStorage, FlagStore } from '@/lib/feature-flags/crud-storage';
import { SEED_PROJECT_STORE } from '@/lib/feature-flags/crud-storage';

jest.mock('motion/react', () => {
  const React = require('react');

  const createMotionProxy = () =>
    new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef(
            (
              { children, ...props }: { children?: React.ReactNode; [key: string]: unknown },
              ref: React.Ref<HTMLElement>,
            ) => {
              const { initial, animate, exit, transition, layout, ...rest } = props;
              return React.createElement(prop, { ref, ...rest }, children);
            },
          );
        },
      },
    );

  return {
    motion: createMotionProxy(),
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

function createTestStorage(initial?: FlagStore): FlagCrudStorage & { store: FlagStore } {
  const storage = {
    store: initial ?? JSON.parse(JSON.stringify(SEED_PROJECT_STORE)),
    load() {
      return this.store;
    },
    save(store: FlagStore) {
      this.store = store;
    },
  };
  return storage;
}

describe('FeatureFlagProjects', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lista projetos pelo name antes de listar flags', () => {
    render(<FeatureFlagProjects storage={createTestStorage()} />);

    expect(screen.getByText('consorcio-widget')).toBeInTheDocument();
    expect(screen.getByText('seguro-auto-widget')).toBeInTheDocument();
    expect(screen.getByText('assets/feature-flags/consorcio-widget/flags.json')).toBeInTheDocument();
  });

  it('filtra projetos por name ou flag', () => {
    render(<FeatureFlagProjects storage={createTestStorage()} />);

    fireEvent.change(screen.getByPlaceholderText('Buscar por projeto ou flag...'), { target: { value: 'renovacao' } });

    expect(screen.getByText('seguro-auto-widget')).toBeInTheDocument();
    expect(screen.queryByText('consorcio-widget')).not.toBeInTheDocument();
  });

  it('cria um projeto novo no formato flags.json por projeto', () => {
    const storage = createTestStorage({ projects: [] });
    render(<FeatureFlagProjects storage={storage} />);

    fireEvent.change(screen.getByLabelText('Novo projeto'), { target: { value: 'novo-widget' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar projeto' }));

    expect(storage.store.projects).toEqual([
      { version: '1.0.0', name: 'novo-widget', flags: [] },
    ]);
    expect(screen.getByText('novo-widget')).toBeInTheDocument();
    expect(screen.getByText('assets/feature-flags/novo-widget/flags.json')).toBeInTheDocument();
  });
});

describe('FeatureFlagCrud', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exibe rules, properties e preview completo do projeto', () => {
    render(<FeatureFlagCrud projectName="consorcio-widget" storage={createTestStorage()} />);

    expect(screen.getByText('Rules')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Preview do projeto')).toBeInTheDocument();
    expect(screen.getByText('allowedCategories')).toBeInTheDocument();
    expect(screen.getByText(/"flags": \[/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "ifood"/)).toBeInTheDocument();
  });

  it('cria uma flag no projeto selecionado', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud projectName="seguro-auto-widget" storage={storage} />);

    fireEvent.click(screen.getByText('Nova Flag'));

    fireEvent.change(screen.getByLabelText('Nome da flag'), { target: { value: 'parceria' } });
    fireEvent.change(screen.getByLabelText('Key'), { target: { value: 'parceria' } });
    fireEvent.change(screen.getByPlaceholderText('true'), { target: { value: 'enabled' } });

    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    const project = storage.store.projects.find(item => item.name === 'seguro-auto-widget');
    expect(project?.flags).toHaveLength(2);
    expect(project?.flags[1]).toMatchObject({
      name: 'parceria',
      condition: { key: 'parceria', source: 'utm_source', value: 'enabled' },
    });
  });

  it('pausa uma flag preservando rules e properties', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud projectName="consorcio-widget" storage={storage} />);

    fireEvent.click(screen.getByLabelText('Pausar flag'));

    const project = storage.store.projects.find(item => item.name === 'consorcio-widget');
    expect(project?.flags[0].active).toBe(false);
    expect(project?.flags[0].condition.source).toBe('utm_source');
    expect(project?.flags[0].properties).toHaveProperty('allowedCategories');
  });

  it('remove uma flag do projeto atual', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud projectName="consorcio-widget" storage={storage} />);

    fireEvent.click(screen.getByTitle('Excluir'));
    const confirm = screen.getByText('Excluir?').closest('div')!;
    fireEvent.click(within(confirm).getAllByRole('button')[1]);

    const project = storage.store.projects.find(item => item.name === 'consorcio-widget');
    expect(project?.flags).toHaveLength(0);
    expect(screen.getByText('Nenhuma flag encontrada')).toBeInTheDocument();
  });
});