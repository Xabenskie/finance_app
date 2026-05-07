import { test as base, type Page } from '@playwright/test'

async function installApiMocks(page: Page) {
	await page.route('**/api/users/login', async route => {
		const body = route.request().postDataJSON() as {
			username: string
			password: string
		}
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				access_token: `access-${body.username}`,
				refresh_token: `refresh-${body.username}`,
				token_type: 'bearer',
				username: body.username,
				role: body.username === 'admin' ? 'admin' : 'user',
				avatar_url: ''
			})
		})
	})

	await page.route('**/api/users/me', route =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ username: 'alice', role: 'user' })
		})
	)

	await page.route('**/api/transactions/**', route =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ items: [], total: 0, page: 1, per_page: 10 })
		})
	)

	await page.route('**/api/transactions/stats**', route =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ income: 0, expense: 0, balance: 0 })
		})
	)

	await page.route('**/api/categories/**', route =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: '[]'
		})
	)

	// Внешний API — не валим страницу при отсутствии сети
	await page.route('**api.open-meteo.com/**', route =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				current_weather: { temperature: 12, windspeed: 4, weathercode: 1 },
				hourly: { relative_humidity_2m: Array(24).fill(60) }
			})
		})
	)
}

export const test = base.extend({
	page: async ({ page }, runTest) => {
		await installApiMocks(page)
		await runTest(page)
	}
})

export { expect } from '@playwright/test'
