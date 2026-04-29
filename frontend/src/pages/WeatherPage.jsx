import { useState } from "react";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import WeatherCard from "../components/WeatherCard";
import RecommendationBox from "../components/RecommendationBox";
import { getWeatherByCity } from "../api/weatherApi";
import { useFormValidation } from "../hooks/useFormValidation";

export default function WeatherPage() {
  const [city, setCity] = useState("Iași");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const { error, validateCity, clearError } = useFormValidation();
  const [requestError, setRequestError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setRequestError("");

    if (!validateCity(city)) return;

    setLoading(true);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      clearError();
    } catch (err) {
      setWeather(null);
      setRequestError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="space-y-6">
          <SearchForm
            city={city}
            setCity={setCity}
            error={error}
            loading={loading}
            onSubmit={handleSubmit}
          />

          {requestError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4">
              {requestError}
            </div>
          )}

          <RecommendationBox recommendation={weather?.recommendation} />
          <WeatherCard weather={weather} />
        </div>
      </main>
    </div>
  );
}
