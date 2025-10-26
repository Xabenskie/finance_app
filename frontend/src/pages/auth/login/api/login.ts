import { api } from '@/api/client'

export interface LoginRequest {
	username: string
	password: string
}

export interface LoginResponse {
	access_token: string
	refresh_token?: string
	username: string
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
	const { data } = await api.post<LoginResponse>('/users/login', req)

	return data
}
