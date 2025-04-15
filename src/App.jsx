import { useState } from "react";
import { fetchRecentSubmissions, filterByDays } from "./utils/fetchData";

function App() {
  const [username, setUsername] = useState("");
  const [days, setDays] = useState(1);
  const [results, setResults] = useState([
    {
      id: "1",
      title: "Two Sum",
      titleSlug: "two-sum",
      timestamp: 1713120000,
    },
    {
      id: "2",
      title: "Add Two Numbers",
      titleSlug: "add-two-numbers",
      timestamp: 1713206400,
    },
    {
      id: "3",
      title: "Longest Substring Without Repeating Characters",
      titleSlug: "longest-substring-without-repeating-characters",
      timestamp: 1713292800,
    },
  ]);
  const [copied, setCopied] = useState(false);

  const handleFetch = async () => {
    try {
        const raw = await fetchRecentSubmissions(username);
        const filtered = filterByDays(raw || [], days);
        setResults(Array.isArray(filtered) ? filtered : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setResults([]);
      }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        LeetCode Daily Progress Tracker
      </h1>

      <input
        type="text"
        placeholder="Enter LeetCode username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mr-2 w-64"
      />
      <select
        value={days}
        onChange={(e) => setDays(+e.target.value)}
        className="border p-2 w-20 mr-2"
      >
        <option value="1">1</option>
        <option value="3">2</option>
        <option value="5">3</option>
        <option value="7">4</option>
      </select>
      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded
                   hover:bg-blue-600 hover:scale-105
                   active:bg-blue-700 active:scale-95
                   transition-all duration-150 ease-in-out
                   shadow-md hover:shadow-lg cursor-pointer"
      >
        Fetch
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Formatted Submissions</h2>
            <button
              onClick={() => {
                const text = results
                  .map((item, i) => "```\n" + `${i + 1}. ${item.title}` + "```")
                  .join("");
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
            value={results
              .map((item, i) => `${i + 1}. ${item.title}`)
              .join("\n")}
            rows={Math.max(5, results.length)}
            className="w-full p-3 rounded border font-mono bg-gray-600"
          />
        </div>
      )}
    </div>
  );
}

export default App;
