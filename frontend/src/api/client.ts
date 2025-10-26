import axios, { AxiosError } from 'axios'

// Базовый URL берём из переменной окружения Vite
// Создайте файл .env.local с переменной: VITE_API_URL=https://api.example.com
const baseURL = 'http://127.0.0.1:8000/api/'

export const api = axios.create({
	baseURL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

// Флаг для предотвращения множественных refresh запросов
let isRefreshing = false
let failedQueue: Array<{
	resolve: (token: string) => void
	reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error)
		} else if (token) {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

// Тип расширенной ошибки
export interface ApiErrorData {
	message: string
	code?: string | number
	status?: number
	// arbitrary payload from backend, keep as unknown to avoid any
	detail?: unknown
}

export class ApiError extends Error {
	status?: number
	code?: string | number
	detail?: unknown

	constructor(data: ApiErrorData) {
		super(data.message)
		this.name = 'ApiError'
		this.status = data.status
		this.code = data.code
		this.detail = data.detail
	}
}

// Request interceptor: добавляем токен если есть
api.interceptors.request.use(config => {
	const token = localStorage.getItem('auth_token')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Response interceptor: нормализуем ошибки + refresh token
api.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as typeof error.config & {
			_retry?: boolean
		}

		// Если 401 ошибка и это не повторный запрос
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// Если refresh уже идет, добавляем запрос в очередь
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(token => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`
						}
						return api(originalRequest)
					})
					.catch(err => Promise.reject(err))
			}

			originalRequest._retry = true
			isRefreshing = true

			const refreshToken = localStorage.getItem('refresh_token')
			if (!refreshToken) {
				// Нет refresh токена - выходим
				isRefreshing = false
				processQueue(new Error('No refresh token'), null)
				// Очищаем auth store
				localStorage.removeItem('auth_token')
				localStorage.removeItem('refresh_token')
				localStorage.removeItem('auth_user')
				window.location.href = '/login'
				return Promise.reject(error)
			}

			try {
				// Запрос на обновление токена
				const { data } = await axios.post<{
					access_token: string
					refresh_token?: string
				}>(`${baseURL}users/refresh`, {
					refresh_token: refreshToken
				})

				const newAccessToken = data.access_token
				const newRefreshToken = data.refresh_token || refreshToken

				// Сохраняем новые токены
				localStorage.setItem('auth_token', newAccessToken)
				if (newRefreshToken) {
					localStorage.setItem('refresh_token', newRefreshToken)
				}

				// Обновляем заголовок в оригинальном запросе
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				}

				// Обрабатываем очередь запросов
				processQueue(null, newAccessToken)
				isRefreshing = false

				// Повторяем оригинальный запрос
				return api(originalRequest)
			} catch (refreshError) {
				// Refresh не удался - выходим
				processQueue(refreshError, null)
				isRefreshing = false
				localStorage.removeItem('auth_token')
				localStorage.removeItem('refresh_token')
				localStorage.removeItem('auth_user')
				window.location.href = '/login'
				return Promise.reject(refreshError)
			}
		}

		// Обработка других ошибок
		if (error.response) {
			const data: unknown = error.response.data || {}
			const dataObj =
				typeof data === 'object' && data
					? (data as Record<string, unknown>)
					: {}

			// Извлекаем человекочитаемое сообщение из типовых структур (FastAPI / DRF / кастом)
			let extractedMessage: string | undefined
			if (typeof dataObj.message === 'string')
				extractedMessage = dataObj.message
			else if (typeof dataObj.detail === 'string')
				extractedMessage = dataObj.detail as string
			else if (typeof dataObj.error === 'string')
				extractedMessage = dataObj.error as string
			else if (Array.isArray(dataObj.detail) && dataObj.detail.length) {
				// FastAPI validation errors: detail: [{ loc, msg, type }, ...]
				const firstUnknown: unknown = dataObj.detail[0]
				if (
					firstUnknown &&
					typeof firstUnknown === 'object' &&
					'msg' in firstUnknown &&
					typeof (firstUnknown as { msg?: unknown }).msg === 'string'
				) {
					extractedMessage = (firstUnknown as { msg: string }).msg
				}
			} else if (
				typeof dataObj === 'object' &&
				dataObj !== null &&
				'errors' in dataObj &&
				Array.isArray((dataObj as { errors: unknown[] }).errors) &&
				(dataObj as { errors: unknown[] }).errors.length
			) {
				const firstErrUnknown: unknown = (dataObj as { errors: unknown[] })
					.errors[0]
				if (
					firstErrUnknown &&
					typeof firstErrUnknown === 'object' &&
					'message' in firstErrUnknown &&
					typeof (firstErrUnknown as { message?: unknown }).message === 'string'
				) {
					extractedMessage = (firstErrUnknown as { message: string }).message
				}
			}

			if (!extractedMessage) extractedMessage = 'Ошибка ответа сервера'

			throw new ApiError({
				message: extractedMessage,
				status: error.response.status,
				code:
					(dataObj.code as string | number) ||
					(dataObj.error as string | number) ||
					error.response.status,
				detail: dataObj
			})
		}

		if (error.request) {
			throw new ApiError({ message: 'Сервер не отвечает', code: 'NO_RESPONSE' })
		}

		throw new ApiError({
			message: error.message || 'Неизвестная ошибка',
			code: 'UNKNOWN'
		})
	}
)
