import { useAuthStore } from '@/pages/auth/store/auth-store'
import { renderWithProviders } from '@/test/render'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/pages/auth/login/api/login', () => ({ login: vi.fn() }))

import { login as loginApi } from '@/pages/auth/login/api/login'
import { Login } from './login'

const loginMock = vi.mocked(loginApi)

describe('<Login />', () => {
	beforeEach(() => {
		loginMock.mockReset()
		useAuthStore.setState({
			user: null,
			token: null,
			refreshToken: null,
			isLoading: false,
			error: null
		})
	})

	it('отправляет введённые логин и пароль в API', async () => {
		loginMock.mockResolvedValueOnce({
			access_token: 'A',
			refresh_token: 'R',
			username: 'alice',
			role: 'user'
		})
		const user = userEvent.setup()
		renderWithProviders(<Login setIsLogin={() => {}} />)

		await user.type(screen.getByPlaceholderText(/username/i), 'alice')
		await user.type(screen.getByPlaceholderText(/пароль/i), 'secret')
		await user.click(screen.getByRole('button', { name: /войти/i }))

		await waitFor(() =>
			expect(loginMock).toHaveBeenCalledWith({
				username: 'alice',
				password: 'secret'
			})
		)
	})

	it('показывает серверную ошибку', async () => {
		loginMock.mockRejectedValueOnce(new Error('boom'))
		const user = userEvent.setup()
		renderWithProviders(<Login setIsLogin={() => {}} />)
		await user.type(screen.getByPlaceholderText(/username/i), 'a')
		await user.type(screen.getByPlaceholderText(/пароль/i), 'b')
		await user.click(screen.getByRole('button', { name: /войти/i }))
		expect(await screen.findByText(/ошибка авторизации/i)).toBeInTheDocument()
	})
})
