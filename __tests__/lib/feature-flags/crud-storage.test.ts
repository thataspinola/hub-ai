/**
 * @jest-environment jsdom
 */

import {
  ApiFeatureFlagStorage,
  LocalStorageCrudStorage,
  SEED_PROJECT_STORE,
  SEED_STORE,
  createFeatureFlag,
  storeToFlagValueMap,
  syncProviderStorage,
  generateId,
  normalizeFeatureFlagProjectStore,
} from '@/lib/feature-flags/crud-storage';

const CRUD_KEY = 'feature_flags_v1_projects';
const PROVIDER_KEY = 'appconfig_feature_flags';

describe('crud-storage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  // ── LocalStorageCrudStorage ────────────────────────────

  describe('LocalStorageCrudStorage', () => {
    it('retorna SEED_STORE e inicializa localStorage quando vazio', () => {
      const storage = new LocalStorageCrudStorage();
      const result = storage.load();

      expect(result).toEqual(SEED_PROJECT_STORE);
      expect(JSON.parse(localStorage.getItem(CRUD_KEY)!)).toEqual(SEED_PROJECT_STORE);
    });

    it('retorna dados do localStorage quando disponíveis', () => {
      const custom = { projects: [{ version: '1.0.0', name: 'custom-project', flags: [] }] };
      localStorage.setItem(CRUD_KEY, JSON.stringify(custom));

      const storage = new LocalStorageCrudStorage();
      expect(storage.load()).toEqual(custom);
    });

    it('retorna SEED_STORE quando localStorage contém JSON inválido', () => {
      localStorage.setItem(CRUD_KEY, '{broken');

      const storage = new LocalStorageCrudStorage();
      expect(storage.load()).toEqual(SEED_PROJECT_STORE);
    });

    it('persiste store no localStorage via save()', () => {
      const storage = new LocalStorageCrudStorage();
      const store = { projects: [{ ...SEED_STORE, flags: [] }] };
      storage.save(store);

      expect(JSON.parse(localStorage.getItem(CRUD_KEY)!)).toEqual(store);
    });
  });

  describe('ApiFeatureFlagStorage', () => {
    it('carrega projetos usando o basePath da aplicação', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => SEED_PROJECT_STORE,
      }) as jest.Mock;

      await new ApiFeatureFlagStorage().load();

      expect(global.fetch).toHaveBeenCalledWith(
        '/react-ssr-corp-hubv-painel-administrativo/api/feature-flags',
        expect.objectContaining({ method: 'GET' }),
      );
    });

    it('salva projeto usando o basePath da aplicação', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ project: SEED_STORE }),
      }) as jest.Mock;

      await new ApiFeatureFlagStorage().saveProject(SEED_STORE);

      expect(global.fetch).toHaveBeenCalledWith(
        '/react-ssr-corp-hubv-painel-administrativo/api/feature-flags/consorcio-widget',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });

  // ── storeToFlagValueMap ────────────────────────────────

  describe('storeToFlagValueMap()', () => {
    it('converte flags da V1 para FlagValueMap', () => {
      const map = storeToFlagValueMap(SEED_STORE);

      expect(map['ifood']).toBeDefined();
      expect(map['ifood'].enabled).toBe(true);
      expect(map['ifood']).toHaveProperty('allowedCategories', ['AUTOMOVEL', 'IMOVEL']);
      expect(map['ifood']).toHaveProperty('condition', SEED_STORE.flags[0].condition);
    });
  });

  // ── syncProviderStorage ────────────────────────────────

  describe('syncProviderStorage()', () => {
    it('sincroniza FlagValueMap para o localStorage do provider', () => {
      syncProviderStorage(SEED_STORE);

      const map = JSON.parse(localStorage.getItem(PROVIDER_KEY)!);
      expect(map).toHaveProperty('ifood');
    });
  });

  describe('normalizeFeatureFlagProjectStore()', () => {
    it('normaliza múltiplos projetos', () => {
      const store = normalizeFeatureFlagProjectStore({
        projects: [
          { version: '1.0.0', name: 'app-a', flags: [] },
          { version: '1.0.0', name: 'app-b', flags: [] },
        ],
      });

      expect(store.projects.map(project => project.name)).toEqual(['app-a', 'app-b']);
    });

    it('mantém compatibilidade com documento único legado', () => {
      const store = normalizeFeatureFlagProjectStore(SEED_STORE);

      expect(store.projects).toHaveLength(1);
      expect(store.projects[0].name).toBe('consorcio-widget');
    });
  });

  // ── generateId ─────────────────────────────────────────

  describe('generateId()', () => {
    it('gera IDs únicos', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  // ── create helpers ────────────────────────────────────

  describe('create helpers', () => {
    it('createFeatureFlag retorna uma flag V1', () => {
      const flag = createFeatureFlag({
        name: 'test',
        active: true,
        condition: { type: 'url', key: 'test', source: 'utm_source', value: 'true' },
        properties: { color: 'red' },
      });

      expect(flag.name).toBe('test');
      expect(flag.properties).toEqual({ color: 'red' });
    });
  });

  // ── SSR safety ─────────────────────────────────────────

  describe('SSR safety', () => {
    it('load retorna SEED_STORE quando window não existe', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error — Simula SSR
      delete globalThis.window;

      try {
        const storage = new LocalStorageCrudStorage();
        expect(storage.load()).toEqual(SEED_PROJECT_STORE);
      } finally {
        globalThis.window = originalWindow;
      }
    });
  });
});
