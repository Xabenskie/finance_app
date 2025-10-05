import { AppSidebar } from '@/components/app-sidebar'
import { AuthPage } from '@/pages/auth/auth-page'
import { CategoriesPage } from '@/pages/categories/categories-page'
import { LandingPage } from '@/pages/landing/landing-page'
import { NotFoundPage } from '@/pages/not-found/not-found-page'
import { RootPage } from '@/pages/root/root-page'
import { TransactionsPage } from '@/pages/transactions/transactions-page'
import { AuthProvider, ProtectedRoute } from '@/providers/auth-provider'
import { Route, Routes, useLocation } from 'react-router-dom'

function App() {
	const location = useLocation()
	const isAuthPage = location.pathname === '/auth'
	const isLandingPage = location.pathname === '/'
	const hideNavigation = isAuthPage || isLandingPage

	return (
		<AuthProvider>
			<div className='flex min-h-screen bg-background'>
				{!hideNavigation && <AppSidebar />}

				<main
					className={`flex-1 ${
						!hideNavigation ? 'lg:ml-64 pt-16 lg:pt-0' : ''
					}`}
				>
					<div className='w-full'>
						<Routes>
							<Route path='/' element={<LandingPage />} />
							<Route path='/auth' element={<AuthPage />} />
							<Route
								path='/dashboard'
								element={
									<ProtectedRoute>
										<RootPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/transactions'
								element={
									<ProtectedRoute>
										<TransactionsPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/categories'
								element={
									<ProtectedRoute>
										<CategoriesPage />
									</ProtectedRoute>
								}
							/>
							{/* 404 страница */}
							<Route path='*' element={<NotFoundPage />} />
						</Routes>
					</div>
				</main>
			</div>
		</AuthProvider>
	)
}

export default App
