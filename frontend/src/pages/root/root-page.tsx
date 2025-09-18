import { Clock } from 'lucide-react'
import RootHeader from './components/root-header'
import { RootTopIncrements } from './components/root-top-incremens'
import RootTrands from './components/root-trands'

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
			<RootHeader
				income={income}
				expense={expense}
				balance={balance}
				transactions={transactions}
			/>

			{/* Аналитика */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6'>
				<RootTrands />

				<RootTopIncrements />

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
						<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
							Транзакций пока нет
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
