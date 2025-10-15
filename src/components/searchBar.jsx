import React, { useState, useEffect } from "react";
import { Search, Clock, XCircle } from "lucide-react"; // optional icons — ensure lucide-react is installed

const SearchBar = ({ fetchWeather }) => {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(savedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  const saveHistory = (newHistory) => {
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    fetchWeather(trimmedCity);

    // Update history
    const newHistory = [trimmedCity, ...history.filter((h) => h !== trimmedCity)];
    setHistory(newHistory.slice(0, 8)); // limit to last 8
    saveHistory(newHistory.slice(0, 8));

    setCity("");
  };

  // Click on a history item
  const handleHistoryClick = (name) => {
    setCity(name);
    fetchWeather(name);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      {/* 🔍 Search Input */}
      <form
        className="flex w-full max-w-2xl bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg overflow-hidden"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-5 bg-transparent text-white placeholder-gray-300 text-lg outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-600 px-6 text-lg font-semibold hover:bg-blue-700 transition-all duration-200"
        >
          <Search size={22} />
          Search
        </button>
      </form>

      {/* 🕓 Search History */}
      {history.length > 0 && (
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-5 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Clock size={20} /> Recent Searches
            </h3>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition"
            >
              <XCircle size={16} /> Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="px-4 py-2 bg-white/20 rounded-full border border-white/20 hover:bg-blue-600 hover:border-blue-400 transition text-sm sm:text-base"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
