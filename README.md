# Meteo_App

Aplicație web pentru afișarea vremii curente într-un oraș introdus de utilizator.

Aplicația folosește:

- React + Vite pentru interfața web;
- Tailwind CSS pentru design;
- Node.js + Express pentru server;
- OpenWeatherMap API pentru datele meteo;
- `backend/db.json` pentru salvarea istoricului căutărilor.

## Pornire backend

```bash
cd backend
npm install
npm run dev
```

Backend-ul pornește pe:

```text
http://localhost:5000
```

## Pornire frontend

În alt terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend-ul pornește pe:

```text
http://localhost:5173
```

## Fișiere backend importante

- `server.js` - pornește serverul Express și definește rutele API;
- `weatherService.js` - preia și procesează datele meteo;
- `historyService.js` - citește și scrie istoricul în `db.json`;
- `db.json` - baza de date locală pentru căutările utilizatorului.

## Rute API

- `GET /api/weather?city=Iasi` - returnează vremea pentru orașul introdus;
- `GET /api/history` - returnează istoricul căutărilor;
- `DELETE /api/history` - șterge istoricul.

## Funcționalități

- căutarea vremii după oraș;
- temperatură în Celsius și Fahrenheit;
- afișare umiditate, presiune, vânt, răsărit și apus;
- conversia direcției vântului din grade în text;
- recomandare pentru haină sau umbrelă;
- salvarea căutărilor în `db.json`.
