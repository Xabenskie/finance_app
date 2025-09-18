import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { RootPage } from '@/pages/root/root-page'
import { Route, Routes } from 'react-router-dom'

function App() {
	return (
		<SidebarProvider>
			<AppSidebar />

			<SidebarTrigger className='m-2' />

			<main className='pt-8 w-full max-w-full mx-auto'>
				<Routes>
					<Route path='/' element={<RootPage />} />
					<Route path='/about' element={<h1>О проекте</h1>} />
				</Routes>
			</main>
		</SidebarProvider>
	)
}

export default App
