import React from "react";

const WeatherCard = ({ weather }) => {
  // 🕒 Convert UNIX timestamp to readable local time
  const formatTime = (timestamp, timezone) => {
    const local = new Date((timestamp + timezone) * 1000);
    return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 🧭 Convert wind degrees to direction name
  const getWindDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <div className="mt-6">
      {/* 🏙 City + Country */}
      <h2 className="text-3xl font-bold text-center mb-2">
        {weather.name}, {weather.sys.country}
      </h2>

      {/* 🌤️ Icon + Temperature */}
      <div className="flex justify-center items-center mt-2">
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt={weather.weather[0].description}
          className="w-24 h-24"
        />
        <p className="text-6xl font-extrabold">{Math.round(weather.main.temp)}°C</p>
      </div>

      {/* ☁️ Description */}
      <p className="text-center text-gray-300 capitalize text-lg">
        {weather.weather[0].description}
      </p>

      {/* 🌡️ Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 text-center text-gray-100">
        <div>
          <p className="text-gray-400">Feels Like</p>
          <p className="font-bold">{Math.round(weather.main.feels_like)}°C</p>
        </div>
        <div>
          <p className="text-gray-400">Min Temp</p>
          <p className="font-bold">{Math.round(weather.main.temp_min)}°C</p>
        </div>
        <div>
          <p className="text-gray-400">Max Temp</p>
          <p className="font-bold">{Math.round(weather.main.temp_max)}°C</p>
        </div>
        <div>
          <p className="text-gray-400">Humidity</p>
          <p className="font-bold">{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-400">Pressure</p>
          <p className="font-bold">{weather.main.pressure} hPa</p>
        </div>
        <div>
          <p className="text-gray-400">Cloudiness</p>
          <p className="font-bold">{weather.clouds.all}%</p>
        </div>
        <div>
          <p className="text-gray-400">Wind Speed</p>
          <p className="font-bold">{weather.wind.speed} m/s</p>
        </div>
        <div>
          <p className="text-gray-400">Wind Direction</p>
          <p className="font-bold">
            {weather.wind.deg}° ({getWindDirection(weather.wind.deg)})
          </p>
        </div>
        <div>
          <p className="text-gray-400">Visibility</p>
          <p className="font-bold">{(weather.visibility / 1000).toFixed(1)} km</p>
        </div>
        <div>
          <p className="text-gray-400">Sunrise</p>
          <p className="font-bold">
            {formatTime(weather.sys.sunrise, weather.timezone)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Sunset</p>
          <p className="font-bold">
            {formatTime(weather.sys.sunset, weather.timezone)}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Timezone</p>
          <p className="font-bold">
            UTC {weather.timezone >= 0 ? "+" : ""}
            {weather.timezone / 3600}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
