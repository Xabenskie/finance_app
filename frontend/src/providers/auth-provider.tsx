import { useAuth } from '@/hooks/use-auth'
import type { AuthUser } from '@/pages/auth/store/auth-store'
import { useAuthStore } from '@/pages/auth/store/auth-store'
import type { ReactNode } from 'react'
import { createContext, useEffect } from 'react'

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
	const isAuthenticated = !!user
	const isLoading = false // Можно добавить состояние загрузки при необходимости

	// Восстанавливаем состояние при загрузке приложения
	useEffect(() => {
		hydrate()
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
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		// Редирект на страницу входа
		window.location.href = '/auth'
		return null
	}

	return <>{children}</>
}
