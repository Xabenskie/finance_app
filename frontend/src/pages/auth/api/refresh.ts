import { api } from '@/api/client'

export interface RefreshRequest {
	refresh_token: string
}

export interface RefreshResponse {
	access_token: string
	refresh_token?: string
}

export async function refreshToken(
	req: RefreshRequest
): Promise<RefreshResponse> {
	const { data } = await api.post<RefreshResponse>('/users/refresh', req)
	return data
}
