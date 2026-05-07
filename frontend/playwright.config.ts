import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:5173'

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	expect: { timeout: 5000 },
	fullyParallel: false,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: process.env.E2E_NO_WEBSERVER
		? undefined
		: {
				command: 'pnpm dev --port 5173 --host 127.0.0.1',
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 60_000,
				env: {
					VITE_API_PROXY_TARGET: process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'
				}
		  }
})
