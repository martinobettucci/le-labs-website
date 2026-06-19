import { test, expect, type APIRequestContext, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const WEBSITE = process.env.WEBSITE_URL || 'http://website:5173'
const BACKOFFICE = process.env.BACKOFFICE_URL || 'http://backoffice:5173'
const INBUCKET = process.env.INBUCKET_URL || 'http://inbucket:9000'

const SHOTS = '/e2e/artifacts/screens'
mkdirSync(SHOTS, { recursive: true })

// 1x1 transparent PNG (used to validate the sovereign S3/MinIO upload path).
const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

const shot = async (page: Page, name: string) => {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true })
}

type InbucketMsg = { id: string; body?: { text?: string; html?: string } }

async function fetchVerifyLink(request: APIRequestContext, address: string): Promise<string> {
  const local = address.split('@')[0]
  const candidates = [local, address]
  for (let i = 0; i < 40; i++) {
    for (const mb of candidates) {
      const res = await request.get(`${INBUCKET}/api/v1/mailbox/${encodeURIComponent(mb)}`)
      if (res.ok()) {
        const list = (await res.json()) as InbucketMsg[]
        if (list.length) {
          const id = list[list.length - 1].id
          const full = await request.get(`${INBUCKET}/api/v1/mailbox/${encodeURIComponent(mb)}/${id}`)
          const msg = (await full.json()) as InbucketMsg
          const body = `${msg.body?.html || ''}\n${msg.body?.text || ''}`
          const m = body.match(/https?:\/\/[^\s"'<>]*\/auth\/v1\/verify\?[^\s"'<>]+/)
          if (m) return m[0].replace(/&amp;/g, '&')
        }
      }
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`No sign-in email captured in Inbucket for ${address}`)
}

test('sovereign LE LABS end-to-end (filmed)', async ({ page, request }) => {
  test.setTimeout(180_000)

  // ---- Phase 1: public website home (seeded projects) --------------------
  await page.goto(WEBSITE, { waitUntil: 'networkidle' })
  await expect(page.getByText('Spatial Computing Interface').first()).toBeVisible({ timeout: 30_000 })
  await shot(page, '01-website-home')

  // ---- Phase 2: projects listing (the 4 hard-coded examples, now seeded) --
  await page.goto(`${WEBSITE}/projects`, { waitUntil: 'networkidle' })
  for (const t of ['Spatial Computing Interface', 'Neural Audio Generation', 'Adaptive Color Systems', 'Haptic Information Design']) {
    await expect(page.getByText(t).first()).toBeVisible()
  }
  await shot(page, '02-website-projects')

  // ---- Phase 3: a project detail page ------------------------------------
  await page.goto(`${WEBSITE}/projects/spatial-computing-interface`, { waitUntil: 'networkidle' })
  await expect(page.getByText('Spatial Computing Interface').first()).toBeVisible()
  await shot(page, '03-website-project-detail')

  // ---- Phase 4: back-office (signed out) ---------------------------------
  await page.goto(BACKOFFICE, { waitUntil: 'networkidle' })
  await expect(page.getByTestId('login-button')).toBeVisible({ timeout: 30_000 })
  await shot(page, '04-backoffice-signed-out')

  // ---- Phase 5: request magic-link / OTP (captured by Inbucket) ----------
  const email = `e2e-${Date.now()}@lelabs.local`
  await page.getByTestId('login-button').click()
  await page.getByTestId('login-email').locator('input').fill(email)
  await shot(page, '05-backoffice-login-email')
  await page.getByTestId('login-send').click()
  await expect(page.getByTestId('login-code')).toBeVisible({ timeout: 20_000 })
  await shot(page, '06-backoffice-login-sent')

  // ---- Phase 6: complete sign-in via the emailed link --------------------
  const verifyLink = await fetchVerifyLink(request, email)
  const u = new URL(verifyLink)
  // The email link points at the gateway host; replay it through the back-office
  // origin (which same-origin-proxies /auth/v1 to the gateway) so GoTrue can
  // verify and redirect back with a session.
  await page.goto(`${BACKOFFICE}${u.pathname}${u.search}`, { waitUntil: 'networkidle' })
  // After GoTrue verifies, the app lands signed-in and loads projects.
  await expect(page.getByText('Spatial Computing Interface').first()).toBeVisible({ timeout: 30_000 })
  await shot(page, '07-backoffice-dashboard')

  // ---- Phase 7: create a project + upload an image to sovereign storage ---
  const stamp = Date.now()
  const id = `e2e-project-${stamp}`
  const title = `E2E Sovereign Project ${stamp}`
  const slug = `e2e-sovereign-project-${stamp}`

  await page.getByTestId('new-project').click()
  await page.getByTestId('pf-id').fill(id)
  await page.getByTestId('pf-title').fill(title)
  await page.getByTestId('pf-slug').fill(slug)
  await page.getByTestId('pf-status').fill('active')
  await page.getByTestId('pf-description').fill('Created by the Playwright E2E run against the sovereign stack.')
  await page.getByTestId('pf-summary').fill('Validates back-office write + MinIO image upload end-to-end.')
  await page.getByTestId('pf-last-updated').fill('2025-06-19T10:00')
  await page.getByTestId('pf-image-file').setInputFiles({ name: 'e2e.png', mimeType: 'image/png', buffer: PNG_1x1 })
  // Wait for the upload to populate the image URL (proves storage works).
  // pf-image-url's data-testid is on the <input> itself (MUI inputProps).
  await expect(page.getByTestId('pf-image-url')).toHaveValue(/storage\/v1\/object\/public\/project-images/, { timeout: 30_000 })
  await shot(page, '08-backoffice-new-project-form')

  await page.getByTestId('pf-submit').click()
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 30_000 })
  await shot(page, '09-backoffice-after-create')

  // ---- Phase 8: the new project shows up on the public website -----------
  await page.goto(`${WEBSITE}/projects`, { waitUntil: 'networkidle' })
  await expect(page.getByText(title).first()).toBeVisible({ timeout: 30_000 })
  await shot(page, '10-website-new-project')
})
