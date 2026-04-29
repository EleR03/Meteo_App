// Încarcă variabilele din .env în process.env
require("dotenv").config();

const express = require("express");// creaza serverul
const cors = require("cors");//permite accepta cereri din front
const { fetchWeatherByCity } = require("./weatherService");//ia vremea de la api
const { getSearches, addSearch, clearSearches } = require("./historyService");// citeste istoricul, salveaz cautarea in istoric si sterhe istoricul

const app = express();
const PORT = process.env.PORT || 5000;//creaza aplicatia si o deschide pe protul 5000

app.use(cors()); //da voie front sa faca requesturi 
app.use(express.json());//da voie sa trimita si primeasca  date json

app.get("/", (req, res) => {//daca fac request de GET la aceasta addresa se va executa functia 
  res.send("API-ul meteo rulează corect.");//trimite raspuns simplu la browser
});

// GET /api/weather?city=Iasi
app.get("/api/weather", async (req, res) => {//ruta de vreme este un end point folosit de frontend
  const city = req.query.city;//prea parametrul orasul din url

  if (!city || !city.trim()) {
    return res.status(400).json({ error: "Te rog introdu un nume de oraș." });
  }//verifica daca este oras sau daca sa introdus oras daca nu da eroare si indica user-ului ca nu a introdis orasul
//inainte pentru ca e nevoie de oras pentru rquest api si previne requesturile goale si inutile
  try {
    const weather = await fetchWeatherByCity(city.trim());
    addSearch(weather);
    res.status(200).json(weather);//ia vremea de la api so o salveaza in db.json daca nu are erori o trimite la front 
  } catch (error) {
    console.error("Eroare meteo:", error.message);//daca are eroare o prinde si oprelucreaza

    if (error.statusCode === 404) {
      return res.status(404).json({
        error: `Orașul „${city}” nu a fost găsit. Verifică numele introdus.`,
      });//daca primeste mesaj de eroare egal cu codul 404 spne ca orasul nu a fost gasit
    }

    if (error.statusCode === 401) {
      return res.status(401).json({
        error: "Cheia API OpenWeatherMap este invalidă sau expirată.",
      });// daca primeste codul 401 api ul nu este valid
    }

    res.status(error.statusCode || 500).json({
      error: "A apărut o eroare la preluarea vremii. Încearcă din nou.",
    });
  }
});// eroare la preluare ceva nu e oky in back 


//  GET /api/history si returneaza cautarile salvate in backend/db.json.
//este tratata local sincron nu se face request extern 
app.get("/api/history", (req, res) => {
  try { // bloc try catch pentru erori
    const searches = getSearches();
    res.status(200).json(searches);//face return din db.json la istoricul cautarilor
  } catch (error) {
    console.error("Eroare la citirea istoricului:", error.message);
    res.status(500).json({ error: "Nu s-a putut citi istoricul cautarilor." });
  }
});//partea de eroare daca nu se ajunge la db sau nu se poate citi istoricul


//DELETE /api/history sterge istoricul cautarilor din backend/db.json.
app.delete("/api/history", (req, res) => {//ruta pentru a sterge di istoric
  try {
    const searches = clearSearches();
    res.status(200).json(searches);// sterge toate cautarile din db.json
  } catch (error) {
    console.error("Eroare la stergerea istoricului:", error.message);
    res.status(500).json({ error: "Nu s-a putut sterge istoricul cautarilor." });
  }
});

app.listen(PORT, () => {
  console.log(`Serverul meteo rulează la http://localhost:${PORT}`);
});//se porneste serverul
