import { createCampaignActions } from '@/lib/recommendations/actions/campaign'
import { createSlotsActions } from '@/lib/recommendations/actions/slots'
import { createAffinityActions } from '@/lib/recommendations/actions/affinity'
import type { RecommendationActionContext } from '@/lib/recommendations/actions/types'
import { createEmptyData } from '@/lib/recommendations/data-model'
import type { RecommendationData } from '@/lib/recommendations/types'

function createHarness(data: RecommendationData = createEmptyData()) {
  let state: { data: RecommendationData; isDirty: boolean } = {
    data,
    isDirty: false,
  }
  const set = jest.fn((updater: unknown) => {
    const partial =
      typeof updater === 'function'
        ? (updater as (s: typeof state) => Partial<typeof state>)(state)
        : (updater as Partial<typeof state>)
    if (partial && partial !== state) state = { ...state, ...partial }
  })
  const saveChange = jest.fn()
  const ctx = {
    set,
    get: () => state,
    saveChange,
    load: jest.fn(),
    publish: jest.fn(),
  } as unknown as RecommendationActionContext

  return { ctx, saveChange, getState: () => state }
}

describe('campaign actions', () => {
  it('adds a campaign with description and saves it', () => {
    const h = createHarness()
    createCampaignActions(h.ctx).addCampaign('black', 'Black Friday')

    const campaigns = h.getState().data.recommendationRules.types.campaign.campaigns
    expect(campaigns.black).toEqual({ description: 'Black Friday', targets: [] })
    expect(h.getState().isDirty).toBe(true)
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('defaults the description to an empty string', () => {
    const h = createHarness()
    createCampaignActions(h.ctx).addCampaign('spring')

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns.spring
        .description
    ).toBe('')
  })

  it('ignores addCampaign when the campaign already exists', () => {
    const data = createEmptyData()
    data.recommendationRules.types.campaign.campaigns.black = {
      description: 'Original',
      targets: [],
    }
    const h = createHarness(data)
    createCampaignActions(h.ctx).addCampaign('black', 'Other')

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns.black
        .description
    ).toBe('Original')
    expect(h.saveChange).not.toHaveBeenCalled()
  })

  it('removes an existing campaign and keeps the others', () => {
    const data = createEmptyData()
    data.recommendationRules.types.campaign.campaigns = {
      a: { description: 'A', targets: [] },
      b: { description: 'B', targets: [] },
    }
    const h = createHarness(data)
    createCampaignActions(h.ctx).removeCampaign('a')

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns
    ).toEqual({ b: { description: 'B', targets: [] } })
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('adds a target to an existing campaign', () => {
    const data = createEmptyData()
    data.recommendationRules.types.campaign.campaigns.a = {
      description: 'A',
      targets: ['/one'],
    }
    const h = createHarness(data)
    createCampaignActions(h.ctx).addCampaignTarget('a', '/two')

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns.a.targets
    ).toEqual(['/one', '/two'])
  })

  it('does not add a target to a missing campaign', () => {
    const h = createHarness()
    const before = h.getState()
    createCampaignActions(h.ctx).addCampaignTarget('missing', '/x')

    expect(h.getState()).toBe(before)
    expect(h.saveChange).not.toHaveBeenCalled()
  })

  it('removes the target at the given index', () => {
    const data = createEmptyData()
    data.recommendationRules.types.campaign.campaigns.a = {
      description: 'A',
      targets: ['/one', '/two', '/three'],
    }
    const h = createHarness(data)
    createCampaignActions(h.ctx).removeCampaignTarget('a', 1)

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns.a.targets
    ).toEqual(['/one', '/three'])
  })

  it('does not remove a target from a missing campaign', () => {
    const h = createHarness()
    const before = h.getState()
    createCampaignActions(h.ctx).removeCampaignTarget('missing', 0)

    expect(h.getState()).toBe(before)
    expect(h.saveChange).not.toHaveBeenCalled()
  })

  it('updates the description of an existing campaign', () => {
    const data = createEmptyData()
    data.recommendationRules.types.campaign.campaigns.a = {
      description: 'old',
      targets: ['/one'],
    }
    const h = createHarness(data)
    createCampaignActions(h.ctx).updateCampaignDescription('a', 'new')

    expect(
      h.getState().data.recommendationRules.types.campaign.campaigns.a
    ).toEqual({ description: 'new', targets: ['/one'] })
  })

  it('does not update the description of a missing campaign', () => {
    const h = createHarness()
    const before = h.getState()
    createCampaignActions(h.ctx).updateCampaignDescription('missing', 'x')

    expect(h.getState()).toBe(before)
    expect(h.saveChange).not.toHaveBeenCalled()
  })
})

describe('slots actions', () => {
  const slot = { limit: 4, minItems: 2, cascade: ['popularity_global'] }

  it('adds a new slot', () => {
    const h = createHarness()
    createSlotsActions(h.ctx).addSlot('home_banner', slot as never)

    expect(
      h.getState().data.recommendationRules.types.context_slot.slots.home_banner
    ).toEqual(slot)
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('updates an existing slot', () => {
    const h = createHarness()
    createSlotsActions(h.ctx).updateSlot('pdp_related', {
      ...slot,
      limit: 12,
    } as never)

    expect(
      h.getState().data.recommendationRules.types.context_slot.slots.pdp_related
        .limit
    ).toBe(12)
    expect(h.getState().isDirty).toBe(true)
  })

  it('removes a slot without touching the others', () => {
    const h = createHarness()
    createSlotsActions(h.ctx).removeSlot('pdp_related')

    const slots = h.getState().data.recommendationRules.types.context_slot.slots
    expect(slots.pdp_related).toBeUndefined()
    expect(slots.home_trending).toBeDefined()
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })
})

describe('affinity actions', () => {
  const byCategory = (h: ReturnType<typeof createHarness>) =>
    h.getState().data.recommendationRules.types.affinity_manual.maps.byCategory
  const byUrl = (h: ReturnType<typeof createHarness>) =>
    h.getState().data.recommendationRules.types.affinity_manual.maps.byUrl

  it('creates a category entry and appends further targets', () => {
    const h = createHarness()
    const actions = createAffinityActions(h.ctx)
    actions.addAffinityByCategory('shoes', { url: '/a', weight: 1 } as never)
    actions.addAffinityByCategory('shoes', { url: '/b', weight: 2 } as never)

    expect(byCategory(h).shoes).toEqual([
      { url: '/a', weight: 1 },
      { url: '/b', weight: 2 },
    ])
  })

  it('removes a category target and keeps the rest', () => {
    const data = createEmptyData()
    data.recommendationRules.types.affinity_manual.maps.byCategory.shoes = [
      { url: '/a' },
      { url: '/b' },
    ] as never
    const h = createHarness(data)
    createAffinityActions(h.ctx).removeAffinityByCategory('shoes', 0)

    expect(byCategory(h).shoes).toEqual([{ url: '/b' }])
  })

  it('deletes the category key when its last target is removed', () => {
    const data = createEmptyData()
    data.recommendationRules.types.affinity_manual.maps.byCategory.shoes = [
      { url: '/a' },
    ] as never
    const h = createHarness(data)
    createAffinityActions(h.ctx).removeAffinityByCategory('shoes', 0)

    expect(byCategory(h)).not.toHaveProperty('shoes')
    expect(h.saveChange).toHaveBeenCalledTimes(1)
  })

  it('removing from an unknown category leaves the map empty', () => {
    const h = createHarness()
    createAffinityActions(h.ctx).removeAffinityByCategory('unknown', 0)

    expect(byCategory(h)).toEqual({})
  })

  it('creates a URL entry and appends further targets', () => {
    const h = createHarness()
    const actions = createAffinityActions(h.ctx)
    actions.addAffinityByUrl('/source', { url: '/a' } as never)
    actions.addAffinityByUrl('/source', { url: '/b' } as never)

    expect(byUrl(h)['/source']).toEqual([{ url: '/a' }, { url: '/b' }])
  })

  it('removes a URL target and deletes the key when empty', () => {
    const data = createEmptyData()
    data.recommendationRules.types.affinity_manual.maps.byUrl['/source'] = [
      { url: '/a' },
      { url: '/b' },
    ] as never
    const h = createHarness(data)
    const actions = createAffinityActions(h.ctx)

    actions.removeAffinityByUrl('/source', 0)
    expect(byUrl(h)['/source']).toEqual([{ url: '/b' }])

    actions.removeAffinityByUrl('/source', 0)
    expect(byUrl(h)).not.toHaveProperty('/source')
  })
})
