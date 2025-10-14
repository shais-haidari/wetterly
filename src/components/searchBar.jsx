import React, { useState, useEffect } from "react";

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
    setHistory(newHistory);
    saveHistory(newHistory);

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
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Search Input */}
      <form
        className="flex w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-md overflow-hidden"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 bg-transparent text-white placeholder-gray-300 outline-none"
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 px-4 text-white font-semibold hover:bg-blue-700 transition"
        >
           Search
        </button>
      </form>

      {/* Search History */}
      {history.length > 0 && (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-md p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
               Recent Searches
            </h3>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition"
            >
               Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="px-3 py-1.5 bg-white/20 rounded-full border border-white/20 hover:bg-blue-600 hover:border-blue-400 transition text-sm"
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
