/** @jest-environment node */
import { createRecommendationStore } from '@/lib/recommendations/store'
import {
  createRecommendationEffects,
  type RecommendationEffects,
} from '@/lib/recommendations/persistence'
import { createEmptyData, migrateData } from '@/lib/recommendations/data-model'

const effectsToDispose: RecommendationEffects[] = []
function setup() {
  const repository = {
    load: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(undefined),
  }

  const preview = { publish: jest.fn() }
  const effects = createRecommendationEffects(repository, preview)
  effectsToDispose.push(effects)

  return {
    store: createRecommendationStore(effects),
    repository,
    preview,
    effects,
  }
}
beforeEach(() => jest.useFakeTimers())
afterEach(() => {
  effectsToDispose.splice(0).forEach((effects) => effects.dispose())
  jest.useRealTimers()
})

it('migrates legacy data without sharing mutable defaults between stores', () => {
  const first = createEmptyData()
  first.catalog.categories.push('first-only')
  expect(createEmptyData().catalog.categories).toEqual([])
  const migrated = migrateData({ catalog: first.catalog })
  expect(migrated.catalog.categories).toEqual(['first-only'])

  expect(migrated.recommendationRules.types.context_slot.slots).toEqual(
    createEmptyData().recommendationRules.types.context_slot.slots
  )
})

it('loads through an injected repository without accessing browser storage', async () => {
  const { store, repository, preview } = setup()

  repository.load.mockResolvedValue({
    catalog: { products: [], categories: ['legacy'] },
  })

  await store.getState().loadFromStorage()
  expect(store.getState().data.catalog.categories).toEqual(['legacy'])
  expect(store.getState().isLoading).toBe(false)
  expect(preview.publish).toHaveBeenCalledWith(store.getState().data)
})

it('debounces catalog changes and publishes only after persistence commits', async () => {
  const { store, repository, preview } = setup()
  store.getState().addCategory('A')
  store.getState().addCategory('B')
  expect(repository.save).not.toHaveBeenCalled()
  expect(preview.publish).not.toHaveBeenCalled()
  await jest.advanceTimersByTimeAsync(500)
  expect(repository.save).toHaveBeenCalledTimes(1)

  expect(repository.save.mock.calls[0][0].catalog.categories).toEqual([
    'A',
    'B',
  ])

  expect(store.getState().syncStatus).toBe('synced')
  expect(preview.publish).toHaveBeenCalledTimes(1)
})

it('keeps save timers independent across store instances', async () => {
  const first = setup(),
    second = setup()

  first.store.getState().addCategory('first')
  second.store.getState().addCategory('second')
  await jest.advanceTimersByTimeAsync(500)

  expect(first.repository.save.mock.calls[0][0].catalog.categories).toEqual([
    'first',
  ])

  expect(second.repository.save.mock.calls[0][0].catalog.categories).toEqual([
    'second',
  ])
})

it('does not report a successful sync or publish when persistence fails', async () => {
  const { store, repository, preview } = setup()
  repository.save.mockRejectedValue(new Error('storage unavailable'))
  store.getState().addCategory('not persisted')
  await jest.advanceTimersByTimeAsync(500)
  expect(store.getState().syncStatus).toBe('error')
  expect(preview.publish).not.toHaveBeenCalled()
  expect(store.getState().data.catalog.categories).toEqual(['not persisted'])
})

it('serializes overlapping writes and publishes only the latest revision', async () => {
  const { store, repository, preview } = setup()
  let release!: () => void

  repository.save.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        release = resolve
      })
  )

  store.getState().addCategory('A')
  await jest.advanceTimersByTimeAsync(500)
  store.getState().addCategory('B')
  await jest.advanceTimersByTimeAsync(500)
  expect(repository.save).toHaveBeenCalledTimes(1)
  expect(preview.publish).not.toHaveBeenCalled()
  release()
  await jest.advanceTimersByTimeAsync(0)
  expect(repository.save).toHaveBeenCalledTimes(2)
  expect(preview.publish).toHaveBeenCalledTimes(1)

  expect(preview.publish.mock.calls[0][0].catalog.categories).toEqual([
    'A',
    'B',
  ])
})

it('creates a campaign once and preserves an existing campaign on duplicate creation', () => {
  const { store } = setup()
  store.getState().addCampaign('spring', 'Original')

  expect(
    store.getState().data.recommendationRules.types.campaign.campaigns.spring
  ).toEqual({ description: 'Original', targets: [] })

  store.getState().addCampaign('spring', 'Replacement')

  expect(
    store.getState().data.recommendationRules.types.campaign.campaigns.spring
      .description
  ).toBe('Original')
})

it('rejects malformed imports without changing the current data', () => {
  const { store } = setup()
  const before = store.getState().data
  expect(store.getState().importData('{invalid')).toBe(false)
  expect(store.getState().data).toBe(before)
})

it('preserves rule editing and export/import across action modules', () => {
  const { store } = setup()

  const product = {
    url: '/product',
    name: 'Product',
    category: 'tools',
    description: '',
    imageUrl: '',
  }

  const target = {
    targetType: 'url' as const,
    targetId: product.url,
    weight: 10,
  }

  store.getState().addProduct(product)
  store.getState().addAffinityByCategory('tools', target)
  store.getState().addAffinityByUrl(product.url, target)
  store.getState().setGlobalRanking([product.url])
  store.getState().addCampaign('launch', 'Launch')
  store.getState().addCampaignTarget('launch', target)

  store
    .getState()
    .addSlot('custom', { limit: 2, minItems: 1, cascade: ['campaign'] })

  store.getState().updateSameCategoryParams({ maxCandidates: 17 })

  store.getState().updateDefaults({
    ...store.getState().data.recommendationRules.defaults,
    limit: 3,
  })

  const exported = store.getState().exportData()
  const restored = setup().store
  expect(restored.getState().importData(exported)).toBe(true)
  const data = restored.getState().data
  expect(data.catalog.products).toEqual([product])

  expect(
    data.recommendationRules.types.affinity_manual.maps.byCategory.tools
  ).toEqual([target])

  expect(
    data.recommendationRules.types.affinity_manual.maps.byUrl[product.url]
  ).toEqual([target])

  expect(
    data.recommendationRules.types.campaign.campaigns.launch.targets
  ).toEqual([target])

  expect(data.recommendationRules.types.context_slot.slots.custom.limit).toBe(2)

  expect(
    data.recommendationRules.types.same_category.params.maxCandidates
  ).toBe(17)

  expect(data.recommendationRules.defaults.limit).toBe(3)
})
