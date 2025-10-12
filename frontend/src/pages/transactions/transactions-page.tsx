import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Calendar,
	FileText,
	MoreHorizontal,
	Plus,
	Tag,
	TrendingDown,
	TrendingUp
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCategoriesStore } from '../categories/store/categories-store'
import { useTransactionsStore } from '../root/store/transactions-store'

export function TransactionsPage() {
	const { transactions, getTransactions, createTransaction } =
		useTransactionsStore()
	const { categories, fetchCategories } = useCategoriesStore()

	const [transactionType, setTransactionType] = useState<'доход' | 'расход'>(
		'расход'
	)
	const [amount, setAmount] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [date, setDate] = useState(
		new Date().toISOString().split('T')[0].split('-').reverse().join('.')
	)
	const [filter, setFilter] = useState<'все' | 'доход' | 'расход'>('все')

	useEffect(() => {
		fetchCategories()
		getTransactions()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Фильтрация транзакций
	const filteredTransactions = transactions.filter(transaction => {
		if (filter === 'все') return true
		return transaction.type === filter
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Проверяем, заполнены ли все поля
		if (!amount || !category || !description || !date) {
			alert('Пожалуйста, заполните все поля.')
			return
		}

		// Преобразуем дату из формата "dd.mm.yyyy" в "yyyy-mm-dd"
		const formattedDate = date.split('.').reverse().join('-')

		createTransaction({
			type: transactionType,
			amount: Number(amount),
			category_id: category,
			date: formattedDate,
			description
		})

		// Сброс формы
		setTransactionType('расход')
		setAmount('')
		setCategory('')
		setDescription('')
		setDate(
			new Date().toISOString().split('T')[0].split('-').reverse().join('.')
		)
	}

	return (
		<div className='w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6'>
			{/* Заголовок */}

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Форма добавления транзакции */}
				<div className='lg:col-span-1 space-y-6'>
					<div className='border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-6'>
							<div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10'>
								<Plus className='w-5 h-5 text-blue-500' />
							</div>
							<div>
								<h2 className='font-semibold text-lg'>Добавить транзакцию</h2>
								<p className='text-muted-foreground text-sm'>
									Зафиксируйте доход или расход
								</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className='space-y-4'>
							{/* Тип транзакции */}
							<div className='space-y-2'>
								<label className='text-sm font-medium'>Тип транзакции</label>
								<div className='flex gap-2'>
									<Button
										type='button'
										variant={
											transactionType === 'доход' ? 'default' : 'outline'
										}
										size='sm'
										onClick={() => setTransactionType('доход')}
										className='flex-1 gap-2'
									>
										<TrendingUp className='w-4 h-4' />
										Доход
									</Button>
									<Button
										type='button'
										variant={
											transactionType === 'расход' ? 'default' : 'outline'
										}
										size='sm'
										onClick={() => setTransactionType('расход')}
										className='flex-1 gap-2'
									>
										<TrendingDown className='w-4 h-4' />
										Расход
									</Button>
								</div>
							</div>

							{/* Сумма */}
							<div className='space-y-2'>
								<label className='text-sm font-medium flex items-center gap-2'>
									Сумма (₽)
								</label>
								<Input
									type='number'
									placeholder='0.00'
									value={amount}
									onChange={e => setAmount(e.target.value)}
									className='text-lg font-semibold'
								/>
							</div>

							{/* Категория */}
							<div className='space-y-2'>
								<label className='text-sm font-medium flex items-center gap-2'>
									<Tag className='w-4 h-4' />
									Категория
								</label>
								<select
									value={category}
									onChange={e => setCategory(e.target.value)}
									className='w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
								>
									<option value='' disabled>
										Выберите категорию
									</option>
									{categories.map(
										cat =>
											cat.type === transactionType && (
												<option key={cat.id} value={cat.id}>
													{cat.name}
												</option>
											)
									)}
								</select>
							</div>

							{/* Описание */}
							<div className='space-y-2'>
								<label className='text-sm font-medium flex items-center gap-2'>
									<FileText className='w-4 h-4' />
									Описание
								</label>
								<Input
									placeholder='Краткое описание транзакции'
									value={description}
									onChange={e => setDescription(e.target.value)}
								/>
							</div>

							{/* Дата */}
							<div className='space-y-2'>
								<label className='text-sm font-medium flex items-center gap-2'>
									<Calendar className='w-4 h-4' />
									Дата
								</label>
								<Input
									type='date'
									value={date.split('.').reverse().join('-')}
									onChange={e =>
										setDate(e.target.value.split('-').reverse().join('.'))
									}
								/>
							</div>

							<Button
								type='submit'
								className='w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
							>
								<Plus className='w-4 h-4' />
								Добавить транзакцию
							</Button>
						</form>
					</div>
				</div>

				{/* Список транзакций */}
				<div className='lg:col-span-2 space-y-4'>
					{/* Фильтры */}
					<div className='flex gap-2'>
						<Button
							variant={filter === 'все' ? 'default' : 'outline'}
							onClick={() => setFilter('все')}
							size='sm'
						>
							Все ({transactions.length})
						</Button>
						<Button
							variant={filter === 'доход' ? 'default' : 'outline'}
							onClick={() => setFilter('доход')}
							size='sm'
							className={
								filter === 'доход'
									? ''
									: 'border-green-500 text-green-600 hover:bg-green-50'
							}
						>
							Доходы ({transactions.filter(t => t.type === 'доход').length})
						</Button>
						<Button
							variant={filter === 'расход' ? 'default' : 'outline'}
							onClick={() => setFilter('расход')}
							size='sm'
							className={
								filter === 'расход'
									? ''
									: 'border-red-500 text-red-600 hover:bg-red-50'
							}
						>
							Расходы ({transactions.filter(t => t.type === 'расход').length})
						</Button>
					</div>

					<div className='border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='font-semibold text-lg'>Последние транзакции</h2>
							<Button variant='ghost' size='sm'>
								<MoreHorizontal className='w-4 h-4' />
							</Button>
						</div>

						{transactions.length === 0 ? (
							<div className='text-center py-12'>
								<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center'>
									<FileText className='w-6 h-6 text-muted-foreground' />
								</div>
								<p className='text-muted-foreground'>Транзакций пока нет</p>
								<p className='text-sm text-muted-foreground'>
									Добавьте первую транзакцию
								</p>
							</div>
						) : filteredTransactions.length === 0 ? (
							<div className='text-center py-12'>
								<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center'>
									<FileText className='w-6 h-6 text-muted-foreground' />
								</div>
								<p className='text-muted-foreground'>
									Нет транзакций по фильтру
								</p>
								<p className='text-sm text-muted-foreground'>
									Попробуйте изменить фильтр
								</p>
							</div>
						) : (
							<div className='space-y-3'>
								{[...filteredTransactions].reverse().map(transaction => (
									<div
										key={transaction.id}
										className='group p-4 rounded-xl border border-border/30 hover:border-border/60 bg-gradient-to-r from-background to-background/50 hover:shadow-md transition-all duration-200'
									>
										<div className='flex items-center justify-between'>
											<div className='flex-1'>
												<div className='flex items-center gap-3 mb-1'>
													<div
														className={`p-1.5 rounded-lg ${
															transaction.type === 'доход'
																? 'bg-green-500/10'
																: 'bg-red-500/10'
														}`}
													>
														{transaction.type === 'доход' ? (
															<TrendingUp className='w-4 h-4 text-green-500' />
														) : (
															<TrendingDown className='w-4 h-4 text-red-500' />
														)}
													</div>
													<h3 className='font-medium'>
														{transaction.description}
													</h3>
												</div>
												<div className='flex items-center gap-2 text-sm text-muted-foreground'>
													<span>
														{
															categories.find(
																c => c.id === transaction.category_id
															)?.name
														}
													</span>
													<span>•</span>
													<span>{transaction.date}</span>
												</div>
											</div>
											<div
												className={`text-lg font-bold ${
													transaction.type === 'доход'
														? 'text-green-600'
														: 'text-red-600'
												}`}
											>
												{transaction.type === 'доход' ? '+' : '-'}
												{(transaction.amount || 0).toLocaleString('ru-RU')} ₽
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
