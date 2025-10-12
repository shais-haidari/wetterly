import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import SearchBar from './components/searchBar'
import WeatherCard from './components/WeatherCard'

import video from './video.mp4'
import clearSky from './assets/videos/clear_sky.mp4'
import clouds from './assets/videos/clouds.mp4'
import shower from './assets/videos/shower.mp4'
import thunderstorm from './assets/videos/thunderstorm.mp4'
import snow from './assets/videos/snow.mp4'

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [videoSrc, setVideoSrc] = useState(video)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState('')
  const videoRef = useRef(null)

  const API_KEY = import.meta.env.VITE_API_KEY
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

  const fetchWeather = async (city) => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      const response = await axios.get(url)
      setWeather(response.data)

      const desc = response.data.weather[0].description.toLowerCase()
      let newSrc = video
      if (desc.includes('clear')) newSrc = clearSky
      else if (desc.includes('cloud')) newSrc = clouds
      else if (desc.includes('rain')) newSrc = shower
      else if (desc.includes('thunder')) newSrc = thunderstorm
      else if (desc.includes('snow')) newSrc = snow

      if (newSrc !== videoSrc) {
        // Start transition overlay
        setTransitioning(true)
        // Wait for the overlay to fade in before switching
        setTimeout(() => {
          setVideoSrc(newSrc)
          // Give a moment for video load
          setTimeout(() => setTransitioning(false), 1200)
        }, 600)
      }

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try again.')
      } else {
        setError('An error occurred. Please try again later.')
      }
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.load()
  }, [videoSrc])

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-blue-100'>

      {/* Background video */}
      <video
        key={videoSrc}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className='absolute top-0 left-0 w-full h-full object-cover z-0'
      >
        <source src={videoSrc} type='video/mp4' />
      </video>

      {/* Dark overlay for readability */}
      <div className='absolute top-0 left-0 w-full h-full bg-black/25 z-[1]' />

      {/* FANCY transition animation */}
      <AnimatePresence>
  {transitioning && (
    <motion.div
      key="minimal-transition"
      className="absolute top-0 left-0 w-full h-full z-[5] backdrop-blur-md bg-white/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1,
        ease: 'easeInOut'
      }}
    />
  )}
</AnimatePresence>


<motion.video
  key={videoSrc}
  autoPlay loop muted playsInline
  className="absolute top-0 left-0 w-full h-full object-cover z-0"
  animate={{ scale: transitioning ? 1.1 : 1 }}
  transition={{ duration: 2, ease: 'easeInOut' }}
>
  <source src={videoSrc} type="video/mp4" />
</motion.video>









      {/* Content */}
      <motion.div
        className='relative z-10 bg-black/70 text-white rounded-lg p-8 shadow-lg max-w-md w-full backdrop-blur-sm'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className='text-3xl font-bold text-center mb-6'>Weather App</h1>
        <SearchBar fetchWeather={fetchWeather} />
        {loading && <p className='text-center mt-4'>Loading...</p>}
        {error && <p className='text-center mt-4 text-red-500'>{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </motion.div>
    </div>
  )
}

export default App
