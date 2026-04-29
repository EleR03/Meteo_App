// BrowserRouter – furnizează contextul de rutare întregii aplicații
// Routes     – container pentru toate paginile definite
// Route      – asociază un path cu o componentă
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WeatherPage from "./pages/WeatherPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principala - cautarea vremii curente */}
        <Route path="/" element={<WeatherPage />} />

        {/* Ruta secundara - ultimele orase cautate, salvate in backend/db.json */}
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
