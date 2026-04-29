import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { clearSearchHistory, getSearchHistory } from "../api/weatherApi";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    setError("");

    try {
      const data = await getSearchHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    setError("");

    try {
      const data = await clearSearchHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Istoricul căutărilor meteo</h2>
              <p className="text-gray-500 mt-2">
                Căutările sunt salvate pe server, nu doar în browser, pentru a respecta stilul proiectului principal.
              </p>
            </div>

            <button
              onClick={handleClear}
              className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
            >
              Șterge istoricul
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-5">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500">Se încarcă istoricul...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500">Nu există căutări salvate momentan.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item) => (
                <Link
                  key={item.id}
                  to="/"
                  className="rounded-2xl bg-blue-50 border border-blue-100 p-4 text-gray-800 hover:border-blue-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-lg">🌍 {item.city}, {item.country}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(item.createdAt).toLocaleString("ro-RO")}
                      </p>
                    </div>
                    <span className="font-semibold text-blue-700">
                      {item.temperatureCelsius}°C / {item.temperatureFahrenheit}°F
                    </span>
                  </div>

                  <p className="text-gray-600 mt-3 capitalize">{item.condition}</p>
                  <p className="text-sm text-blue-700 mt-2">{item.recommendation}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
