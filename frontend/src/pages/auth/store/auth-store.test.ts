import { ApiError } from '@/api/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/pages/auth/login/api/login', () => ({ login: vi.fn() }))

import { login as loginApi } from '@/pages/auth/login/api/login'
import { useAuthStore } from './auth-store'

const loginMock = vi.mocked(loginApi)

function reset() {
	useAuthStore.setState({
		user: null,
		token: null,
		refreshToken: null,
		isLoading: false,
		error: null
	})
}

describe('auth-store', () => {
	beforeEach(() => {
		localStorage.clear()
		reset()
		loginMock.mockReset()
	})

	it('успешный логин сохраняет user и токены', async () => {
		loginMock.mockResolvedValueOnce({
			access_token: 'A',
			refresh_token: 'R',
			username: 'alice',
			role: 'admin'
		})
		await useAuthStore
			.getState()
			.login({ username: 'alice', password: 'pwd' })
		const s = useAuthStore.getState()
		expect(s.user?.role).toBe('admin')
		expect(localStorage.getItem('auth_token')).toBe('A')
	})

	it('ошибка API записывается в state.error и user остаётся null', async () => {
		loginMock.mockRejectedValueOnce(new ApiError({ message: 'Неверный логин' }))
		await useAuthStore.getState().login({ username: 'x', password: 'y' })
		const s = useAuthStore.getState()
		expect(s.user).toBeNull()
		expect(s.error).toBe('Неверный логин')
	})
})
