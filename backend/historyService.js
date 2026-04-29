// Fisier pentru gestionarea istoricului cautarilor.
// Datele sunt salvate in db.json, la fel ca in proiectul principal.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");
const MAX_HISTORY_ITEMS = 20;

function readDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ searches: [] }, null, 2));
  }

  const rawData = fs.readFileSync(DB_PATH, "utf-8");
  const parsedData = JSON.parse(rawData || "{}");

  return {
    searches: Array.isArray(parsedData.searches) ? parsedData.searches : [],
  };
}

function writeDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getSearches() {
  const database = readDatabase();
  return database.searches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addSearch(weatherData) {
  const database = readDatabase();
  const nextId = database.searches.length > 0
    ? Math.max(...database.searches.map(item => Number(item.id))) + 1
    : 1;

  const newSearch = {
    id: String(nextId),
    city: weatherData.city,
    country: weatherData.country,
    temperatureCelsius: weatherData.temperature.celsius,
    temperatureFahrenheit: weatherData.temperature.fahrenheit,
    condition: weatherData.condition,
    recommendation: weatherData.recommendation.title,
    createdAt: new Date().toISOString(),
  };

  const filteredSearches = database.searches.filter(
    item => item.city.toLowerCase() !== weatherData.city.toLowerCase()
  );

  database.searches = [newSearch, ...filteredSearches].slice(0, MAX_HISTORY_ITEMS);
  writeDatabase(database);

  return newSearch;
}

function clearSearches() {
  writeDatabase({ searches: [] });
  return [];
}

module.exports = {
  getSearches,
  addSearch,
  clearSearches,
};
