// Fisier pentru preluarea si procesarea datelor meteo.
// Aici tinem conversiile, recomandarea si transformarea directiei vantului.

const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";//adresa pentru endpoitul vreme curenta openweathermap

function kelvinToCelsius(value) {
  return Math.round(value - 273.15);
}//conversia temperaturi din kelvini in celsius

function celsiusToFahrenheit(value) {
  return Math.round((value * 9) / 5 + 32);
}//conversia temperaturi din celsius in farinheit

function formatTime(unixTime, timezoneOffset) {
  const localDate = new Date((unixTime + timezoneOffset) * 1000);
  return localDate.toISOString().slice(11, 16);
}// conversie pentru timp din API din Unix in timp normal si calculeaza pentru orasul cautat si zona de timp

function getWindDirection(degrees = 0) {
  const directions = [
    "nord",
    "nord-nord-est",
    "nord-est",
    "est-nord-est",
    "est",
    "est-sud-est",
    "sud-est",
    "sud-sud-est",
    "sud",
    "sud-sud-vest",
    "sud-vest",
    "vest-sud-vest",
    "vest",
    "vest-nord-vest",
    "nord-vest",
    "nord-nord-vest",
  ];

  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}// calculeaza directia vantului din grade cae sunt trimise de API in directia propriu zisa sunt 16 directii

function getWeatherIcon(main = "") {
  const value = main.toLowerCase();

  if (value.includes("clear")) return "☀️";
  if (value.includes("cloud")) return "☁️";
  if (value.includes("rain")) return "🌧️";
  if (value.includes("snow")) return "❄️";
  if (value.includes("thunder")) return "⛈️";
  if (value.includes("mist") || value.includes("fog")) return "🌫️";

  return "🌤️";
}// alege iconita corespunzator cu vremea 

function buildRecommendation({ tempC, condition, windSpeed }) {
  const conditionLower = condition.toLowerCase();
  const needsUmbrella =
    conditionLower.includes("ploaie") ||
    conditionLower.includes("rain") ||
    conditionLower.includes("furtun") ||
    conditionLower.includes("thunder") ||
    conditionLower.includes("burniță") ||
    conditionLower.includes("drizzle");

  const needsCoat = tempC <= 15 || windSpeed >= 9;
  const isBeautifulDay = tempC >= 20 && tempC <= 27 && !needsUmbrella;

  if (isBeautifulDay) {
    return {
      title: "Este o zi frumoasă!",
      text: "Temperatura este plăcută, iar vremea permite o ieșire fără prea multe griji.",
      coat: false,
      umbrella: false,
    };
  }

  if (needsCoat && needsUmbrella) {
    return {
      title: "Ia haina și umbrela.",
      text: "Temperatura sau vântul pot crea disconfort, iar vremea indică posibile precipitații.",
      coat: true,
      umbrella: true,
    };
  }

  if (needsUmbrella) {
    return {
      title: "Ia umbrela cu tine.",
      text: "Condițiile meteo indică ploaie sau precipitații.",
      coat: false,
      umbrella: true,
    };
  }

  if (needsCoat) {
    return {
      title: "Ar fi bine să iei o haină.",
      text: "Temperatura este mai scăzută sau vântul este mai puternic.",
      coat: true,
      umbrella: false,
    };
  }

  return {
    title: "Vreme acceptabilă pentru ieșit.",
    text: "Nu pare să fie nevoie de umbrelă sau de o haină groasă.",
    coat: false,
    umbrella: false,
  };
}// recomandare pentru utilizator  verifica vremea in dependenta de asta returneaza un obiect de tip umbrela sau coat

function normalizeWeatherData(data, searchedCity = "") {// transforma datele de la API brute in obiect simplu 
  const tempC = kelvinToCelsius(data.main.temp);
  const tempF = celsiusToFahrenheit(tempC); //ia temperatura
  const condition = data.weather?.[0]?.description || "vreme necunoscută";
  const mainCondition = data.weather?.[0]?.main || "";//ia descrierea vremi
  const windDegrees = data.wind?.deg || 0;
  const windSpeed = data.wind?.speed || 0;//ia vantul

  return {
    city: searchedCity || data.name,
    country: data.sys?.country || "",
    temperature: {
      celsius: tempC,
      fahrenheit: tempF,
      feelsLikeCelsius: kelvinToCelsius(data.main.feels_like),
    },
    condition,
    icon: getWeatherIcon(mainCondition),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: {
      speed: windSpeed,
      degrees: windDegrees,
      direction: getWindDirection(windDegrees),
    },
    sun: {
      sunrise: formatTime(data.sys.sunrise, data.timezone),
      sunset: formatTime(data.sys.sunset, data.timezone),
    },
    recommendation: buildRecommendation({ tempC, condition, windSpeed }),
  };//returneaza obiectul final vizibil in formatul din aplicatie
}

async function fetchWeatherByCity(city) {//functia de request catre API 
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    const error = new Error("Lipsește cheia OpenWeatherMap din fișierul .env.");
    error.statusCode = 500;
    throw error;//ea cheia di .env daca nu este acolo arunca eroare
  }

  const url = `${OPENWEATHER_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&lang=ro`;
  const response = await fetch(url);//construieste url face requiestul

  if (!response.ok) {
    const error = new Error("Nu s-au putut prelua datele meteo.");
    error.statusCode = response.status;
    throw error;
  }// daca api da eroare arunca errorea  ca nu sa putut prelua datele

  const data = await response.json();
  return normalizeWeatherData(data, city);
}// daca e bine trimite datele brute si le retrurneaza in format

module.exports = {
  kelvinToCelsius,
  celsiusToFahrenheit,
  getWindDirection,
  buildRecommendation,
  normalizeWeatherData,
  fetchWeatherByCity,
};// functii pentru server.js 
