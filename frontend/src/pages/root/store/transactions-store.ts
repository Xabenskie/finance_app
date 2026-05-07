import { create } from 'zustand'
import {
	createTransaction,
	getTransactions,
	getTransactionsStats,
	type TransactionFilters,
	type TransactionItem
} from '../api/transactions'

type TransactionsStore = {
	stats: {
		balance: number
		income: number
		expense: number
	}
	transactions: TransactionItem[]
	total: number
	page: number
	perPage: number

	getStats: () => Promise<void>
	getTransactions: (filters?: TransactionFilters) => Promise<void>
	createTransaction: (
		t: Omit<TransactionItem, 'id'>,
		filters?: TransactionFilters
	) => void
}

export const useTransactionsStore = create<TransactionsStore>(set => ({
	stats: {
		balance: 0,
		income: 0,
		expense: 0
	},
	transactions: [],
	total: 0,
	page: 1,
	perPage: 10,

	getStats: async () => {
		const data = await getTransactionsStats()
		set({ stats: data })
	},

	getTransactions: async (filters?: TransactionFilters) => {
		const data = await getTransactions(filters)
		set({
			transactions: data.items,
			total: data.total,
			page: data.page,
			perPage: data.per_page
		})
	},

	createTransaction: async (transaction, filters) => {
		await createTransaction(transaction)
		const data = await getTransactions(filters)
		set({
			transactions: data.items,
			total: data.total,
			page: data.page,
			perPage: data.per_page
		})
	}
}))
