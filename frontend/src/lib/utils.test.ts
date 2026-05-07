import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
	it('сливает классы и обрабатывает falsy', () => {
		expect(cn('a', false, undefined, 'b')).toBe('a b')
	})

	it('последний tailwind-класс перебивает предыдущий', () => {
		expect(cn('p-2', 'p-4')).toBe('p-4')
	})
})
