// URL-urile de baza ale backend-ului Express.
// In dezvoltare, Vite trimite /api catre http://localhost:5000 prin proxy.
const BASE_URL = "https://meteo-app-pxu6.onrender.com/api";

const WEATHER_URL = `${BASE_URL}/weather`;
const HISTORY_URL = `${BASE_URL}/history`;

// GET /api/weather?city=Iasi
export async function getWeatherByCity(city) {
  const params = new URLSearchParams();
  params.append("city", city.trim());

  const response = await fetch(`${WEATHER_URL}?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Nu s-a putut prelua vremea.");
  }

  return response.json();
}

// GET /api/history
export async function getSearchHistory() {
  const response = await fetch(HISTORY_URL);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Nu s-a putut prelua istoricul.");
  }

  return response.json();
}

// DELETE /api/history
export async function clearSearchHistory() {
  const response = await fetch(HISTORY_URL, { method: "DELETE" });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Nu s-a putut sterge istoricul.");
  }

  return response.json();
}
