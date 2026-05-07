import { api } from '@/api/client'

interface ICreateTransaction {
	type: 'доход' | 'расход'
	amount: number
	category_id: string
	date: string
	description: string
}

export interface TransactionItem {
	id: string
	type: 'доход' | 'расход'
	amount: number
	category_id: string
	date: string
	description: string
}

export interface TransactionPage {
	items: TransactionItem[]
	total: number
	page: number
	per_page: number
}

export interface TransactionFilters {
	page?: number
	per_page?: number
	type?: string
	category_id?: string
}

export const getTransactionsStats = async () => {
	const { data } = await api.get('/transactions/stats')
	return data
}

export const getTransactions = async (
	filters?: TransactionFilters
): Promise<TransactionPage> => {
	const params: Record<string, string | number> = {}
	if (filters?.page) params.page = filters.page
	if (filters?.per_page) params.per_page = filters.per_page
	if (filters?.type) params.type = filters.type
	if (filters?.category_id) params.category_id = filters.category_id

	const { data } = await api.get<TransactionPage>('/transactions/', { params })
	return data
}

export const createTransaction = async (transaction: ICreateTransaction) => {
	const { data } = await api.post('/transactions', transaction)
	return data
}
