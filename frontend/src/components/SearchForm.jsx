export default function SearchForm({ city, setCity, error, loading, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-3xl shadow-lg border border-blue-100 p-5 md:p-6"
    >
      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
        Unde ești?
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Exemplu: Iași, București, Chicago"
          className={`flex-1 px-4 py-3 rounded-2xl border text-gray-800 bg-blue-50/50 outline-none transition
            ${error ? "border-red-300 focus:ring-2 focus:ring-red-100" : "border-blue-100 focus:ring-2 focus:ring-blue-200"}`}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Se caută..." : "Afișează vremea"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">⚠ {error}</p>}
    </form>
  );
}
