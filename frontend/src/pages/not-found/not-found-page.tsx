import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function NotFoundPage() {
	const navigate = useNavigate()

	return (
		<div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4'>
			<div className='text-center space-y-8 max-w-md mx-auto'>
				{/* 404 Число */}
				<div className='space-y-4'>
					<h1 className='text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent'>
						404
					</h1>
					<div className='space-y-2'>
						<h2 className='text-2xl md:text-3xl font-semibold text-foreground'>
							Страница не найдена
						</h2>
						<p className='text-muted-foreground text-sm md:text-base'>
							Извините, запрашиваемая страница не существует или была удалена.
						</p>
					</div>
				</div>

				{/* Иконка */}
				<div className='flex justify-center'>
					<div className='p-4 rounded-full bg-muted/50 border border-border/50'>
						<Search className='w-12 h-12 text-muted-foreground' />
					</div>
				</div>

				{/* Кнопки действий */}
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-3 justify-center'>
						<Button
							onClick={() => navigate(-1)}
							variant='outline'
							className='gap-2 w-full sm:w-auto'
						>
							<ArrowLeft className='w-4 h-4' />
							Назад
						</Button>
						<Button
							asChild
							className='gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
						>
							<Link to='/dashboard'>
								<Home className='w-4 h-4' />
								На главную
							</Link>
						</Button>
					</div>

					{/* Полезные ссылки */}
					<div className='pt-4 border-t border-border/50'>
						<p className='text-sm text-muted-foreground mb-3'>
							Возможно, вас заинтересует:
						</p>
						<div className='flex flex-wrap gap-2 justify-center'>
							<Button variant='ghost' size='sm' asChild>
								<Link to='/transactions'>Транзакции</Link>
							</Button>
							<Button variant='ghost' size='sm' asChild>
								<Link to='/categories'>Категории</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Дополнительная информация */}
				<div className='text-xs text-muted-foreground pt-8'>
					<p>
						Если проблема повторяется, обратитесь к администратору или
						попробуйте позже.
					</p>
				</div>
			</div>
		</div>
	)
}
