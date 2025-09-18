import { useState } from 'react'
import { Login } from './login/login'
import { Register } from './register/register'

export function AuthPage() {
	const [isLogin, setIsLogin] = useState(true)

	return (
		<div className=''>
			{isLogin ? (
				<Login setIsLogin={setIsLogin} />
			) : (
				<Register setIsLogin={setIsLogin} />
			)}
		</div>
	)
}
