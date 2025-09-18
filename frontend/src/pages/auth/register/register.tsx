import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Calendar,
	Eye,
	EyeOff,
	Lock,
	Mail,
	Phone,
	User,
	Wallet
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Register({
	setIsLogin
}: {
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		password: '',
		confirmPassword: ''
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			// Проверка совпадения паролей
			if (formData.password !== formData.confirmPassword) {
				alert('Пароли не совпадают')
				return
			}

			// Здесь будет логика регистрации
			console.log('Регистрация:', formData)

			// Имитация запроса к серверу
			await new Promise(resolve => setTimeout(resolve, 2000))

			// После успешной регистрации перенаправляем на дашборд
			navigate('/dashboard')
		} catch (error) {
			console.error('Ошибка регистрации:', error)
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
				{/* Register Card */}
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
						<p className='text-slate-600'>Создайте новый аккаунт</p>
					</div>

					{/* Register Form */}
					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Name Fields */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<label className='text-sm font-medium text-slate-700'>
									Имя
								</label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
									<Input
										type='text'
										name='firstName'
										value={formData.firstName}
										onChange={handleInputChange}
										placeholder='Имя'
										className='pl-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
										required
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<label className='text-sm font-medium text-slate-700'>
									Фамилия
								</label>
								<Input
									type='text'
									name='lastName'
									value={formData.lastName}
									onChange={handleInputChange}
									placeholder='Фамилия'
									className='h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Email адрес
							</label>
							<div className='relative'>
								<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									placeholder='Введите ваш email'
									className='pl-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
							</div>
						</div>

						{/* Phone Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Телефон
							</label>
							<div className='relative'>
								<Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type='tel'
									name='phone'
									value={formData.phone}
									onChange={handleInputChange}
									placeholder='+7 (999) 123-45-67'
									className='pl-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
							</div>
						</div>

						{/* Date of Birth Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Дата рождения
							</label>
							<div className='relative'>
								<Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type='date'
									name='dateOfBirth'
									value={formData.dateOfBirth}
									onChange={handleInputChange}
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
									placeholder='Создайте пароль'
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

						{/* Confirm Password Field */}
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700'>
								Подтвердите пароль
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
								<Input
									type={showConfirmPassword ? 'text' : 'password'}
									name='confirmPassword'
									value={formData.confirmPassword}
									onChange={handleInputChange}
									placeholder='Повторите пароль'
									className='pl-10 pr-10 h-12 bg-white/50 border-slate-300 focus:border-primary/50 text-slate-900'
									required
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
								>
									{showConfirmPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>
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
									Регистрация...
								</div>
							) : (
								'Зарегистрироваться'
							)}
						</Button>
					</form>

					{/* Login Link */}
					<div className='mt-8 text-center'>
						<p className='text-slate-600 text-sm'>Уже есть аккаунт?</p>
						<button
							className='text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer'
							onClick={() => setIsLogin(true)}
						>
							Войти
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
