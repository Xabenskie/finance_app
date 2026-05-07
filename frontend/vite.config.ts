/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

const apiTarget = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		host: true,
		proxy: {
			'/api': {
				target: apiTarget,
				changeOrigin: true
			}
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		css: false,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			thresholds: {
				lines: 30,
				functions: 30,
				branches: 50,
				statements: 30
			},
			include: [
				'src/lib/**/*.ts',
				'src/pages/auth/store/**/*.ts',
				'src/pages/auth/login/login.tsx',
				'src/pages/categories/categories-page.tsx',
				'src/pages/transactions/transactions-page.tsx'
			],
			exclude: [
				'src/**/*.d.ts',
				'src/main.tsx',
				'src/test/**',
				'src/components/ui/**',
				'src/**/*.test.{ts,tsx}'
			]
		},
		exclude: ['node_modules', 'dist', 'e2e/**']
	}
})
