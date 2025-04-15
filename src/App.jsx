import { useState } from 'react';
import { fetchRecentSubmissions, filterByDays } from './utils/fetchData';

function App() {
  const [username, setUsername] = useState('');
  const [days, setDays] = useState(1);
  const [results, setResults] = useState([]);

  const handleFetch = async () => {
    const raw = await fetchRecentSubmissions(username);
    const filtered = filterByDays(raw, days);
    setResults(filtered);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">LeetCode Daily Progress Tracker</h1>

      <input
        type="text"
        placeholder="Enter LeetCode username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        value={days}
        onChange={e => setDays(+e.target.value)}
        className="border p-2 w-20 mr-2"
      />
      <button onClick={handleFetch} className="bg-blue-500 text-white px-4 py-2 rounded">
        Fetch
      </button>

      <ul className="mt-6 space-y-2">
        {results.map((item, i) => (
          <li key={item.id} className="bg-gray-100 p-2 rounded">
            {i + 1}. {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
