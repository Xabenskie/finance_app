import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/pages/auth/store/auth-store'
import { Eye, EyeOff, Lock, Mail, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Login({
	setIsLogin
}: {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	})
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const {
		login: loginAction,
		error: authError,
		clearError,
		user
	} = useAuthStore()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	useEffect(() => {
		if (user) {
			navigate('/dashboard', { replace: true })
		}
	}, [user, navigate])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		clearError()
		try {
			await loginAction({
				username: formData.username,
				password: formData.password
			})
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4'>
			{/* Background Pattern */}
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]' />
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.05),transparent_50%)]' />
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]' />

			<div className='relative w-full max-w-md'>
				{/* Login Card */}
				<div className='bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-lg'>
					{/* Header */}
					<div className='text-center mb-8'>
						<div className='flex justify-center mb-4'>
							<div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
								<Wallet className='w-8 h-8 text-primary' />
							</div>
						</div>
						<h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2'>
							FinanceApp
						</h1>
						<p className='text-slate-600'>Войдите в свой аккаунт</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Username Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Имя пользователя
							</label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type='text'
									name='username'
									value={formData.username}
									onChange={handleInputChange}
									placeholder='Введите ваш username'
									className='pl-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Пароль
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type={showPassword ? 'text' : 'password'}
									name='password'
									value={formData.password}
									onChange={handleInputChange}
									placeholder='Введите пароль'
									className='pl-10 pr-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
						</div>

						{/* Error */}
						{(error || authError) && (
							<div className='p-3 text-sm rounded-md bg-red-100 text-red-700 border border-red-200'>
								{error || authError}
							</div>
						)}

						{/* Forgot Password Link */}
						<div className='text-right'>
							<button
								type='button'
								className='text-sm text-primary hover:text-primary/80 transition-colors'
							>
								Забыли пароль?
							</button>
						</div>

						{/* Submit Button */}
						<Button
							type='submit'
							disabled={isLoading}
							className='w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium transition-all duration-200'
						>
							{isLoading ? (
								<div className='flex items-center gap-2'>
									<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
									Вход...
								</div>
							) : (
								'Войти'
							)}
						</Button>
					</form>

					{/* Register Link */}
					<div className='mt-8 text-center'>
						<p className='text-slate-600 text-sm'>Нет аккаунта?</p>
						<button
							className='text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer'
							onClick={() => setIsLogin(false)}
						>
							Зарегистрироваться
						</button>
					</div>

					{/* Demo Note */}
					<div className='mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg'>
						<p className='text-xs text-center text-slate-600'>
							Это демо-версия. Данные не сохраняются на сервере.
						</p>
					</div>
				</div>

				{/* Back to Landing Link */}
				<div className='text-center mt-6'>
					<Link
						to='/'
						className='text-slate-600 hover:text-slate-900 text-sm transition-colors'
					>
						← Вернуться на главную
					</Link>
				</div>
			</div>
		</div>
	)
}
