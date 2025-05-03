// app/page.tsx

import SymbolSearch from "./components/SymbolSearch";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start pt-16 pb-20 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Stock Symbol Search
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for stocks, ETFs, indices and more. Filter results by type, region, and currency.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <SymbolSearch />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data powered by Alpha Vantage API</p>
        </div>
      </div>
    </main>
  );
}