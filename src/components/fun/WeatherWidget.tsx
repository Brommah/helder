'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, CloudRain, Sun, CloudSun, Wind, Snowflake, CloudLightning, Loader2 } from 'lucide-react'

interface WeatherData {
  temperature: number
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy'
  description: string
  humidity: number
  windSpeed: number
}

interface WeatherWidgetProps {
  location: string
  compact?: boolean
}

const WEATHER_ICONS = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: Snowflake,
  windy: Wind,
}

const WEATHER_COLORS = {
  sunny: 'text-amber-500',
  'partly-cloudy': 'text-amber-400',
  cloudy: 'text-slate-400',
  rainy: 'text-blue-500',
  stormy: 'text-purple-500',
  snowy: 'text-cyan-400',
  windy: 'text-slate-500',
}

/**
 * Weather Widget - Shows current weather at property location
 * Uses a simple mock for demo, but can be connected to a real weather API
 */
export function WeatherWidget({ location, compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Simulate API call with mock data
    // In production, replace with actual weather API (OpenWeatherMap, etc.)
    const fetchWeather = async () => {
      setLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock weather data based on current month
        const month = new Date().getMonth()
        const hour = new Date().getHours()
        
        // Dutch weather simulation
        let mockWeather: WeatherData
        
        if (month >= 11 || month <= 1) {
          // Winter
          mockWeather = {
            temperature: Math.floor(Math.random() * 8) - 2,
            condition: Math.random() > 0.7 ? 'snowy' : Math.random() > 0.5 ? 'rainy' : 'cloudy',
            description: 'Koud en bewolkt',
            humidity: 85,
            windSpeed: 25,
          }
        } else if (month >= 2 && month <= 4) {
          // Spring
          mockWeather = {
            temperature: Math.floor(Math.random() * 10) + 8,
            condition: Math.random() > 0.6 ? 'partly-cloudy' : Math.random() > 0.3 ? 'rainy' : 'sunny',
            description: 'Wisselvallig',
            humidity: 70,
            windSpeed: 20,
          }
        } else if (month >= 5 && month <= 7) {
          // Summer
          mockWeather = {
            temperature: Math.floor(Math.random() * 10) + 18,
            condition: hour >= 10 && hour <= 18 ? 'sunny' : 'partly-cloudy',
            description: 'Zonnig',
            humidity: 55,
            windSpeed: 12,
          }
        } else {
          // Fall
          mockWeather = {
            temperature: Math.floor(Math.random() * 8) + 8,
            condition: Math.random() > 0.5 ? 'rainy' : Math.random() > 0.3 ? 'cloudy' : 'windy',
            description: 'Regenachtig',
            humidity: 80,
            windSpeed: 30,
          }
        }

        setWeather(mockWeather)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'p-3 bg-white/5'}`}>
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
        <span className="text-xs text-slate-400">Laden...</span>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className={`flex items-center gap-2 ${compact ? '' : 'p-3 bg-white/5'}`}>
        <Cloud className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400">Weer niet beschikbaar</span>
      </div>
    )
  }

  const WeatherIcon = WEATHER_ICONS[weather.condition]
  const iconColor = WEATHER_COLORS[weather.condition]

  if (compact) {
    return (
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <WeatherIcon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-sm font-bold text-white">{weather.temperature}°C</span>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="p-4 bg-white/5 backdrop-blur"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">
            {location}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">{weather.temperature}</span>
            <span className="text-lg font-bold text-white/50">°C</span>
          </div>
          <p className="text-xs text-white/70 mt-1">{weather.description}</p>
        </div>
        <motion.div
          animate={weather.condition === 'sunny' ? { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          } : undefined}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <WeatherIcon className={`w-12 h-12 ${iconColor}`} />
        </motion.div>
      </div>
      
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span className="text-xs text-white/50">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wind className="w-3 h-3 text-white/50" />
          <span className="text-xs text-white/50">{weather.windSpeed} km/u</span>
        </div>
      </div>
    </motion.div>
  )
}
