import { CategoriesPage } from '@/pages/categories/categories-page'
import { useCategoriesStore } from '@/pages/categories/store/categories-store'
import { renderWithProviders } from '@/test/render'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/pages/categories/api/categories', () => ({
	getCategories: vi.fn(),
	createCategory: vi.fn(),
	deleteCategory: vi.fn()
}))

vi.mock('@/hooks/use-auth', () => ({ useAuth: vi.fn() }))

import { useAuth } from '@/hooks/use-auth'
import { getCategories } from '@/pages/categories/api/categories'

const useAuthMock = vi.mocked(useAuth)
const getCatsMock = vi.mocked(getCategories)

function setRole(role: 'user' | 'manager' | 'admin') {
	useAuthMock.mockReturnValue({
		user: { username: 'x', role },
		isAuthenticated: true,
		isLoading: false,
		role,
		login: vi.fn(),
		logout: vi.fn()
	})
	useCategoriesStore.setState({ categories: [] })
}

describe('<CategoriesPage /> (RBAC в UI)', () => {
	beforeEach(() => {
		getCatsMock.mockReset()
		getCatsMock.mockResolvedValue([
			{ id: 'c1', name: 'Зарплата', type: 'доход' }
		])
	})

	it('user не видит форму "Добавить категорию"', async () => {
		setRole('user')
		renderWithProviders(<CategoriesPage />, { withAuth: false })
		expect(await screen.findByText('Зарплата')).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: /добавить категорию/i })
		).not.toBeInTheDocument()
	})

	it('manager видит форму', async () => {
		setRole('manager')
		renderWithProviders(<CategoriesPage />, { withAuth: false })
		expect(
			await screen.findByRole('button', { name: /добавить категорию/i })
		).toBeInTheDocument()
	})
})
