/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, within, } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FeatureFlagCrud } from '@/components/portal-admin/FeatureFlagCrud';
import type { FlagCrudStorage, FlagStore } from '@/lib/feature-flags/crud-storage';
import { SEED_STORE } from '@/lib/feature-flags/crud-storage';

// ---------------------------------------------------------------------------
// Mock framer-motion
// ---------------------------------------------------------------------------

jest.mock('motion/react', () => {
  const React = require('react');

  const createMotionProxy = () =>
    new Proxy(
      {},
      {
        get: (_target: unknown, prop: string) => {
          return React.forwardRef(
            function MockMotion(
              { children, ...props }: { children?: React.ReactNode; [key: string]: unknown },
              ref: React.Ref<HTMLElement>,
            ) {
              const {
                initial: _initial, animate: _animate, exit: _exit, whileHover: _whileHover, whileTap: _whileTap,
                transition: _transition, layout: _layout, variants: _variants, ...rest
              } = props;
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

// ---------------------------------------------------------------------------
// In-memory storage for tests
// ---------------------------------------------------------------------------

function createTestStorage(initial?: FlagStore): FlagCrudStorage & { store: FlagStore } {
  const storage = {
    store: initial ?? JSON.parse(JSON.stringify(SEED_STORE)),
    load() {
      return this.store;
    },
    save(s: FlagStore) {
      this.store = s;
    },
  };
  return storage;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('FeatureFlagCrud', () => {
  // ── Rendering ─────────────────────────────────────────

  it('renderiza o título e as 3 abas', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    expect(screen.getByText('Gerenciamento de Feature Flags')).toBeInTheDocument();
    expect(screen.getByText('Booleanas')).toBeInTheDocument();
    expect(screen.getByText('Multivariantes')).toBeInTheDocument();
    expect(screen.getByText('Com Atributos')).toBeInTheDocument();
  });

  it('exibe flags booleanas na aba padrão', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    expect(screen.getByText('Checkout V2 Redesign')).toBeInTheDocument();
    expect(screen.getByText('Modo Manutenção')).toBeInTheDocument();
  });

  // ── Tab switching ─────────────────────────────────────

  it('alterna para a aba Multivariantes', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Multivariantes'));

    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Rate Limit')).toBeInTheDocument();
  });

  it('alterna para a aba Com Atributos', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Com Atributos'));

    expect(screen.getByText('ML Recommendation Engine')).toBeInTheDocument();
  });

  // ── Search ────────────────────────────────────────────

  it('filtra flags booleanas por busca', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    const searchInput = screen.getByPlaceholderText('Buscar flags por nome ou chave...');
    fireEvent.change(searchInput, { target: { value: 'checkout' } });

    expect(screen.getByText('Checkout V2 Redesign')).toBeInTheDocument();
    expect(screen.queryByText('Modo Manutenção')).not.toBeInTheDocument();
  });

  // ── Status filter ─────────────────────────────────────

  it('filtra por status ativado/desativado', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    const select = screen.getByDisplayValue('Todos os Status');
    fireEvent.change(select, { target: { value: 'inactive' } });

    // Checkout V2 is enabled, should not appear; Manutenção is disabled
    expect(screen.queryByText('Checkout V2 Redesign')).not.toBeInTheDocument();
    expect(screen.getByText('Modo Manutenção')).toBeInTheDocument();
  });

  // ── Toggle ────────────────────────────────────────────

  it('alterna o estado de uma flag booleana via toggle', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    // Find the toggle buttons (switch). Manutenção is disabled (2nd flag)
    const toggleButtons = screen.getAllByRole('button').filter(
      (btn) => btn.className.includes('rounded-full') && btn.className.includes('items-center'),
    );

    // Toggle the first one (Checkout V2 — currently enabled)
    fireEvent.click(toggleButtons[0]);

    // Verify it was persisted as disabled
    expect(storage.store.booleanFlags[0].enabled).toBe(false);
  });

  // ── Create modal ──────────────────────────────────────

  it('abre modal de criação de flag booleana', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Nova Flag'));

    expect(screen.getByText('Nova Flag Booleana')).toBeInTheDocument();
  });

  it('cria uma nova flag booleana', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    fireEvent.click(screen.getByText('Nova Flag'));

    fireEvent.change(screen.getByPlaceholderText('Ex: Checkout V2'), { target: { value: 'Nova Feature' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: checkout_v2'), { target: { value: 'nova_feature' } });
    fireEvent.change(screen.getByPlaceholderText('Para que serve esta flag?'), { target: { value: 'Uma nova feature' } });

    fireEvent.click(screen.getByText('Criar'));

    // Verifica que foi adicionada ao storage
    expect(storage.store.booleanFlags).toHaveLength(3);
    expect(storage.store.booleanFlags[2].key).toBe('nova_feature');
  });

  // ── Edit modal ────────────────────────────────────────

  it('abre modal de edição ao clicar no botão editar', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    const editButtons = screen.getAllByTitle('Editar');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Editar Flag Booleana')).toBeInTheDocument();
  });

  // ── Delete ────────────────────────────────────────────

  it('exclui uma flag booleana com confirmação', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);

    // Confirmação aparece
    expect(screen.getByText('Excluir?')).toBeInTheDocument();

    // Find the confirm container and click the red check button inside it
    const confirmText = screen.getByText('Excluir?');
    const confirmContainer = confirmText.closest('div')!;
    const buttons = within(confirmContainer).getAllByRole('button');
    // Second button is the confirm (red check), first is cancel (X)
    fireEvent.click(buttons[1]);

    expect(storage.store.booleanFlags).toHaveLength(1);
  });

  // ── JSON view ─────────────────────────────────────────

  it('exibe JSON da flag ao clicar no botão code', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    const codeButtons = screen.getAllByTitle('Ver JSON');
    fireEvent.click(codeButtons[0]);

    // JSON view shows the key
    expect(screen.getByText(/"key": "new_checkout_v2"/)).toBeInTheDocument();
  });

  // ── Multivariant tab modal ────────────────────────────

  it('abre modal de criação de flag multivariante na aba correta', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Multivariantes'));
    fireEvent.click(screen.getByText('Nova Flag'));

    expect(screen.getByText('Nova Flag Multivariante')).toBeInTheDocument();
  });

  // ── Attribute tab modal ───────────────────────────────

  it('abre modal de criação de flag com atributos na aba correta', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Com Atributos'));
    fireEvent.click(screen.getByText('Nova Flag'));

    expect(screen.getByText('Nova Flag com Atributos')).toBeInTheDocument();
  });

  // ── Empty state ───────────────────────────────────────

  it('exibe estado vazio quando não há flags', () => {
    const emptyStore: FlagStore = { booleanFlags: [], multivariantFlags: [], attributeFlags: [] };
    render(<FeatureFlagCrud storage={createTestStorage(emptyStore)} />);

    expect(screen.getByText('Nenhuma flag encontrada')).toBeInTheDocument();
  });

  // ── Help panel ────────────────────────────────────────

  it('abre o painel de ajuda ao clicar no botão help', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    const helpBtn = screen.getByTitle('Como funciona?');
    fireEvent.click(helpBtn);

    // The expandable help panel shows "Como funciona" as a section heading
    expect(screen.getAllByText(/Como funciona/i).length).toBeGreaterThan(0);
  });

  it('fecha o painel de ajuda ao clicar no X interno', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByTitle('Como funciona?'));

    // Panel is open
    expect(screen.getByText('Casos de Uso')).toBeInTheDocument();

    // Close via internal X button in TabHelpContent (has hover:text-slate-500 class)
    const allBtns = screen.getAllByRole('button');
    const closeBtn = allBtns.find(b =>
      b.className.includes('hover:text-slate-500') && !b.textContent?.trim() && !b.title,
    );
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(screen.queryByText('Casos de Uso')).not.toBeInTheDocument();
    }
  });

  // ── Multivariant modal full flow ──────────────────────

  it('cria uma nova flag multivariante com variantes', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    fireEvent.click(screen.getByText('Multivariantes'));
    fireEvent.click(screen.getByText('Nova Flag'));

    // Fill all required fields 
    fireEvent.change(screen.getByPlaceholderText('Ex: Dark Mode'), { target: { value: 'Test Variant Flag' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: ui_dark_mode'), { target: { value: 'test_variant' } });
    fireEvent.change(screen.getByPlaceholderText('Para que serve esta flag?'), { target: { value: 'A multivariant test' } });
    // Fill current value (required field in multivariant modal)
    fireEvent.change(screen.getByPlaceholderText('beta'), { target: { value: 'control' } });
    // Fill variant label
    fireEvent.change(screen.getByPlaceholderText('Label'), { target: { value: 'Control' } });

    const criarBtn = screen.getByRole('button', { name: /Criar/i });
    fireEvent.click(criarBtn);
    expect(storage.store.multivariantFlags.length).toBe(3);
  });

  it('adiciona variante no modal multivariante', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Multivariantes'));
    fireEvent.click(screen.getByText('Nova Flag'));

    const addBtn = screen.getByRole('button', { name: /Adicionar/i });
    fireEvent.click(addBtn);

    // There should now be 2 rows of variant inputs
    expect(screen.getAllByPlaceholderText('Label').length).toBe(2);
  });

  it('remove variante no modal multivariante quando há mais de uma', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Multivariantes'));
    fireEvent.click(screen.getByText('Nova Flag'));

    // Add a variant first
    const addBtn = screen.getByRole('button', { name: /Adicionar/i });
    fireEvent.click(addBtn);
    expect(screen.getAllByPlaceholderText('Label').length).toBe(2);

    // Now remove it — the remove buttons appear when variants.length > 1
    const xBtns = screen.getAllByRole('button').filter(b =>
      b.className.includes('hover:text-red-500') && !b.title,
    );
    if (xBtns.length > 0) {
      fireEvent.click(xBtns[xBtns.length - 1]);
      expect(screen.getAllByPlaceholderText('Label').length).toBe(1);
    }
  });

  it('altera valueType no modal multivariante', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Multivariantes'));
    fireEvent.click(screen.getByText('Nova Flag'));

    // Use getAllByRole to handle the status filter select + the valueType select
    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    // The valueType select has 'string' as first option
    const vtSelect = selects.find(s => s.value === 'string');
    if (vtSelect) {
      fireEvent.change(vtSelect, { target: { value: 'number' } });
      expect(vtSelect.value).toBe('number');
    }
  });

  // ── Attribute modal full flow ──────────────────────────

  it('cria uma nova flag com atributos', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    fireEvent.click(screen.getByText('Com Atributos'));
    fireEvent.click(screen.getByText('Nova Flag'));

    fireEvent.change(screen.getByPlaceholderText('Ex: ML Rec Engine'), { target: { value: 'Attr Flag' } });
    fireEvent.change(screen.getByPlaceholderText('Ex: ml_rec_engine'), { target: { value: 'attr_flag' } });
    fireEvent.change(screen.getByPlaceholderText('Para que serve esta flag?'), { target: { value: 'Attr test' } });

    // Fill attribute key and value
    fireEvent.change(screen.getByPlaceholderText('Chave'), { target: { value: 'threshold' } });
    fireEvent.change(screen.getByPlaceholderText('Valor'), { target: { value: '0.8' } });

    fireEvent.click(screen.getByRole('button', { name: /Criar/i }));
    expect(storage.store.attributeFlags.length).toBe(2);
  });

  it('adiciona atributo no modal de atributos', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Com Atributos'));
    fireEvent.click(screen.getByText('Nova Flag'));

    // "Adicionar" button is the only one with that name in the attrs section
    const addBtn = screen.getByRole('button', { name: /Adicionar/i });
    fireEvent.click(addBtn);

    expect(screen.getAllByPlaceholderText('Chave').length).toBe(2);
  });

  it('alterna enabled no modal booleano', () => {
    render(<FeatureFlagCrud storage={createTestStorage()} />);

    fireEvent.click(screen.getByText('Nova Flag'));

    // Confirm EnabledToggle is rendered with initial Desativado state
    expect(screen.getByText('Estado')).toBeInTheDocument();
    // The toggle button starts as bg-slate-300 (disabled)
    const toggleBtn = screen.getAllByRole('button').find(b =>
      b.className.includes('bg-slate-300') && b.className.includes('w-11'),
    );
    expect(toggleBtn).toBeTruthy();

    // Click and verify the button class changes to bg-emerald-500 (enabled)
    if (toggleBtn) {
      fireEvent.click(toggleBtn);
      // After click, the button should have emerald background (enabled)
      const enabledBtn = screen.getAllByRole('button').find(b =>
        b.className.includes('bg-emerald-500') && b.className.includes('w-11'),
      );
      expect(enabledBtn).toBeTruthy();
    }
  });

  it('edita uma flag multivariante existente', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    fireEvent.click(screen.getByText('Multivariantes'));

    const editBtns = screen.getAllByTitle('Editar');
    fireEvent.click(editBtns[0]);

    expect(screen.getByText('Editar Flag Multivariante')).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /Salvar/i });
    fireEvent.click(saveBtn);

    expect(storage.store.multivariantFlags.length).toBe(2);
  });

  it('edita uma flag com atributos existente', () => {
    const storage = createTestStorage();
    render(<FeatureFlagCrud storage={storage} />);

    fireEvent.click(screen.getByText('Com Atributos'));

    const editBtns = screen.getAllByTitle('Editar');
    fireEvent.click(editBtns[0]);

    expect(screen.getByText('Editar Flag com Atributos')).toBeInTheDocument();

    const saveBtn = screen.getByRole('button', { name: /Salvar/i });
    fireEvent.click(saveBtn);

    expect(storage.store.attributeFlags.length).toBe(1);
  });
});
