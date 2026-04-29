import { useState } from "react";//salveaza date in componente react
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import WeatherCard from "../components/WeatherCard";
import RecommendationBox from "../components/RecommendationBox";//importa componentele vizuale
import { getWeatherByCity } from "../api/weatherApi";//cere vremea de la backend
import { useFormValidation } from "../hooks/useFormValidation";//valideaza orasul introdus hook

export default function WeatherPage() {
  const [city, setCity] = useState("Iași");//initial introdus in formular iasi
  const [weather, setWeather] = useState(null);//salveaza datele primite de la backend
  const [loading, setLoading] = useState(false);//arata daca aplicatia cauta vremea 
  const { error, validateCity, clearError } = useFormValidation();//hook de eror validare , verificare oras si stergere eroare
  const [requestError, setRequestError] = useState("");//pasreaza erorile din request /api

  async function handleSubmit(e) {//functia de handleSubmit executata cand userul apasa butonul de afisate vreme
    e.preventDefault();//opreste refresh la pagina
    setRequestError("");//sterge erorile vechi

    if (!validateCity(city)) return;//dac orasul nu este valid functia se opreste 

    setLoading(true);//porneste starea de incarcare 
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
      clearError();//cere vremea de la backend , salveaza rezultatul si sterge eroarea de validare  
    } catch (err) {
      setWeather(null);
      setRequestError(err.message);//daca apare eroare se sterge vremea curenta si se afiseaza mesajul de eroare 
    } finally {
      setLoading(false);//opresre lodingul indiferent de rezultat
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
