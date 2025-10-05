import { create } from 'zustand'
import {
	createTransaction,
	getTransactions,
	getTransactionsStats
} from '../api/transactions'

type TransactionsStore = {
	stats: {
		balance: number
		income: number
		expense: number
	}
	transactions: {
		id: string
		type: 'доход' | 'расход'
		amount: number
		category_id: string
		date: string
		description: string
	}[]

	getStats: () => Promise<void>
	getTransactions: () => Promise<void>
	createTransaction: ({
		type,
		amount,
		category_id,
		date,
		description
	}: Omit<TransactionsStore['transactions'][number], 'id'>) => void
}

export const useTransactionsStore = create<TransactionsStore>(set => ({
	stats: {
		balance: 0,
		income: 0,
		expense: 0
	},
	transactions: [],

	getStats: async () => {
		await getTransactionsStats().then(data => {
			set({ stats: data })
		})
	},

	getTransactions: async () => {
		await getTransactions().then(data => {
			set({ transactions: data })
			console.log(data)
		})
	},

	createTransaction: async transaction => {
		await createTransaction(transaction)
		// Обновляем список транзакций после создания
		await getTransactions().then(data => {
			set({ transactions: data })
		})
	}
}))
