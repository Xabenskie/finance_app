import { BarChart3 } from 'lucide-react'

export default function RootTrands() {
	return (
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
	)
}
