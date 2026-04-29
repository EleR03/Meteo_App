import { Link, NavLink } from "react-router-dom";// librarie de navigare din React permite navigare simpla 

export default function Header() {//defineste componenta care este afisata in susu pagini
  return (
    <header className="w-full bg-white/90 backdrop-blur border-b border-blue-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3"> 
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            ☁️
          </div>
          <h1 className="text-xl font-bold text-gray-900">Starea vremii</h1>
        </Link>

        <nav className="flex gap-2 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            Vreme curentă
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            Istoric
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
