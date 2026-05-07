import { ApiError } from '@/api/client'
import { login as loginApi } from '@/pages/auth/login/api/login'
import { create } from 'zustand'

export type UserRole = 'user' | 'manager' | 'admin'

export interface AuthUser {
	username: string
	role: UserRole
	avatar_url?: string
}

interface Credentials {
	username: string
	password: string
}

interface AuthState {
	user: AuthUser | null
	token: string | null
	refreshToken: string | null
	isLoading: boolean
	error: string | null
	login: (cred: Credentials) => Promise<void>
	logout: () => void
	setUser: (u: AuthUser | null) => void
	hydrate: () => void
	clearError: () => void
	setTokens: (accessToken: string, refreshToken: string) => void
}

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

function saveToStorage(
	token: string | null,
	refreshToken: string | null,
	user: AuthUser | null
) {
	if (typeof window === 'undefined') return
	if (token) localStorage.setItem(TOKEN_KEY, token)
	else localStorage.removeItem(TOKEN_KEY)
	if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
	else localStorage.removeItem(REFRESH_TOKEN_KEY)
	if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
	else localStorage.removeItem(USER_KEY)
}

function readFromStorage(): {
	token: string | null
	refreshToken: string | null
	user: AuthUser | null
} {
	if (typeof window === 'undefined')
		return { token: null, refreshToken: null, user: null }
	const token = localStorage.getItem(TOKEN_KEY)
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
	const rawUser = localStorage.getItem(USER_KEY)
	let user: AuthUser | null = null
	if (rawUser) {
		try {
			const parsed = JSON.parse(rawUser)
			user = {
				username: parsed.username,
				role: parsed.role || 'user',
				avatar_url: parsed.avatar_url || undefined,
			}
		} catch {
			user = null
		}
	}
	return { token, refreshToken, user }
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	refreshToken: null,
	isLoading: false,
	error: null,

	setUser: u => {
		set({ user: u })
		const { token, refreshToken } = get()
		saveToStorage(token, refreshToken, u)
	},

	clearError: () => set({ error: null }),

	setTokens: (accessToken: string, refreshToken: string) => {
		const { user } = get()
		set({ token: accessToken, refreshToken })
		saveToStorage(accessToken, refreshToken, user)
	},

	hydrate: () => {
		const { token, refreshToken, user } = readFromStorage()
		set({ token, refreshToken, user })
	},

	logout: () => {
		saveToStorage(null, null, null)
		set({ user: null, token: null, refreshToken: null, error: null })
	},

	login: async (cred: Credentials) => {
		if (get().isLoading) return
		set({ isLoading: true, error: null })
		try {
			const data = await loginApi({
				username: cred.username,
				password: cred.password
			})
			const user: AuthUser = {
				username: data.username,
				role: (data.role as UserRole) || 'user',
				avatar_url: data.avatar_url || undefined,
			}
			const token = data.access_token
			const refreshToken = data.refresh_token || ''
			saveToStorage(token, refreshToken, user)
			set({ token, refreshToken, user })
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
