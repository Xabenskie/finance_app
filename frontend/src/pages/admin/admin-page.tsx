import { Crown, Shield, ShieldCheck, User, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchUsers, type UserInfo } from './api/admin'

const ROLE_CONFIG = {
	admin: {
		label: 'Админ',
		icon: Crown,
		color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
	},
	manager: {
		label: 'Менеджер',
		icon: ShieldCheck,
		color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
	},
	user: {
		label: 'Пользователь',
		icon: User,
		color: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
	}
} as const

type RoleKey = keyof typeof ROLE_CONFIG

export function AdminPage() {
	const [users, setUsers] = useState<UserInfo[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchUsers()
			.then(setUsers)
			.catch(() => setError('Не удалось загрузить список пользователей'))
			.finally(() => setLoading(false))
	}, [])

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
					<p className='text-muted-foreground'>Загрузка пользователей...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6'>
			<div className='flex items-center gap-3'>
				<div className='p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10'>
					<Shield className='w-6 h-6 text-amber-500' />
				</div>
				<div>
					<h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
						Пользователи
					</h1>
					<p className='text-muted-foreground text-sm md:text-base'>
						Список зарегистрированных пользователей
					</p>
				</div>
			</div>

			{error && (
				<div className='p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 text-sm'>
					{error}
				</div>
			)}

			<div className='border border-border/50 rounded-2xl bg-gradient-to-br from-background to-background/80 backdrop-blur-sm'>
				<div className='flex items-center gap-3 p-6 border-b border-border/30'>
					<Users className='w-5 h-5 text-muted-foreground' />
					<h2 className='font-semibold text-lg'>
						Все пользователи ({users.length})
					</h2>
				</div>

				<div className='divide-y divide-border/30'>
					{users.map(user => {
						const roleKey = (user.role as RoleKey) || 'user'
						const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG.user
						const RoleIcon = config.icon

						return (
							<div
								key={user.id}
								className='flex items-center gap-4 p-4 md:p-6 hover:bg-accent/20 transition-colors'
							>
								<div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
									<User className='w-5 h-5 text-primary' />
								</div>
								<div>
									<p className='font-medium'>{user.username}</p>
									<span
										className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} mt-1`}
									>
										<RoleIcon className='w-3 h-3' />
										{config.label}
									</span>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
