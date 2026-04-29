// Încarcă variabilele din .env în process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { fetchWeatherByCity } = require("./weatherService");
const { getSearches, addSearch, clearSearches } = require("./historyService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API-ul meteo rulează corect.");
});

// GET /api/weather?city=Iasi
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city || !city.trim()) {
    return res.status(400).json({ error: "Te rog introdu un nume de oraș." });
  }

  try {
    const weather = await fetchWeatherByCity(city.trim());
    addSearch(weather);
    res.status(200).json(weather);
  } catch (error) {
    console.error("Eroare meteo:", error.message);

    if (error.statusCode === 404) {
      return res.status(404).json({
        error: `Orașul „${city}” nu a fost găsit. Verifică numele introdus.`,
      });
    }

    if (error.statusCode === 401) {
      return res.status(401).json({
        error: "Cheia API OpenWeatherMap este invalidă sau expirată.",
      });
    }

    res.status(error.statusCode || 500).json({
      error: "A apărut o eroare la preluarea vremii. Încearcă din nou.",
    });
  }
});

// GET /api/history
// Returneaza cautarile salvate in backend/db.json.
app.get("/api/history", (req, res) => {
  try {
    const searches = getSearches();
    res.status(200).json(searches);
  } catch (error) {
    console.error("Eroare la citirea istoricului:", error.message);
    res.status(500).json({ error: "Nu s-a putut citi istoricul cautarilor." });
  }
});

// DELETE /api/history
// Sterge istoricul cautarilor din backend/db.json.
app.delete("/api/history", (req, res) => {
  try {
    const searches = clearSearches();
    res.status(200).json(searches);
  } catch (error) {
    console.error("Eroare la stergerea istoricului:", error.message);
    res.status(500).json({ error: "Nu s-a putut sterge istoricul cautarilor." });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul meteo rulează la http://localhost:${PORT}`);
});
