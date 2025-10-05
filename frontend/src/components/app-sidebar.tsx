import { useAuthStore } from '@/pages/auth/store/auth-store'
import {
	ChevronDown,
	Home,
	LogOut,
	Menu,
	Receipt,
	Tags,
	User,
	Wallet,
	X
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const items = [
	{
		title: 'Главная',
		url: '/dashboard',
		icon: Home
	},
	{
		title: 'Транзакции',
		url: '/transactions',
		icon: Receipt
	},
	{
		title: 'Категории',
		url: '/categories',
		icon: Tags
	}
]

export function AppSidebar() {
	const { user } = useAuthStore()
	const location = useLocation()
	const navigate = useNavigate()
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const handleSignOut = () => {
		// Логика выхода из аккаунта
		localStorage.removeItem('auth_token')
		localStorage.removeItem('auth_user')
		navigate('/auth')
	}

	return (
		<>
			{/* Mobile Top Bar */}
			<div className='lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-background to-background/80 border-b border-border/50 backdrop-blur-sm z-50 flex items-center justify-between px-4'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
						<Wallet className='w-4 h-4 text-primary' />
					</div>
					<h1 className='text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
						FinanceApp
					</h1>
				</div>

				<div className='flex items-center gap-2'>
					<button
						onClick={() => setIsProfileOpen(!isProfileOpen)}
						className='p-2 rounded-xl hover:bg-accent/50 transition-colors'
					>
						<User className='w-5 h-5' />
					</button>
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className='p-2 rounded-xl hover:bg-accent/50 transition-colors'
					>
						{isMobileMenuOpen ? (
							<X className='w-5 h-5' />
						) : (
							<Menu className='w-5 h-5' />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Profile Dropdown */}
			{isProfileOpen && (
				<div className='lg:hidden fixed top-16 right-4 w-64 p-2 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm z-40'>
					<div className='p-3 border-b border-border/30'>
						<p className='font-medium'>Пользователь</p>
						<p className='text-xs text-muted-foreground'>user@example.com</p>
					</div>
					<button
						onClick={handleSignOut}
						className='w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200 mt-2'
					>
						<LogOut className='w-4 h-4' />
						<span>Выйти из аккаунта</span>
					</button>
				</div>
			)}

			{/* Mobile Navigation Menu */}
			{isMobileMenuOpen && (
				<div className='lg:hidden fixed top-16 left-0 right-0 bg-gradient-to-b from-background to-background/80 border-b border-border/50 backdrop-blur-sm z-40 p-4'>
					<div className='grid grid-cols-2 gap-2'>
						{items.map(item => {
							const isActive = location.pathname === item.url
							const IconComponent = item.icon

							return (
								<Link
									key={item.title}
									to={item.url}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium transition-all duration-200 ${
										isActive
											? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20'
											: 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
									}`}
								>
									<div
										className={`p-2 rounded-lg transition-colors ${
											isActive
												? 'bg-primary/10'
												: 'bg-transparent group-hover:bg-accent/30'
										}`}
									>
										<IconComponent
											className={`w-4 h-4 ${
												isActive ? 'text-primary' : 'text-current'
											}`}
										/>
									</div>
									<span>{item.title}</span>
								</Link>
							)
						})}
					</div>
				</div>
			)}

			{/* Desktop Sidebar */}
			<div className='hidden lg:block fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-background to-background/80 border-r border-border/50 backdrop-blur-sm z-50'>
				<div className='p-6'>
					{/* Logo and Title */}
					<div className='flex items-center gap-3 mb-8'>
						<div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
							<Wallet className='w-5 h-5 text-primary' />
						</div>
						<h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
							FinanceApp
						</h1>
					</div>

					{/* Navigation */}
					<nav className='space-y-2'>
						{items.map(item => {
							const isActive = location.pathname === item.url
							const IconComponent = item.icon

							return (
								<Link
									key={item.title}
									to={item.url}
									className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
										isActive
											? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm'
											: 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
									}`}
								>
									<div
										className={`p-1.5 rounded-lg transition-colors ${
											isActive
												? 'bg-primary/10'
												: 'bg-transparent group-hover:bg-accent/30'
										}`}
									>
										<IconComponent
											className={`w-4 h-4 ${
												isActive ? 'text-primary' : 'text-current'
											}`}
										/>
									</div>
									<span>{item.title}</span>
								</Link>
							)
						})}
					</nav>
				</div>

				{/* Profile Section */}
				<div className='absolute bottom-0 left-0 right-0 p-6 border-t border-border/30'>
					<div className='relative'>
						<button
							onClick={() => setIsProfileOpen(!isProfileOpen)}
							className='w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200'
						>
							<div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
								<User className='w-4 h-4 text-primary' />
							</div>
							<div className='flex-1 text-left'>
								<p className='text-sm font-medium'>Пользователь</p>
								<p className='text-xs text-muted-foreground'>
									{user?.username}
								</p>
							</div>
							<ChevronDown
								className={`w-4 h-4 text-muted-foreground transition-transform ${
									isProfileOpen ? 'rotate-180' : ''
								}`}
							/>
						</button>

						{isProfileOpen && (
							<div className='absolute bottom-full left-0 right-0 mb-2 p-2 bg-background border border-border/50 rounded-xl shadow-lg backdrop-blur-sm'>
								<button
									onClick={handleSignOut}
									className='w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200'
								>
									<LogOut className='w-4 h-4' />
									<span>Выйти из аккаунта</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
