import {
	BarChart3,
	Clock,
	PieChart,
	Receipt,
	Target,
	TrendingDown,
	TrendingUp,
	Wallet
} from 'lucide-react'

export function RootPage() {
	// Пример данных, в реальном приложении брать из стора/апи
	const balance = 0
	const income = 0
	const expense = 0
	const transactions = 0
	const month = 'сентябрь 2025 г.'

	return (
		<div className='w-full p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
					Личный финансовый учёт
				</h1>
				<p className='text-muted-foreground text-sm md:text-base'>
					Обзор за {month}
				</p>
			</div>

			{/* Основные метрики */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
				<div className='group relative overflow-hidden border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 hover:border-green-500/30'>
					<div className='absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
					<div className='relative flex items-center justify-between mb-3'>
						<span className='font-semibold text-sm md:text-base'>Доходы</span>
						<div className='p-2 rounded-xl bg-green-500/10'>
							<TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-green-500' />
						</div>
					</div>
					<div className='relative text-xl md:text-2xl lg:text-3xl font-bold text-green-600'>
						{income} ₽
					</div>
				</div>

				<div className='group relative overflow-hidden border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:border-red-500/30'>
					<div className='absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
					<div className='relative flex items-center justify-between mb-3'>
						<span className='font-semibold text-sm md:text-base'>Расходы</span>
						<div className='p-2 rounded-xl bg-red-500/10'>
							<TrendingDown className='w-4 h-4 md:w-5 md:h-5 text-red-500' />
						</div>
					</div>
					<div className='relative text-xl md:text-2xl lg:text-3xl font-bold text-red-600'>
						{expense} ₽
					</div>
				</div>

				<div className='group relative overflow-hidden border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:border-blue-500/30'>
					<div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
					<div className='relative flex items-center justify-between mb-3'>
						<span className='font-semibold text-sm md:text-base'>Баланс</span>
						<div className='p-2 rounded-xl bg-blue-500/10'>
							<Wallet className='w-4 h-4 md:w-5 md:h-5 text-blue-500' />
						</div>
					</div>
					<div className='relative text-xl md:text-2xl lg:text-3xl font-bold text-blue-600'>
						{balance} ₽
					</div>
				</div>

				<div className='group relative overflow-hidden border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/30'>
					<div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
					<div className='relative flex items-center justify-between mb-3'>
						<span className='font-semibold text-sm md:text-base'>
							Транзакций
						</span>
						<div className='p-2 rounded-xl bg-purple-500/10'>
							<Receipt className='w-4 h-4 md:w-5 md:h-5 text-purple-500' />
						</div>
					</div>
					<div className='relative text-xl md:text-2xl lg:text-3xl font-bold text-purple-600'>
						{transactions}
					</div>
				</div>
			</div>

			{/* Аналитика */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
				<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[200px] md:min-h-[240px]'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='p-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10'>
							<BarChart3 className='w-5 h-5 md:w-6 md:h-6 text-orange-500' />
						</div>
						<div>
							<h3 className='font-semibold text-base md:text-lg'>
								Тренд последних 6 месяцев
							</h3>
							<p className='text-muted-foreground text-xs md:text-sm'>
								Динамика доходов и расходов
							</p>
						</div>
					</div>
					<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
						Нет данных для отображения
					</div>
				</div>

				<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[200px] md:min-h-[240px]'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10'>
							<PieChart className='w-5 h-5 md:w-6 md:h-6 text-pink-500' />
						</div>
						<div>
							<h3 className='font-semibold text-base md:text-lg'>
								Топ категории расходов
							</h3>
							<p className='text-muted-foreground text-xs md:text-sm'>
								За текущий месяц
							</p>
						</div>
					</div>
					<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
						Нет расходов за месяц
					</div>
				</div>
			</div>

			{/* Бюджеты и транзакции */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
				<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[160px] md:min-h-[180px]'>
					<div className='flex items-center gap-3 mb-4'>
						<div className='p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10'>
							<Target className='w-5 h-5 md:w-6 md:h-6 text-emerald-500' />
						</div>
						<div>
							<h3 className='font-semibold text-base md:text-lg'>
								Использование бюджетов
							</h3>
							<p className='text-muted-foreground text-xs md:text-sm'>
								Отслеживание расходов по категориям
							</p>
						</div>
					</div>
					<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
						Бюджеты не настроены
					</div>
				</div>

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
					<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
						Транзакций пока нет
					</div>
				</div>
			</div>
		</div>
	)
}
