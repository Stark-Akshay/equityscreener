// app/page.tsx

import SymbolSearch from "./components/SymbolSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start pt-10 pb-20 px-4">
      <div className="w-full max-w-8xl mx-auto">
        <header className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Equity Screener
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for stocks, ETFs, indices and more. Filter results by type, region, and currency.
          </p>
        </header>

        <section
          className="bg-white rounded-xl shadow-md p-6"
          aria-label="Search tool"
        >
          <SymbolSearch />
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Data powered by <a href="https://www.alphavantage.co/" className="underline hover:text-gray-700" aria-label="Visit Alpha Vantage website">Alpha Vantage API</a></p>
        </footer>
      </div>
    </main>
  );
}