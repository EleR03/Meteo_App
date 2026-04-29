// Fisier pentru gestionarea istoricului cautarilor.
// Datele sunt salvate in db.json, la fel ca in proiectul principal.

const fs = require("fs"); //se ocupa de citirea și scriera fișierelor
const path = require("path");//construieste cai corecte

const DB_PATH = path.join(__dirname, "db.json");//calea catre folderul curent (backend)(backend/db.json)
const MAX_HISTORY_ITEMS = 20;// contor pastreaza doar ultimile 20 de cautări și face ca fișierul să nu fie prea mare

function readDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ searches: [] }, null, 2));
  }// citeste baza de date daca fisierul nu există il creaza automat

  const rawData = fs.readFileSync(DB_PATH, "utf-8");
  const parsedData = JSON.parse(rawData || "{}");//citeste date si le transformă in fisiere js

  return {
    searches: Array.isArray(parsedData.searches) ? parsedData.searches : [],
  }; // daca se intinpla o erroar sau ceva e gresit returneaza array gol
}

function writeDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));//scrie in baza de date și salveaza indentare (format drăguț)
}

function getSearches() {//sorteaza toate cautările 
  const database = readDatabase();
  return database.searches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}// cele mai recente dintre cautări

function addSearch(weatherData) {// adauga cautare
  const database = readDatabase();
  const nextId = database.searches.length > 0 // gaseste cel mai mare id si il incrementeaza cu 1
    ? Math.max(...database.searches.map(item => Number(item.id))) + 1
    : 1;// daca nu exista incepe cu 1

  const newSearch = {
    id: String(nextId),
    city: weatherData.city,
    country: weatherData.country,
    temperatureCelsius: weatherData.temperature.celsius,
    temperatureFahrenheit: weatherData.temperature.fahrenheit,
    condition: weatherData.condition,
    recommendation: weatherData.recommendation.title,
    createdAt: new Date().toISOString(),
  };// creaza obiectu datele din API in format simplu

  const filteredSearches = database.searches.filter(
    item => item.city.toLowerCase() !== weatherData.city.toLowerCase()
  ); // elimina dublicatele din baza de date daca ai un oras il actualizeaza cu datele noi 

  database.searches = [newSearch, ...filteredSearches].slice(0, MAX_HISTORY_ITEMS);// inregistreaza noua cautare si daca e cazul sterge pe cea mai veche
  writeDatabase(database);// salveaza in db

  return newSearch;//returneaza rezultatul
}

function clearSearches() {
  writeDatabase({ searches: [] });
  return [];
}// este functia care la actionarea buton de sterge istoric curata intreaga baza de date

module.exports = {
  getSearches,
  addSearch,
  clearSearches,
};
//aceste functii se folosesc in sever.js