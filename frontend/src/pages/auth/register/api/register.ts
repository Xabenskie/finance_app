import { api } from '@/api/client'

export interface IRegisterRequest {
	username: string
	password: string
}

export interface IRegisterResponse {
	id: string
	username: string
}

export async function register(
	req: IRegisterRequest
): Promise<IRegisterResponse> {
	const response = await api.post<IRegisterResponse>('/users/register', req)
	return response.data
}
