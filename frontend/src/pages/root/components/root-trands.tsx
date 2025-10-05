import { BarChart3 } from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

interface Transaction {
	id: string
	type: 'доход' | 'расход'
	amount: number
	category_id: string
	date: string
	description: string
}

interface RootTrandsProps {
	transactions: Transaction[]
}

export default function RootTrands({ transactions }: RootTrandsProps) {
	// Группируем транзакции по дням текущего месяца
	const getDailyData = () => {
		const currentMonth = new Date().getMonth()
		const currentYear = new Date().getFullYear()

		const dailyData: { [key: string]: { доходы: number; расходы: number } } = {}

		transactions
			.filter(transaction => {
				const transactionDate = new Date(transaction.date)
				return (
					transactionDate.getMonth() === currentMonth &&
					transactionDate.getFullYear() === currentYear
				)
			})
			.forEach(transaction => {
				const date = new Date(transaction.date)
				const dayKey = `${date.getFullYear()}-${String(
					date.getMonth() + 1
				).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

				if (!dailyData[dayKey]) {
					dailyData[dayKey] = { доходы: 0, расходы: 0 }
				}

				if (transaction.type === 'доход') {
					dailyData[dayKey].доходы += transaction.amount || 0
				} else {
					dailyData[dayKey].расходы += transaction.amount || 0
				}
			})

		// Преобразуем в массив для графика
		return Object.entries(dailyData)
			.map(([day, data]) => ({
				day: new Date(day).toLocaleDateString('ru-RU', {
					day: 'numeric',
					month: 'short'
				}),
				доходы: data.доходы,
				расходы: data.расходы
			}))
			.sort(
				(a, b) =>
					new Date(a.day + ' 2025').getTime() -
					new Date(b.day + ' 2025').getTime()
			)
	}

	const chartData = getDailyData()

	return (
		<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[200px] md:min-h-[320px]'>
			<div className='flex items-center gap-3 mb-4'>
				<div className='p-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10'>
					<BarChart3 className='w-5 h-5 md:w-6 md:h-6 text-orange-500' />
				</div>
				<div>
					<h3 className='font-semibold text-base md:text-lg'>
						Динамика за текущий месяц
					</h3>
					<p className='text-muted-foreground text-xs md:text-sm'>
						Доходы и расходы по дням
					</p>
				</div>
			</div>

			{chartData.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
					Нет данных для отображения
				</div>
			) : (
				<div className='h-[200px] md:h-[240px]'>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={chartData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray='3 3' className='opacity-30' />
							<XAxis
								dataKey='day'
								className='text-xs'
								tick={{ fontSize: 12 }}
							/>
							<YAxis
								className='text-xs'
								tick={{ fontSize: 12 }}
								tickFormatter={value => `${value.toLocaleString('ru-RU')} ₽`}
							/>
							<Tooltip
								formatter={(value: number, name: string) => [
									`${value.toLocaleString('ru-RU')} ₽`,
									name
								]}
								labelStyle={{
									color: 'hsl(var(--foreground))',
									fontWeight: '600',
									marginBottom: '4px'
								}}
								contentStyle={{
									backgroundColor: 'rgba(255, 255, 255, 0.95)',
									border: '2px solid hsl(var(--primary))',
									borderRadius: '12px',
									boxShadow:
										'0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
									color: 'hsl(var(--foreground))',
									fontSize: '14px',
									fontWeight: '500',
									backdropFilter: 'blur(8px)'
								}}
								itemStyle={{
									color: 'hsl(var(--foreground))',
									fontWeight: '600'
								}}
								cursor={{
									fill: 'rgba(59, 130, 246, 0.1)',
									stroke: 'rgba(59, 130, 246, 0.3)',
									strokeWidth: 1
								}}
								offset={30}
								allowEscapeViewBox={{ x: true, y: true }}
								wrapperStyle={{
									zIndex: 1000,
									pointerEvents: 'none'
								}}
							/>
							<Legend
								wrapperStyle={{
									color: 'hsl(var(--foreground))',
									fontSize: '14px',
									fontWeight: '500'
								}}
							/>
							<Bar
								dataKey='доходы'
								fill='#22c55e'
								name='Доходы'
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								dataKey='расходы'
								fill='#ef4444'
								name='Расходы'
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			)}
		</div>
	)
}
