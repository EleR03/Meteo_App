export default function RecommendationBox({ recommendation }) {
  if (!recommendation) return null;//primeste un obiect de tip recom.din backend  iar daca nu exista o recomandare returneaza nul adica nimic

  return (
    <section className="rounded-3xl bg-white shadow-lg border border-blue-100 p-6 md:p-7">
      <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.18em]">
            Recomandare
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {recommendation.title}
          </h2>
          <p className="text-gray-600 mt-2 leading-relaxed">
            {recommendation.text}
          </p>
        </div>

        <div className="flex gap-3">
          <Badge active={recommendation.coat} label="Haină" icon="🧥" />
          <Badge active={recommendation.umbrella} label="Umbrelă" icon="☂️" />
        </div>
      </div>
    </section>
  );
}

function Badge({ active, label, icon }) {
  return (
    <div className={`min-w-24 rounded-2xl px-4 py-3 text-center border ${
      active
        ? "bg-blue-600 border-blue-600 text-white shadow-md"
        : "bg-blue-50 border-blue-100 text-gray-500"
    }`}>
      <p className="text-2xl">{icon}</p>
      <p className="text-sm font-semibold mt-1">{active ? "Da" : "Nu"}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}
