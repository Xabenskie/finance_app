import { AuthContext } from '@/providers/auth-provider'
import { useContext } from 'react'

// Хук для использования контекста аутентификации
export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
