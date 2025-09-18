import { AppSidebar } from '@/components/app-sidebar'
import { AuthPage } from '@/pages/auth/auth-page'
import { CategoriesPage } from '@/pages/categories/categories-page'
import { LandingPage } from '@/pages/landing/landing-page'
import { RootPage } from '@/pages/root/root-page'
import { TransactionsPage } from '@/pages/transactions/transactions-page'
import { Route, Routes, useLocation } from 'react-router-dom'

function App() {
	const location = useLocation()
	const isAuthPage = location.pathname === '/auth'
	const isLandingPage = location.pathname === '/'
	const hideNavigation = isAuthPage || isLandingPage

	return (
		<div className='flex min-h-screen bg-background'>
			{!hideNavigation && <AppSidebar />}

			<main
				className={`flex-1 ${!hideNavigation ? 'lg:ml-64 pt-16 lg:pt-0' : ''}`}
			>
				<div className='w-full'>
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='/auth' element={<AuthPage />} />
						<Route path='/dashboard' element={<RootPage />} />
						<Route path='/transactions' element={<TransactionsPage />} />
						<Route path='/categories' element={<CategoriesPage />} />
						<Route
							path='/analytics'
							element={
								<div className='p-8'>
									<h1>Аналитика</h1>
								</div>
							}
						/>
						<Route
							path='/budget'
							element={
								<div className='p-8'>
									<h1>Бюджет</h1>
								</div>
							}
						/>
						<Route
							path='/calendar'
							element={
								<div className='p-8'>
									<h1>Календарь</h1>
								</div>
							}
						/>
						<Route
							path='/settings'
							element={
								<div className='p-8'>
									<h1>Настройки</h1>
								</div>
							}
						/>
					</Routes>
				</div>
			</main>
		</div>
	)
}

export default App
