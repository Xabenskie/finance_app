import { api } from '@/api/client'

export interface UserInfo {
	id: string
	username: string
	role: string
}

export async function fetchUsers(): Promise<UserInfo[]> {
	const { data } = await api.get<UserInfo[]>('/admin/users')
	return data
}

export async function updateUserRole(
	userId: string,
	role: string
): Promise<UserInfo> {
	const { data } = await api.patch<UserInfo>(`/admin/users/${userId}/role`, {
		role
	})
	return data
}
