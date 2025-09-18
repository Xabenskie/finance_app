import { Button } from '@/components/ui/button'
import {
	ArrowRight,
	BarChart3,
	CheckCircle,
	PieChart,
	Shield,
	Smartphone,
	Star,
	TrendingUp,
	Wallet,
	Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function LandingPage() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
			{/* Background Pattern */}
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]' />
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]' />
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]' />

			{/* Navigation */}
			<nav className='relative z-10 flex items-center justify-between p-6 lg:px-8'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
						<Wallet className='w-5 h-5 text-primary' />
					</div>
					<h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
						FinanceApp
					</h1>
				</div>
				<div className='flex items-center gap-4'>
					<Link
						to='/auth'
						className='text-slate-600 hover:text-slate-900 transition-colors'
					>
						Войти
					</Link>
					<Link to='/auth'>
						<Button className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white'>
							Начать
						</Button>
					</Link>
				</div>
			</nav>

			{/* Hero Section */}
			<section className='relative z-10 px-6 lg:px-8 py-20 lg:py-32'>
				<div className='max-w-7xl mx-auto text-center'>
					<div className='mb-8'>
						<span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium'>
							<Zap className='w-4 h-4' />
							Умное управление финансами
						</span>
					</div>

					<h1 className='text-4xl lg:text-6xl font-bold mb-6'>
						<span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
							Контролируйте свои финансы
						</span>
						<br />
						<span className='bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
							легко и просто
						</span>
					</h1>

					<p className='text-xl text-slate-600 mb-12 max-w-3xl mx-auto'>
						Современное приложение для учета доходов и расходов с мощной
						аналитикой, планированием бюджета и интуитивным интерфейсом
					</p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
						<Link to='/auth'>
							<Button
								size='lg'
								className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-lg px-8 py-4 h-auto'
							>
								Начать бесплатно
								<ArrowRight className='w-5 h-5 ml-2' />
							</Button>
						</Link>
						<Button
							variant='outline'
							size='lg'
							className='text-lg px-8 py-4 h-auto border-slate-300 hover:bg-slate-100 text-slate-700'
						>
							Посмотреть демо
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='relative z-10 px-6 lg:px-8 py-20'>
				<div className='max-w-7xl mx-auto'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl lg:text-4xl font-bold mb-4'>
							<span className='bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
								Возможности приложения
							</span>
						</h2>
						<p className='text-lg text-slate-600 max-w-2xl mx-auto'>
							Все инструменты, необходимые для эффективного управления личными
							финансами
						</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Feature 1 */}
						<div className='p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white/90 hover:shadow-lg transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center mb-4'>
								<BarChart3 className='w-6 h-6 text-blue-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-slate-900'>
								Учет транзакций
							</h3>
							<p className='text-slate-600'>
								Быстрое добавление доходов и расходов с автоматической
								категоризацией
							</p>
						</div>

						{/* Feature 2 */}
						<div className='p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-white/90 hover:shadow-lg transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mb-4'>
								<PieChart className='w-6 h-6 text-green-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-slate-900'>
								Аналитика
							</h3>
							<p className='text-slate-600'>
								Подробные отчеты и графики для анализа финансовых привычек
							</p>
						</div>

						{/* Feature 3 */}
						<div className='p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/60 transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center mb-4'>
								<TrendingUp className='w-6 h-6 text-purple-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-foreground'>
								Планирование бюджета
							</h3>
							<p className='text-muted-foreground'>
								Создание и отслеживание бюджетов по категориям с уведомлениями
							</p>
						</div>

						{/* Feature 4 */}
						<div className='p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/60 transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center mb-4'>
								<Smartphone className='w-6 h-6 text-orange-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-foreground'>
								Мобильная версия
							</h3>
							<p className='text-muted-foreground'>
								Полнофункциональное приложение, оптимизированное для всех
								устройств
							</p>
						</div>

						{/* Feature 5 */}
						<div className='p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/60 transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center mb-4'>
								<Shield className='w-6 h-6 text-red-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-foreground'>
								Безопасность
							</h3>
							<p className='text-muted-foreground'>
								Надежная защита данных с современными методами шифрования
							</p>
						</div>

						{/* Feature 6 */}
						<div className='p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/60 transition-all duration-300'>
							<div className='w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center mb-4'>
								<Zap className='w-6 h-6 text-cyan-500' />
							</div>
							<h3 className='text-xl font-semibold mb-2 text-foreground'>
								Автоматизация
							</h3>
							<p className='text-muted-foreground'>
								Умные уведомления и автоматическое распознавание повторяющихся
								операций
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className='relative z-10 px-6 lg:px-8 py-20'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid lg:grid-cols-2 gap-16 items-center'>
						<div>
							<h2 className='text-3xl lg:text-4xl font-bold mb-6'>
								<span className='bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent'>
									Почему выбирают FinanceApp?
								</span>
							</h2>
							<div className='space-y-6'>
								<div className='flex items-start gap-4'>
									<div className='flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1'>
										<CheckCircle className='w-4 h-4 text-green-500' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Простота использования
										</h3>
										<p className='text-muted-foreground'>
											Интуитивный интерфейс, не требующий обучения
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<div className='flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1'>
										<CheckCircle className='w-4 h-4 text-green-500' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Полная конфиденциальность
										</h3>
										<p className='text-muted-foreground'>
											Ваши данные хранятся только у вас
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<div className='flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1'>
										<CheckCircle className='w-4 h-4 text-green-500' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Мощная аналитика
										</h3>
										<p className='text-muted-foreground'>
											Глубокий анализ финансовых привычек
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<div className='flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1'>
										<CheckCircle className='w-4 h-4 text-green-500' />
									</div>
									<div>
										<h3 className='font-semibold text-foreground mb-1'>
											Бесплатно навсегда
										</h3>
										<p className='text-muted-foreground'>
											Все основные функции доступны бесплатно
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='relative'>
							<div className='relative z-10 p-8 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm border border-border/50'>
								<div className='flex items-center gap-3 mb-6'>
									<div className='flex -space-x-2'>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold'>
											А
										</div>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-semibold'>
											М
										</div>
										<div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold'>
											И
										</div>
									</div>
									<div className='flex items-center gap-1'>
										{[1, 2, 3, 4, 5].map(star => (
											<Star
												key={star}
												className='w-4 h-4 fill-yellow-400 text-yellow-400'
											/>
										))}
									</div>
								</div>
								<blockquote className='text-foreground text-lg mb-4'>
									"FinanceApp помог мне понять, куда уходят деньги, и начать
									эффективно планировать бюджет. Простой и удобный интерфейс!"
								</blockquote>
								<p className='text-muted-foreground text-sm'>
									— Анна, предприниматель
								</p>
							</div>
							<div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl scale-105' />
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='relative z-10 px-6 lg:px-8 py-20'>
				<div className='max-w-4xl mx-auto text-center'>
					<h2 className='text-3xl lg:text-4xl font-bold mb-6'>
						<span className='bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent'>
							Начните контролировать финансы уже сегодня
						</span>
					</h2>
					<p className='text-lg text-muted-foreground mb-8'>
						Присоединяйтесь к тысячам пользователей, которые уже улучшили свое
						финансовое благополучие
					</p>
					<Link to='/auth'>
						<Button
							size='lg'
							className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-4 h-auto'
						>
							Создать аккаунт бесплатно
							<ArrowRight className='w-5 h-5 ml-2' />
						</Button>
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className='relative z-10 border-t border-border/50 px-6 lg:px-8 py-12'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-8'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
								<Wallet className='w-4 h-4 text-primary' />
							</div>
							<span className='text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
								FinanceApp
							</span>
						</div>
						<div className='flex items-center gap-8 text-sm text-muted-foreground'>
							<span>© 2025 FinanceApp. Все права защищены.</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
