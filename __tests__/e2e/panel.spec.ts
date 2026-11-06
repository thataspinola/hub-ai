import { test, expect } from '@playwright/test'

test.beforeEach(async ({ context }) => {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url())

    if (url.hostname !== 'localhost' || url.port !== '3100')
      return route.abort()

    if (url.pathname.endsWith('/api/auth/session'))
      return route.fulfill({ json: {} })

    return route.continue()
  })
})

test('dashboard navigates to the reviewer and filters profiles', async ({
  page,
}) => {
  await page.goto('./')

  await expect(
    page.getByRole('heading', { name: 'Visão Geral do Aplicativo' })
  ).toBeVisible()

  await page.getByRole('link', { name: 'Code Reviewer', exact: true }).click()

  await expect(
    page.getByRole('heading', { name: 'Code Reviewer', exact: true })
  ).toBeVisible()

  await page.getByLabel('Perfil').selectOption('react')

  await expect(
    page.getByRole('heading', { name: 'Web Code Reviewer', exact: true })
  ).toBeVisible()

  await page.getByLabel('Buscar recursos').fill('no-matching-resource')
  await expect(page.getByRole('status')).toHaveText('0 recursos encontrados')
})

test('feature flags load a controlled local fixture after reload', async ({
  page,
}) => {
  await page.goto('feature-flags')

  await expect(
    page.getByRole('heading', { name: 'Gerenciamento de Feature Flags' })
  ).toBeVisible()

  await page.evaluate(() =>
    localStorage.setItem(
      'feature_flags_crud',
      JSON.stringify({
        booleanFlags: [
          {
            id: 'local-fixture',
            key: 'e2e_fixture',
            name: 'E2E Controlled Flag',
            description: 'Local fixture',
            enabled: false,
            owner: 'Test',
            createdAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        multivariantFlags: [],
        attributeFlags: [],
      })
    )
  )

  await page.reload()

  await expect(
    page.getByText('E2E Controlled Flag', { exact: true })
  ).toBeVisible()

  await page
    .getByPlaceholder('Buscar flags por nome ou chave...')
    .fill('no-matching-flag')

  await expect(
    page.getByText('E2E Controlled Flag', { exact: true })
  ).not.toBeVisible()
})

test('form wizard persists a new local form', async ({ page }) => {
  await page.goto('form-wizard/new')
  await expect(page).toHaveURL(/\/form-wizard\/form-/)

  await expect(
    page.getByRole('button', { name: /Save/i }).first()
  ).toBeVisible()

  const url = page.url()
  await page.reload()
  await expect(page).toHaveURL(url)

  await expect(
    page.getByRole('button', { name: /Save/i }).first()
  ).toBeVisible()
})

test('recommendations render without an external service', async ({ page }) => {
  await page.goto('recommendations')

  await expect(
    page.getByRole('heading', { name: 'Recomendações', exact: true })
  ).toBeVisible()

  await page.getByRole('button', { name: /^Catálogo/ }).click()

  await expect(
    page.getByRole('button', { name: /Adicionar Produto/i })
  ).toBeVisible()
})
