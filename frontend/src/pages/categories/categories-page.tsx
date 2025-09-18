import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Briefcase,
	Car,
	DollarSign,
	Edit3,
	Gamepad2,
	Package,
	Plus,
	Trash2,
	TrendingDown,
	TrendingUp,
	Utensils,
	Zap
} from 'lucide-react'
import { useState } from 'react'

type CategoryType = 'income' | 'expense' | 'both'

interface Category {
	id: number
	name: string
	type: CategoryType
	icon: string
	color: string
}

export function CategoriesPage() {
	const [categoryName, setCategoryName] = useState('')
	const [categoryType, setCategoryType] = useState<CategoryType>('expense')

	// Пример данных категорий
	const [categories, setCategories] = useState<Category[]>([
		{
			id: 1,
			name: 'Продукты',
			type: 'expense',
			icon: 'Package',
			color: 'orange'
		},
		{ id: 2, name: 'Транспорт', type: 'expense', icon: 'Car', color: 'blue' },
		{
			id: 3,
			name: 'Развлечения',
			type: 'expense',
			icon: 'Gamepad2',
			color: 'purple'
		},
		{
			id: 4,
			name: 'Коммунальные услуги',
			type: 'expense',
			icon: 'Zap',
			color: 'yellow'
		},
		{
			id: 5,
			name: 'Зарплата',
			type: 'income',
			icon: 'DollarSign',
			color: 'green'
		},
		{
			id: 6,
			name: 'Фриланс',
			type: 'income',
			icon: 'Briefcase',
			color: 'emerald'
		}
	])

	const getIconComponent = (iconName: string) => {
		const icons: Record<string, React.ComponentType<{ className?: string }>> = {
			Package,
			Car,
			Utensils,
			Gamepad2,
			Zap,
			DollarSign,
			Briefcase
		}
		const IconComponent = icons[iconName] || Package
		return IconComponent
	}

	const getColorClasses = (color: string) => {
		const colors: Record<string, { bg: string; text: string; border: string }> =
			{
				orange: {
					bg: 'bg-orange-500/10',
					text: 'text-orange-500',
					border: 'border-orange-500/20'
				},
				blue: {
					bg: 'bg-blue-500/10',
					text: 'text-blue-500',
					border: 'border-blue-500/20'
				},
				purple: {
					bg: 'bg-purple-500/10',
					text: 'text-purple-500',
					border: 'border-purple-500/20'
				},
				yellow: {
					bg: 'bg-yellow-500/10',
					text: 'text-yellow-500',
					border: 'border-yellow-500/20'
				},
				green: {
					bg: 'bg-green-500/10',
					text: 'text-green-500',
					border: 'border-green-500/20'
				},
				emerald: {
					bg: 'bg-emerald-500/10',
					text: 'text-emerald-500',
					border: 'border-emerald-500/20'
				}
			}
		return colors[color] || colors.orange
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!categoryName.trim()) return

		const newCategory: Category = {
			id: Date.now(),
			name: categoryName,
			type: categoryType,
			icon: 'Package',
			color: categoryType === 'income' ? 'green' : 'blue'
		}

		setCategories([...categories, newCategory])
		setCategoryName('')
	}

	const deleteCategory = (id: number) => {
		setCategories(categories.filter(cat => cat.id !== id))
	}

	const incomeCategories = categories.filter(cat => cat.type === 'income')
	const expenseCategories = categories.filter(cat => cat.type === 'expense')

	return (
		<div className='w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6'>
			{/* Заголовок */}
			<div className='space-y-2'>
				<h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
					Управление категориями
				</h1>
				<p className='text-muted-foreground text-sm md:text-base'>
					Создавайте и управляйте категориями для классификации доходов и
					расходов
				</p>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Форма добавления категории */}
				<div className='lg:col-span-1'>
					<div className='border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-6'>
							<div className='p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10'>
								<Plus className='w-5 h-5 text-blue-500' />
							</div>
							<div>
								<h2 className='font-semibold text-lg'>Добавить категорию</h2>
								<p className='text-muted-foreground text-sm'>
									Создайте новую категорию для организации транзакций
								</p>
							</div>
						</div>

						<form onSubmit={handleSubmit} className='space-y-4'>
							{/* Название категории */}
							<div className='space-y-2'>
								<label className='text-sm font-medium'>
									Название категории
								</label>
								<Input
									placeholder='Например: Продукты, Зарплата, Развлечения'
									value={categoryName}
									onChange={e => setCategoryName(e.target.value)}
									className='text-base'
								/>
							</div>

							{/* Тип категории */}
							<div className='space-y-2'>
								<label className='text-sm font-medium'>Тип категории</label>
								<div className='grid grid-cols-2 gap-2'>
									<Button
										type='button'
										variant={categoryType === 'income' ? 'default' : 'outline'}
										size='sm'
										onClick={() => setCategoryType('income')}
										className='gap-2'
									>
										<TrendingUp className='w-4 h-4' />
										Доходы
									</Button>
									<Button
										type='button'
										variant={categoryType === 'expense' ? 'default' : 'outline'}
										size='sm'
										onClick={() => setCategoryType('expense')}
										className='gap-2'
									>
										<TrendingDown className='w-4 h-4' />
										Расходы
									</Button>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
								disabled={!categoryName.trim()}
							>
								<Plus className='w-4 h-4' />
								Добавить категорию
							</Button>
						</form>
					</div>
				</div>

				{/* Список категорий */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Категории доходов */}
					<div className='border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-6'>
							<div className='p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10'>
								<TrendingUp className='w-5 h-5 text-green-500' />
							</div>
							<div>
								<h2 className='font-semibold text-lg'>Категории доходов</h2>
								<p className='text-muted-foreground text-sm'>
									{incomeCategories.length} категорий
								</p>
							</div>
						</div>

						{incomeCategories.length === 0 ? (
							<div className='text-center py-8'>
								<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center'>
									<TrendingUp className='w-6 h-6 text-green-500' />
								</div>
								<p className='text-muted-foreground'>Нет категорий доходов</p>
								<p className='text-sm text-muted-foreground'>
									Добавьте первую категорию
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								{incomeCategories.map(category => {
									const IconComponent = getIconComponent(category.icon)
									const colorClasses = getColorClasses(category.color)
									return (
										<div
											key={category.id}
											className={`group p-4 rounded-xl border ${colorClasses.border} ${colorClasses.bg} hover:shadow-md transition-all duration-200`}
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-3'>
													<div className={`p-2 rounded-lg ${colorClasses.bg}`}>
														<IconComponent
															className={`w-4 h-4 ${colorClasses.text}`}
														/>
													</div>
													<div>
														<h3 className='font-medium'>{category.name}</h3>
														<p className='text-xs text-muted-foreground'>
															Доходы
														</p>
													</div>
												</div>
												<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
													<Button
														variant='ghost'
														size='sm'
														className='h-8 w-8 p-0'
													>
														<Edit3 className='w-3 h-3' />
													</Button>
													<Button
														variant='ghost'
														size='sm'
														className='h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500'
														onClick={() => deleteCategory(category.id)}
													>
														<Trash2 className='w-3 h-3' />
													</Button>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>

					{/* Категории расходов */}
					<div className='border border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
						<div className='flex items-center gap-3 mb-6'>
							<div className='p-2 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10'>
								<TrendingDown className='w-5 h-5 text-red-500' />
							</div>
							<div>
								<h2 className='font-semibold text-lg'>Категории расходов</h2>
								<p className='text-muted-foreground text-sm'>
									{expenseCategories.length} категорий
								</p>
							</div>
						</div>

						{expenseCategories.length === 0 ? (
							<div className='text-center py-8'>
								<div className='w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center'>
									<TrendingDown className='w-6 h-6 text-red-500' />
								</div>
								<p className='text-muted-foreground'>Нет категорий расходов</p>
								<p className='text-sm text-muted-foreground'>
									Добавьте первую категорию
								</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								{expenseCategories.map(category => {
									const IconComponent = getIconComponent(category.icon)
									const colorClasses = getColorClasses(category.color)
									return (
										<div
											key={category.id}
											className={`group p-4 rounded-xl border ${colorClasses.border} ${colorClasses.bg} hover:shadow-md transition-all duration-200`}
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-3'>
													<div className={`p-2 rounded-lg ${colorClasses.bg}`}>
														<IconComponent
															className={`w-4 h-4 ${colorClasses.text}`}
														/>
													</div>
													<div>
														<h3 className='font-medium'>{category.name}</h3>
														<p className='text-xs text-muted-foreground'>
															Расходы
														</p>
													</div>
												</div>
												<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
													<Button
														variant='ghost'
														size='sm'
														className='h-8 w-8 p-0'
													>
														<Edit3 className='w-3 h-3' />
													</Button>
													<Button
														variant='ghost'
														size='sm'
														className='h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500'
														onClick={() => deleteCategory(category.id)}
													>
														<Trash2 className='w-3 h-3' />
													</Button>
												</div>
											</div>
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
