import { createCatalogActions } from '@/lib/recommendations/actions/catalog'
import { createDefaultsActions } from '@/lib/recommendations/actions/defaults'
import { createLifecycleActions } from '@/lib/recommendations/actions/lifecycle'
import type { RecommendationActionContext } from '@/lib/recommendations/actions/types'
import { createEmptyData } from '@/lib/recommendations/data-model'
import type { RecommendationData } from '@/lib/recommendations/types'

type HarnessState = { data: RecommendationData; isDirty: boolean; isLoading?: boolean; syncStatus?: string }

function createHarness(data: RecommendationData = createEmptyData()) {
  let state: HarnessState = { data, isDirty: false }
  const set = jest.fn((updater: unknown) => {
    const partial =
      typeof updater === 'function'
        ? (updater as (s: HarnessState) => Partial<HarnessState>)(state)
        : (updater as Partial<HarnessState>)
    if (partial && partial !== state) state = { ...state, ...partial }
  })
  const get = () => state
  const saveChange = jest.fn()
  const load = jest.fn().mockResolvedValue(null)
  const publish = jest.fn()
  const ctx = {
    set,
    get,
    saveChange,
    load,
    publish,
  } as unknown as RecommendationActionContext

  return { ctx, saveChange, load, publish, getState: () => state }
}

describe('catalog actions', () => {
  it('adds a product and registers its new category once', () => {
    const h = createHarness()
    const actions = createCatalogActions(h.ctx)
    actions.addProduct({ url: '/a', category: 'shoes' } as never)
    actions.addProduct({ url: '/b', category: 'shoes' } as never)

    const { catalog } = h.getState().data
    expect(catalog.products.map((p) => p.url)).toEqual(['/a', '/b'])
    expect(catalog.categories).toEqual(['shoes'])
    expect(h.saveChange).toHaveBeenCalledTimes(2)
  })

  it('updates the product matching the url and leaves others untouched', () => {
    const data = createEmptyData()
    data.catalog.products = [
      { url: '/a', name: 'A' },
      { url: '/b', name: 'B' },
    ] as never
    const h = createHarness(data)
    createCatalogActions(h.ctx).updateProduct('/b', {
      url: '/b',
      name: 'B2',
    } as never)

    expect(h.getState().data.catalog.products).toEqual([
      { url: '/a', name: 'A' },
      { url: '/b', name: 'B2' },
    ])
  })

  it('removes a product by url', () => {
    const data = createEmptyData()
    data.catalog.products = [{ url: '/a' }, { url: '/b' }] as never
    const h = createHarness(data)
    createCatalogActions(h.ctx).removeProduct('/a')

    expect(h.getState().data.catalog.products).toEqual([{ url: '/b' }])
    expect(h.getState().isDirty).toBe(true)
  })

  it('adds and removes categories', () => {
    const h = createHarness()
    const actions = createCatalogActions(h.ctx)
    actions.addCategory('shoes')
    actions.addCategory('bags')
    actions.removeCategory('shoes')

    expect(h.getState().data.catalog.categories).toEqual(['bags'])
    expect(h.saveChange).toHaveBeenCalledTimes(3)
  })
})

describe('defaults actions', () => {
  it('replaces the global defaults', () => {
    const h = createHarness()
    const defaults = {
      limit: 3,
      minItems: 1,
      filters: { excludeCurrentUrl: false, deduplicate: false },
    }
    createDefaultsActions(h.ctx).updateDefaults(defaults)

    expect(h.getState().data.recommendationRules.defaults).toEqual(defaults)
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('replaces history_recent params', () => {
    const h = createHarness()
    const params = {
      maxRecentUrlsStored: 5,
      takeFromRecentUrls: 2,
      ifEmptyThenUseRecentCategories: false,
      takeFromRecentCategories: 1,
      expandCategoryToUrlsTake: 3,
    }
    createDefaultsActions(h.ctx).updateHistoryRecentsParams(params)

    expect(
      h.getState().data.recommendationRules.types.history_recent.params
    ).toEqual(params)
  })

  it('replaces same_category params', () => {
    const h = createHarness()
    createDefaultsActions(h.ctx).updateSameCategoryParams({ maxCandidates: 7 })

    expect(
      h.getState().data.recommendationRules.types.same_category.params
    ).toEqual({ maxCandidates: 7 })
  })
})

describe('lifecycle actions', () => {
  it('loads stored data, migrates it and publishes it', async () => {
    const h = createHarness()
    h.load.mockResolvedValue({ catalog: { products: [], categories: ['x'] } })

    await createLifecycleActions(h.ctx).loadFromStorage()

    const state = h.getState()
    expect(state.isLoading).toBe(false)
    expect(state.isDirty).toBe(false)
    expect(state.syncStatus).toBe('saved')
    expect(state.data.catalog.categories).toEqual(['x'])
    expect(h.publish).toHaveBeenCalledWith(state.data)
  })

  it('only clears loading when nothing is stored', async () => {
    const h = createHarness()
    await createLifecycleActions(h.ctx).loadFromStorage()

    expect(h.getState().isLoading).toBe(false)
    expect(h.publish).not.toHaveBeenCalled()
  })

  it('logs and clears loading when loading fails', async () => {
    const h = createHarness()
    const error = new Error('db down')
    h.load.mockRejectedValue(error)
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

    await createLifecycleActions(h.ctx).loadFromStorage()

    expect(spy).toHaveBeenCalledWith('Failed to load from IndexedDB:', error)
    expect(h.getState().isLoading).toBe(false)
    spy.mockRestore()
  })

  it('sets data as dirty and saves it', () => {
    const h = createHarness()
    const data = createEmptyData()
    data.generatedFrom = 'custom'
    createLifecycleActions(h.ctx).setData(data)

    expect(h.getState().data.generatedFrom).toBe('custom')
    expect(h.getState().isDirty).toBe(true)
    expect(h.saveChange).toHaveBeenCalledWith(data)
  })

  it('resets data to the empty model', () => {
    const data = createEmptyData()
    data.catalog.categories.push('old')
    const h = createHarness(data)
    createLifecycleActions(h.ctx).resetData()

    expect(h.getState().data.catalog.categories).toEqual([])
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('imports valid JSON and returns true', () => {
    const h = createHarness()
    const json = JSON.stringify({
      catalog: { products: [], categories: ['imported'] },
      recommendationRules: {},
    })

    expect(createLifecycleActions(h.ctx).importData(json)).toBe(true)
    expect(h.getState().data.catalog.categories).toEqual(['imported'])
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('rejects malformed JSON', () => {
    const h = createHarness()

    expect(createLifecycleActions(h.ctx).importData('{not json')).toBe(false)
    expect(h.saveChange).not.toHaveBeenCalled()
  })

  it('rejects JSON without catalog or recommendationRules', () => {
    const h = createHarness()

    expect(
      createLifecycleActions(h.ctx).importData(JSON.stringify({ catalog: {} }))
    ).toBe(false)
    expect(h.saveChange).not.toHaveBeenCalled()
  })

  it('exports JSON with refreshed metadata timestamps', () => {
    jest.useFakeTimers().setSystemTime(new Date('2030-01-02T03:04:05.000Z'))
    const h = createHarness()
    const exported = JSON.parse(createLifecycleActions(h.ctx).exportData())

    const types = exported.recommendationRules.types
    expect(types.affinity_manual.metadata.updatedAt).toBe(
      '2030-01-02T03:04:05.000Z'
    )
    expect(types.popularity_global.metadata.computedAt).toBe(
      '2030-01-02T03:04:05.000Z'
    )
    expect(exported.version).toBe('2.0.0')
    jest.useRealTimers()
  })
})
