import { useAuth } from '@/hooks/use-auth'
import type { AuthUser } from '@/pages/auth/store/auth-store'
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
	const isLoading = !isHydrated // Загрузка пока не восстановили состояние

	// Восстанавливаем состояние при загрузке приложения
	useEffect(() => {
		hydrate()
		setIsHydrated(true)
	}, [hydrate])

	const contextValue: AuthContextType = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout
	}

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	)
}

// Компонент для защиты роутов
interface ProtectedRouteProps {
	children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth()

	// Ждем пока загрузится состояние из localStorage
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
		// Редирект на страницу входа
		window.location.href = '/auth'
		return null
	}

	return <>{children}</>
}
