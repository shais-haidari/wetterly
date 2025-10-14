import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Clock, Trash2, Search } from "lucide-react"; // ✅ nice icons

const SearchBar = ({ fetchWeather }) => {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState([]);
  const citiesCollection = collection(firestore, "cities");

  // ✅ Load previous searches
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snapshot = await getDocs(citiesCollection);
        const cities = snapshot.docs.map((doc) => doc.data().city);
        setHistory([...new Set(cities.reverse())]); // remove duplicates, latest first
      } catch (error) {
        console.error("Error fetching search history:", error);
      }
    };

    fetchHistory();
  }, []);

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    fetchWeather(trimmedCity);

    try {
      await addDoc(citiesCollection, { city: trimmedCity });
      setHistory((prev) => [...new Set([trimmedCity, ...prev])]);
    } catch (error) {
      console.error("Error saving city:", error);
    }

    setCity("");
  };

  // ✅ Re-search from history
  const handleHistoryClick = (name) => {
    setCity(name);
    fetchWeather(name);
  };

  // ✅ Clear local history (doesn’t delete Firestore data)
  const clearHistory = () => setHistory([]);

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Search input */}
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
          <Search size={18} />
          Search
        </button>
      </form>

      {/* Search history */}
      {history.length > 0 && (
        <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-md p-4 text-white">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-300" />
              <h3 className="text-lg font-semibold">Recent Searches</h3>
            </div>
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition"
            >
              <Trash2 size={14} />
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
