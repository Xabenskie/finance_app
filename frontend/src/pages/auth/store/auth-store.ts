import { ApiError } from '@/api/client'
import { login as loginApi } from '@/pages/auth/login/api/login'
import { create } from 'zustand'

// Тип пользователя (расширяйте по мере появления полей)
export interface AuthUser {
	username: string
}

interface Credentials {
	username: string
	password: string
}

interface AuthState {
	user: AuthUser | null
	token: string | null
	isLoading: boolean
	error: string | null
	// actions
	login: (cred: Credentials) => Promise<void>
	logout: () => void
	setUser: (u: AuthUser | null) => void
	hydrate: () => void
	clearError: () => void
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

function saveToStorage(token: string | null, user: AuthUser | null) {
	if (typeof window === 'undefined') return
	if (token) localStorage.setItem(TOKEN_KEY, token)
	else localStorage.removeItem(TOKEN_KEY)
	if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
	else localStorage.removeItem(USER_KEY)
}

function readFromStorage(): { token: string | null; user: AuthUser | null } {
	if (typeof window === 'undefined') return { token: null, user: null }
	const token = localStorage.getItem(TOKEN_KEY)
	const rawUser = localStorage.getItem(USER_KEY)
	let user: AuthUser | null = null
	if (rawUser) {
		try {
			user = JSON.parse(rawUser) as AuthUser
		} catch {
			user = null
		}
	}
	return { token, user }
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isLoading: false,
	error: null,

	setUser: u => {
		set({ user: u })
		const { token } = get()
		saveToStorage(token, u)
	},

	clearError: () => set({ error: null }),

	hydrate: () => {
		const { token, user } = readFromStorage()
		set({ token, user })
	},

	logout: () => {
		saveToStorage(null, null)
		set({ user: null, token: null, error: null })
	},

	login: async (cred: Credentials) => {
		if (get().isLoading) return
		set({ isLoading: true, error: null })
		try {
			const data = await loginApi({
				username: cred.username,
				password: cred.password
			})
			const user: AuthUser = { username: data.username }
			const token = data.access_token
			saveToStorage(token, user)
			set({ token, user })
		} catch (err) {
			if (err instanceof ApiError) {
				set({ error: err.message })
			} else {
				set({ error: 'Ошибка авторизации' })
			}
		} finally {
			set({ isLoading: false })
		}
	}
}))

// Авто-гидратация при первом импорте (опционально)
if (typeof window !== 'undefined') {
	// отложим чтобы избежать гонок с другими init скриптами
	setTimeout(() => {
		useAuthStore.getState().hydrate()
	}, 0)
}

/*
Пример использования в компоненте:

const { login, user, isLoading, error, logout } = useAuthStore()

async function handleLogin() {
  await login({ email: form.email, password: form.password })
}

useEffect(() => {
  if (user) navigate('/dashboard')
}, [user])
*/
