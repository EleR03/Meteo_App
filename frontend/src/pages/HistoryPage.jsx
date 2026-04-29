import { useEffect, useState } from "react";//pastreaza date si ruleaza automat cand pagina se deschide
import { Link } from "react-router-dom";//dice din istoric la pagina principala
import Header from "../components/Header";//nav bar de sus
import { clearSearchHistory, getSearchHistory } from "../api/weatherApi";//import la functii care comunica cu backendul

export default function HistoryPage() {
  const [history, setHistory] = useState([]);//pastreaza linile de cautare
  const [loading, setLoading] = useState(true);//control mesaj de incarcare istoric
  const [error, setError] = useState("");//pastreaza mesajele erori

  useEffect(() => {
    loadHistory();
  }, []);//incarca istoricul prin loadHistory()

  async function loadHistory() {//cere istoricul de la backend
    setLoading(true);
    setError("");//porneste incarca currata erorile vechi

    try {
      const data = await getSearchHistory();
      setHistory(data);//pune istoricul primit de la backend in history
    } catch (err) {
      setError(err.message);//salveaza eroarea pentru a o afisa 
    } finally {
      setLoading(false);
    }//opreste incarcarea chiar daca a reusit sau nu
  }

  async function handleClear() {// functie de stergere istoric
    setError("");

    try {
      const data = await clearSearchHistory();
      setHistory(data);//cererea de delete catre backend si sterge totul din db.json
    } catch (err) {
      setError(err.message);//salveaza erorile pentru a le afisa
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
