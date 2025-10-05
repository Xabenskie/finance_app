import { Clock } from 'lucide-react'
import { useEffect } from 'react'
import { useCategoriesStore } from '../categories/store/categories-store'
import RootHeader from './components/root-header'
import { RootTopIncrements } from './components/root-top-incremens'
import RootTrands from './components/root-trands'
import { useTransactionsStore } from './store/transactions-store'

export function RootPage() {
	const { getStats, stats, getTransactions, transactions } =
		useTransactionsStore()
	const { categories, fetchCategories } = useCategoriesStore()

	useEffect(() => {
		getStats()
		getTransactions()
		fetchCategories()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='w-full p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
					Личный финансовый учёт
				</h1>
				<p className='text-muted-foreground text-sm md:text-base'>
					Обзор за{' '}
					{new Date().toLocaleString('ru-RU', {
						month: 'long',
						year: 'numeric'
					})}
				</p>
			</div>

			{/* Основные метрики */}
			<RootHeader
				income={stats.income}
				expense={stats.expense}
				balance={stats.balance}
				transactions={transactions.length}
			/>

			{/* Аналитика */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
				<RootTrands transactions={transactions} />

				<RootTopIncrements transactions={transactions} />

				{/* Бюджеты и транзакции */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
					<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[160px] md:min-h-[180px]'>
						<div className='flex items-center gap-3 mb-4'>
							<div className='p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10'>
								<Clock className='w-5 h-5 md:w-6 md:h-6 text-indigo-500' />
							</div>
							<div>
								<h3 className='font-semibold text-base md:text-lg'>
									Последние транзакции
								</h3>
								<p className='text-muted-foreground text-xs md:text-sm'>
									Недавние доходы и расходы
								</p>
							</div>
						</div>
						{transactions.length === 0 ? (
							<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
								Транзакций пока нет
							</div>
						) : (
							<div className='space-y-2'>
								{[...transactions]
									.reverse()
									.slice(0, 3)
									.map(transaction => {
										const category = categories.find(
											c => c.id === transaction.category_id
										)
										return (
											<div
												key={transaction.id}
												className='flex items-center justify-between p-2 rounded-lg bg-muted/20'
											>
												<div className='flex items-center gap-2'>
													<div
														className={`w-2 h-2 rounded-full ${
															transaction.type === 'доход'
																? 'bg-green-500'
																: 'bg-red-500'
														}`}
													/>
													<div>
														<p className='text-sm font-medium'>
															{transaction.description}
														</p>
														<p className='text-xs text-muted-foreground'>
															{category?.name}
														</p>
													</div>
												</div>
												<span
													className={`text-sm font-bold ${
														transaction.type === 'доход'
															? 'text-green-600'
															: 'text-red-600'
													}`}
												>
													{transaction.type === 'доход' ? '+' : '-'}
													{transaction.amount.toLocaleString('ru-RU')} ₽
												</span>
											</div>
										)
									})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
