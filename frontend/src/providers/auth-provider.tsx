import { useAuth } from '@/hooks/use-auth'
import type { AuthUser, UserRole } from '@/pages/auth/store/auth-store'
import { useAuthStore } from '@/pages/auth/store/auth-store'
import type { ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'

interface Credentials {
	username: string
	password: string
}

interface AuthContextType {
	user: AuthUser | null
	isAuthenticated: boolean
	isLoading: boolean
	role: UserRole | null
	login: (cred: Credentials) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

interface AuthProviderProps {
	children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
	const { user, login, logout, hydrate } = useAuthStore()
	const [isHydrated, setIsHydrated] = useState(false)
	const isAuthenticated = !!user
	const isLoading = !isHydrated

	useEffect(() => {
		hydrate()
		setIsHydrated(true)
	}, [hydrate])

	const contextValue: AuthContextType = {
		user,
		isAuthenticated,
		isLoading,
		role: user?.role ?? null,
		login,
		logout
	}

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	)
}

interface ProtectedRouteProps {
	children: ReactNode
	allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading, role } = useAuth()

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
					<p className='text-muted-foreground'>Загрузка...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		window.location.href = '/auth'
		return null
	}

	if (allowedRoles && role && !allowedRoles.includes(role)) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center space-y-4'>
					<div className='w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center'>
						<span className='text-2xl'>🚫</span>
					</div>
					<h2 className='text-xl font-bold'>Доступ запрещён</h2>
					<p className='text-muted-foreground'>
						У вас недостаточно прав для просмотра этой страницы
					</p>
				</div>
			</div>
		)
	}

	return <>{children}</>
}
