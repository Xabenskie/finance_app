import { CloudRain, CloudSun, Sun, Snowflake, Cloud, Droplets, Wind } from 'lucide-react'
import { useEffect, useState } from 'react'
 
interface WeatherData {
	temperature: number
	windspeed: number
	humidity: number
	weathercode: number
}

const WEATHER_DESCRIPTIONS: Record<number, { label: string; icon: typeof Sun }> = {
	0: { label: 'Ясно', icon: Sun },
	1: { label: 'Преим. ясно', icon: Sun },
	2: { label: 'Переменная облачность', icon: CloudSun },
	3: { label: 'Облачно', icon: Cloud },
	45: { label: 'Туман', icon: Cloud },
	48: { label: 'Туман', icon: Cloud },
	51: { label: 'Морось', icon: Droplets },
	53: { label: 'Морось', icon: Droplets },
	55: { label: 'Морось', icon: Droplets },
	61: { label: 'Дождь', icon: CloudRain },
	63: { label: 'Дождь', icon: CloudRain },
	65: { label: 'Сильный дождь', icon: CloudRain },
	71: { label: 'Снег', icon: Snowflake },
	73: { label: 'Снег', icon: Snowflake },
	75: { label: 'Сильный снег', icon: Snowflake },
	80: { label: 'Ливень', icon: CloudRain },
	81: { label: 'Ливень', icon: CloudRain },
	82: { label: 'Сильный ливень', icon: CloudRain },
	95: { label: 'Гроза', icon: CloudRain },
}

function getWeatherInfo(code: number) {
	return WEATHER_DESCRIPTIONS[code] || { label: 'Неизвестно', icon: Cloud }
}

export function WeatherWidget() {
	const [weather, setWeather] = useState<WeatherData | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetch(
			'https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true&hourly=relative_humidity_2m&timezone=Europe/Moscow'
		)
			.then(res => res.json())
			.then(data => {
				const current = data.current_weather
				const currentHour = new Date().getHours()
				const humidity = data.hourly?.relative_humidity_2m?.[currentHour] ?? 0
				setWeather({
					temperature: Math.round(current.temperature),
					windspeed: Math.round(current.windspeed),
					humidity,
					weathercode: current.weathercode,
				})
			})
			.catch(() => {})
			.finally(() => setLoading(false))
	}, [])

	if (loading) {
		return (
			<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm min-h-[160px] flex items-center justify-center'>
				<div className='w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin' />
			</div>
		)
	}

	if (!weather) return null

	const { label, icon: WeatherIcon } = getWeatherInfo(weather.weathercode)

	return (
		<div className='group border border-border/50 rounded-2xl p-4 md:p-6 bg-gradient-to-br from-sky-500/5 to-blue-500/5 backdrop-blur-sm hover:shadow-lg transition-all duration-300 min-h-[160px]'>
			<div className='flex items-center gap-3 mb-4'>
				<div className='p-2 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10'>
					<WeatherIcon className='w-5 h-5 md:w-6 md:h-6 text-sky-500' />
				</div>
				<div>
					<h3 className='font-semibold text-base md:text-lg'>Погода</h3>
					<p className='text-muted-foreground text-xs md:text-sm'>Москва</p>
				</div>
			</div>

			<div className='flex items-end justify-between'>
				<div>
					<p className='text-3xl font-bold'>{weather.temperature}°C</p>
					<p className='text-sm text-muted-foreground mt-1'>{label}</p>
				</div>
				<div className='space-y-1.5 text-xs text-muted-foreground'>
					<div className='flex items-center gap-1.5'>
						<Wind className='w-3.5 h-3.5' />
						<span>{weather.windspeed} км/ч</span>
					</div>
					<div className='flex items-center gap-1.5'>
						<Droplets className='w-3.5 h-3.5' />
						<span>{weather.humidity}%</span>
					</div>
				</div>
			</div>
		</div>
	)
}
