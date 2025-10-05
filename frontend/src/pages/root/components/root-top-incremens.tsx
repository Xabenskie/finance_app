import { PieChart as PieChartIcon } from 'lucide-react'
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip
} from 'recharts'

interface Transaction {
	id: string
	type: 'доход' | 'расход'
	amount: number
	category_id: string
	date: string
	description: string
}

interface RootTopIncrementsProps {
	transactions: Transaction[]
}

export function RootTopIncrements({ transactions }: RootTopIncrementsProps) {
	// Цвета для диаграммы
	const COLORS = ['#6366f1', '#f59e42'] // Фиолетовый для доходов, оранжевый для расходов

	// Подсчитываем общие доходы и расходы за все время
	const getIncomeExpenseData = () => {
		let totalIncome = 0
		let totalExpense = 0

		transactions.forEach(transaction => {
			if (transaction.type === 'доход') {
				totalIncome += transaction.amount || 0
			} else {
				totalExpense += transaction.amount || 0
			}
		})

		// Возвращаем данные для диаграммы
		if (totalIncome === 0 && totalExpense === 0) {
			return []
		}

		return [
			{
				name: 'Доходы',
				value: totalIncome,
				type: 'доход'
			},
			{
				name: 'Расходы',
				value: totalExpense,
				type: 'расход'
			}
		].filter(item => item.value > 0) // Показываем только категории с суммой больше 0
	}

	const chartData = getIncomeExpenseData()
	const totalAmount = chartData.reduce((sum, item) => sum + item.value, 0)

	return (
		<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[200px] md:min-h-[320px]'>
			<div className='flex items-center gap-3 mb-4'>
				<div className='p-2 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10'>
					<PieChartIcon className='w-5 h-5 md:w-6 md:h-6 text-pink-500' />
				</div>
				<div>
					<h3 className='font-semibold text-base md:text-lg'>
						Соотношение доходов и расходов
					</h3>
					<p className='text-muted-foreground text-xs md:text-sm'>
						За все время
					</p>
				</div>
			</div>

			{chartData.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-muted-foreground text-sm'>
					Нет транзакций
				</div>
			) : (
				<div className='h-[200px] md:h-[240px]'>
					<ResponsiveContainer width='100%' height='100%'>
						<PieChart>
							<Pie
								data={chartData}
								cx='50%'
								cy='50%'
								innerRadius={40}
								outerRadius={80}
								paddingAngle={2}
								dataKey='value'
							>
								{chartData.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value: number, name: string) => [
									`${value.toLocaleString('ru-RU')} ₽`,
									name
								]}
								contentStyle={{
									backgroundColor: 'hsl(var(--background))',
									border: '1px solid hsl(var(--border))',
									borderRadius: '8px'
								}}
							/>
							<Legend
								verticalAlign='bottom'
								height={36}
								formatter={value => (
									<span style={{ fontSize: '12px' }}>{value}</span>
								)}
							/>
						</PieChart>
					</ResponsiveContainer>

					{/* Показываем общую сумму */}
					<div className='text-center mt-2'>
						<p className='text-xs text-muted-foreground'>
							Общий оборот: {totalAmount.toLocaleString('ru-RU')} ₽
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
