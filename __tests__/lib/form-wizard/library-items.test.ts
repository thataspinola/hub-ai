import { libraryItems, categoryLabels } from '@/lib/form-wizard/library-items'

describe('libraryItems', () => {
  it('has 14 items', () => {
    expect(libraryItems).toHaveLength(14)
  })

  it('includes a STEP item', () => {
    const step = libraryItems.find((i) => i.type === 'STEP')
    expect(step).toBeDefined()
    expect(step?.category).toBe('structure')
  })

  it('includes content elements', () => {
    const content = libraryItems.filter((i) => i.category === 'content')
    expect(content.length).toBeGreaterThanOrEqual(2)
    expect(content.map((c) => c.type)).toContain('TITLE')
    expect(content.map((c) => c.type)).toContain('PARAGRAPH')
  })

  it('includes field elements', () => {
    const fields = libraryItems.filter((i) => i.category === 'fields')
    expect(fields.length).toBeGreaterThanOrEqual(4)
  })

  it('includes special field elements', () => {
    const special = libraryItems.filter((i) => i.category === 'special-fields')
    expect(special.map((s) => s.type)).toEqual(
      expect.arrayContaining(['CPF_INPUT', 'CNPJ_INPUT', 'PHONE_INPUT'])
    )
  })

  it('includes action elements', () => {
    const actions = libraryItems.filter((i) => i.category === 'actions')
    expect(actions.length).toBeGreaterThanOrEqual(3)
  })

  it('every item has an icon string', () => {
    libraryItems.forEach((item) => {
      expect(typeof item.icon).toBe('string')
      expect(item.icon.length).toBeGreaterThan(0)
    })
  })
})

describe('categoryLabels', () => {
  it('has labels for all categories', () => {
    expect(categoryLabels).toHaveProperty('structure')
    expect(categoryLabels).toHaveProperty('content')
    expect(categoryLabels).toHaveProperty('fields')
    expect(categoryLabels).toHaveProperty('special-fields')
    expect(categoryLabels).toHaveProperty('plans')
    expect(categoryLabels).toHaveProperty('actions')
  })
})
