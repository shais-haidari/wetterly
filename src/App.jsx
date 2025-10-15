import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SearchBar from "./components/searchBar";
import WeatherCard from "./components/WeatherCard";
import LikeButton from "./components/LikeButton";
import logo from "./assets/logo/logo_white.png";

// 🎬 Video backgrounds
import defaultVideo from "./video.mp4";
import clearSky from "./assets/videos/clear_sky.mp4";
import clouds from "./assets/videos/clouds.mp4";
import shower from "./assets/videos/shower.mp4";
import thunderstorm from "./assets/videos/thunderstorm.mp4";
import snow from "./assets/videos/snow.mp4";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoSrc, setVideoSrc] = useState(defaultVideo);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);

      // Choose background video
      const desc = response.data.weather[0].description.toLowerCase();
      let newSrc = defaultVideo;
      if (desc.includes("clear")) newSrc = clearSky;
      else if (desc.includes("cloud")) newSrc = clouds;
      else if (desc.includes("rain") || desc.includes("drizzle")) newSrc = shower;
      else if (desc.includes("thunder")) newSrc = thunderstorm;
      else if (desc.includes("snow")) newSrc = snow;

      // Smooth video transition
      if (newSrc !== videoSrc) {
        setTransitioning(true);
        setTimeout(() => {
          setVideoSrc(newSrc);
          setTimeout(() => setTransitioning(false), 1200);
        }, 600);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("City not found. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [videoSrc]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
      {/* 🎬 Background video */}
      <motion.video
        key={videoSrc}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        animate={{ scale: transitioning ? 1.1 : 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </motion.video>

      {/* 🌫️ Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-[1]" />

      {/* ✨ Transition blur */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="transition-overlay"
            className="absolute top-0 left-0 w-full h-full z-[5] backdrop-blur-md bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* 🌤️ Main card */}
      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-3xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-4 flex justify-center">
          <img src={logo} alt="logo" className="w-48" />
        </div>

        {/* 🔍 Search Bar */}
        <SearchBar fetchWeather={fetchWeather} />

        {/* 🌀 Weather Info */}
        {loading && <p className="text-blue-200 mt-4">Loading...</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </motion.div>

      {/* ❤️ Like Button */}
      <LikeButton />

      {/* ⚡ Footer */}
      <footer className="absolute bottom-4 text-xs text-gray-300 z-10 text-left w-full px-4 fixed">
        © {new Date().getFullYear()} Wetterly | Developed by Shais
        <br />
        <div>Powered by OpenWeather API</div>
      </footer>
    </div>
  );
}

export default App;
