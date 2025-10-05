import { api } from '@/api/client'

interface ICreateTransaction {
	type: 'доход' | 'расход'
	amount: number
	category_id: string
	date: string
	description: string
}

export const getTransactionsStats = async () => {
	const { data } = await api.get('/transactions/stats')
	return data
}

export const getTransactions = async () => {
	const { data } = await api.get('/transactions/')
	return data
}

export const createTransaction = async (transaction: ICreateTransaction) => {
	const { data } = await api.post('/transactions', transaction)
	return data
}
