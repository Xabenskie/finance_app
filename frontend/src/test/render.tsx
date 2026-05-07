import { AuthProvider } from '@/providers/auth-provider'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

interface Options extends Omit<RenderOptions, 'wrapper'> {
	route?: string
	withAuth?: boolean
}

export function renderWithProviders(
	ui: ReactElement,
	{ route = '/', withAuth = true, ...options }: Options = {}
) {
	const Wrapper = ({ children }: { children: ReactNode }) => {
		const tree = (
			<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
		)
		return withAuth ? <AuthProvider>{tree}</AuthProvider> : tree
	}

	return render(ui, { wrapper: Wrapper, ...options })
}
