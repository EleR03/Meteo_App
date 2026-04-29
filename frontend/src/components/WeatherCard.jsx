export default function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <section className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
      <div className="bg-blue-600 text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-blue-100 text-sm font-medium">Vremea în</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-1">
              {weather.city}{weather.country ? `, ${weather.country}` : ""}
            </h2>
            <p className="mt-3 text-blue-50 capitalize">{weather.condition}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-6xl" aria-hidden="true">{weather.icon}</span>
            <div className="text-right">
              <p className="text-5xl font-bold">{weather.temperature.celsius}°C</p>
              <p className="text-blue-100 mt-1">{weather.temperature.fahrenheit}°F</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InfoBox title="Se simte ca" value={`${weather.temperature.feelsLikeCelsius}°C`} icon="🌡️" />
        <InfoBox title="Umiditate" value={`${weather.humidity}%`} icon="💧" />
        <InfoBox title="Presiune" value={`${weather.pressure} hPa`} icon="📊" />
        <InfoBox title="Vânt" value={`${weather.wind.speed} m/s`} subtitle={`${weather.wind.direction} (${weather.wind.degrees}°)`} icon="🧭" />
        <InfoBox title="Răsărit" value={weather.sun.sunrise} icon="🌅" />
        <InfoBox title="Apus" value={weather.sun.sunset} icon="🌇" />
      </div>
    </section>
  );
}

function InfoBox({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
