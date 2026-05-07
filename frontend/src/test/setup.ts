import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

afterEach(() => {
	cleanup()
	localStorage.clear()
	vi.clearAllMocks()
})

beforeEach(() => {
	if (!('matchMedia' in window)) {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false
			})
		})
	}
})
