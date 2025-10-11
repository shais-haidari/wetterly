import { use, useEffect, useRef, useState } from 'react'
import SearchBar from './components/searchBar'
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import video from './video.mp4'
import clearSky from './assets/videos/clear_sky.mp4'
import clouds from './assets/videos/clouds.mp4'
import shower from './assets/videos/shower.mp4'
import 	thunderstorm from './assets/videos/thunderstorm.mp4'
import snow from './assets/videos/snow.mp4'

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState(video);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      console.log(response.data);
      setWeather(response.data);
      if (response.data.weather[0].description.toLowerCase().includes('clear'))setVideoSrc(clearSky);
      else if (response.data.weather[0].description.toLowerCase().includes('cloud')) setVideoSrc(clouds);
      else if (response.data.weather[0].description.toLowerCase().includes('rain')) setVideoSrc(shower);
      else if(response.data.weather[0].description.toLowerCase().includes('thunder')) setVideoSrc(thunderstorm);
      else if(response.data.weather[0].description.toLowerCase().includes('snow')) setVideoSrc(snow);

      else setVideoSrc(video);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('City not found. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-blue-100 ralative overflow-hidden'>
      <video autoPlay loop muted className='absolute top-0 left-0 w-full h-full object-cover z-0' ref={videoRef}>
        <source src={videoSrc} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      <div className='absolute top-0 left-0 w-full h-full bg-black/20 z-1'></div>
      <div className='bg-black/90 text-white rounded-lg p-8 shadow-lg max-w-md w-full z-10 opacity-70'>
        <h1 className='text-3xl font-bold text-center mb-6'>Weather App</h1>
        <SearchBar fetchWeather=
          {fetchWeather}
        />
        {loading && <p className='text-center mt-4'>Loading...</p>}
        {error && <p className='text-center mt-4 text-red-500'>{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  )
}

export default App;