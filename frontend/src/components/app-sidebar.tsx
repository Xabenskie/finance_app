import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'
import {
	BarChart,
	Calendar,
	CreditCard,
	Home,
	ListOrdered,
	LogOut,
	Settings,
	User,
	Wallet
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Menu items.
const items = [
	{
		title: 'Дашборд',
		url: '/',
		icon: Home
	},
	{
		title: 'Транзакции',
		url: '/transactions',
		icon: CreditCard
	},
	{
		title: 'Категории',
		url: '/categories',
		icon: ListOrdered
	},
	{
		title: 'Аналитика',
		url: '/analytics',
		icon: BarChart
	},
	{
		title: 'Бюджет',
		url: '/budget',
		icon: Wallet
	},
	{
		title: 'Календарь',
		url: '/calendar',
		icon: Calendar
	},
	{
		title: 'Настройки',
		url: '/settings',
		icon: Settings
	}
]

export function AppSidebar() {
	return (
		<Sidebar variant='floating' collapsible='icon'>
			<SidebarHeader>
				<SidebarContent>
					<div className='flex items-center justify-between'>
						<h2 className='text-lg font-bold'>FinanceApp</h2>
						<User />
					</div>
				</SidebarContent>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Финансы</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarContent>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link to={'/login'}>
								<LogOut />
								<span className='text-red-500'>Выйти из аккаунта</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarContent>
			</SidebarFooter>
		</Sidebar>
	)
}
