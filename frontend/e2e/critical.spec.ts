import { expect, test } from './fixtures'

test.describe('Критические сквозные сценарии', () => {
	// 4.1 — вход и редирект
	test('успешный вход → /dashboard', async ({ page }) => {
		await page.goto('/auth')
		await page.getByPlaceholder(/username/i).fill('alice')
		await page.getByPlaceholder(/пароль/i).fill('Pass123!')
		await page.getByRole('button', { name: /войти/i }).click()
		await page.waitForURL('**/dashboard')
		await expect(page.getByText(/личный финансовый учёт/i)).toBeVisible()
	})

	// 4.1 — восстановление сессии из localStorage
	test('сессия восстанавливается, защищённый маршрут открывается', async ({
		page,
		context
	}) => {
		await context.addInitScript(() => {
			localStorage.setItem('auth_token', 'access-alice')
			localStorage.setItem('refresh_token', 'refresh-alice')
			localStorage.setItem(
				'auth_user',
				JSON.stringify({ username: 'alice', role: 'user' })
			)
		})
		await page.goto('/dashboard')
		await expect(page.getByText(/личный финансовый учёт/i)).toBeVisible()
	})

	// 4.2 — RBAC: user видит "Доступ запрещён" на /admin
	test('user не может попасть на /admin', async ({ page, context }) => {
		await context.addInitScript(() => {
			localStorage.setItem('auth_token', 'a')
			localStorage.setItem('refresh_token', 'r')
			localStorage.setItem(
				'auth_user',
				JSON.stringify({ username: 'alice', role: 'user' })
			)
		})
		await page.goto('/admin')
		await expect(page.getByText(/доступ запрещён/i)).toBeVisible()
	})
})
