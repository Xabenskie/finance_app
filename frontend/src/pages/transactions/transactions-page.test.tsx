import { useCategoriesStore } from '@/pages/categories/store/categories-store'
import { useTransactionsStore } from '@/pages/root/store/transactions-store'
import { TransactionsPage } from '@/pages/transactions/transactions-page'
import { renderWithProviders } from '@/test/render'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/pages/root/api/transactions', () => ({
	getTransactions: vi.fn(),
	getTransactionsStats: vi.fn(),
	createTransaction: vi.fn()
}))
vi.mock('@/pages/categories/api/categories', () => ({
	getCategories: vi.fn(),
	createCategory: vi.fn(),
	deleteCategory: vi.fn()
}))

import { getCategories } from '@/pages/categories/api/categories'
import { getTransactions } from '@/pages/root/api/transactions'

const getTxMock = vi.mocked(getTransactions)
const getCatsMock = vi.mocked(getCategories)

const tx = [
	{
		id: 't1',
		type: 'расход' as const,
		amount: 250,
		category_id: 'c-food',
		description: 'Lunch',
		date: '2025-01-01'
	},
	{
		id: 't2',
		type: 'доход' as const,
		amount: 1000,
		category_id: 'c-salary',
		description: 'Salary',
		date: '2025-01-02'
	}
]

describe('<TransactionsPage />', () => {
	beforeEach(() => {
		getTxMock.mockReset()
		getCatsMock.mockReset()
		useTransactionsStore.setState({
			transactions: [],
			total: 0,
			page: 1,
			perPage: 10,
			stats: { balance: 0, income: 0, expense: 0 }
		})
		useCategoriesStore.setState({ categories: [] })
		getCatsMock.mockResolvedValue([
			{ id: 'c-food', name: 'Еда', type: 'расход' },
			{ id: 'c-salary', name: 'Зарплата', type: 'доход' }
		])
	})

	it('отображает список транзакций', async () => {
		getTxMock.mockResolvedValue({
			items: tx,
			total: 2,
			page: 1,
			per_page: 10
		})
		renderWithProviders(<TransactionsPage />)
		expect(await screen.findByText('Lunch')).toBeInTheDocument()
		expect(screen.getByText('Salary')).toBeInTheDocument()
	})

	it('фильтр "Доходы" перезапрашивает API с type=доход', async () => {
		getTxMock.mockResolvedValue({
			items: tx,
			total: 2,
			page: 1,
			per_page: 10
		})
		const user = userEvent.setup()
		renderWithProviders(<TransactionsPage />)
		await screen.findByText('Lunch')

		getTxMock.mockClear()
		await user.click(screen.getByRole('button', { name: /доходы/i }))
		await waitFor(() =>
			expect(getTxMock).toHaveBeenCalledWith({
				page: 1,
				per_page: 10,
				type: 'доход',
				category_id: undefined
			})
		)
	})
})
