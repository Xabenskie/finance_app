import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'

export default function RootHeader({
	income,
	expense,
	balance,
	transactions
}: {
	income: number
	expense: number
	balance: number
	transactions: number
}) {
	return (
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
					<span className='font-semibold text-sm md:text-base'>Транзакций</span>
					<div className='p-2 rounded-xl bg-purple-500/10'>
						<Receipt className='w-4 h-4 md:w-5 md:h-5 text-purple-500' />
					</div>
				</div>
				<div className='relative text-xl md:text-2xl lg:text-3xl font-bold text-purple-600'>
					{transactions}
				</div>
			</div>
		</div>
	)
}
