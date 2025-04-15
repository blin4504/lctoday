import { useState, useEffect } from "react";
import { fetchRecentSubmissions, filterByDays } from "./utils/fetchData";

function App() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const lastUsername = localStorage.getItem("lastUsername");
    if (lastUsername) {
      setUsername(lastUsername);
      const cacheKey = `leetcode_${lastUsername}`;
      const cachedResults = localStorage.getItem(cacheKey);
      if (cachedResults) {
        setResults(JSON.parse(cachedResults));
      }
    }
  }, []);

  const handleFetch = async () => {
    if (isFetching) return;
    setIsFetching(true);

    const cacheKey = `leetcode_${username}`;
    const cachedResults = localStorage.getItem(cacheKey);

    if (cachedResults) {
      setResults(JSON.parse(cachedResults));
      setIsFetching(false);
      return;
    }

    try {
      const raw = await fetchRecentSubmissions(username);
      // Filter for submissions from today (current day)
      const filtered = filterByDays(raw || [], 1); // Hardcode to 1 day (today)
      const finalResults = Array.isArray(filtered) ? filtered : [];
      setResults(finalResults);
      localStorage.setItem(cacheKey, JSON.stringify(finalResults));
      localStorage.setItem("lastUsername", username);
    } catch (error) {
      console.error("Fetch error:", error);
      setResults([]);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        LeetCode Daily Progress Tracker
      </h1>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-64"
        />
        <button
          onClick={handleFetch}
          disabled={isFetching}
          className={`bg-blue-500 text-white px-4 py-2 rounded
                     hover:bg-blue-600 hover:scale-105
                     active:bg-blue-700 active:scale-95
                     transition-all duration-150 ease-in-out
                     shadow-md hover:shadow-lg cursor-pointer
                     ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isFetching ? "Fetching..." : "Fetch"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Formatted Submissions</h2>
            <button
              onClick={() => {
                const text = results
                  .map((item) => `${item.title}`)
                  .join("\n");
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-gray-600 text-white px-3 py-1 rounded
                         hover:bg-gray-700 hover:scale-105
                         active:bg-gray-800 active:scale-95
                         transition-all duration-150 ease-in-out
                         shadow-md hover:shadow-lg cursor-pointer"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <textarea
            readOnly
            value={results.map((item) => `${item.title}`).join("\n")}
            rows={Math.max(5, results.length)}
            className="w-full p-3 rounded border font-mono bg-gray-600"
          />
        </div>
      )}
    </div>
  );
}

export default App;