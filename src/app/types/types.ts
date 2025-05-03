// types/types.ts
export type StockSymbolMatch = {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
};

export type SearchResponse = {
  testResult?: StockSymbolMatch[];
  testFilterOptions?: FilterOptions;
  searchResults?: StockSymbolMatch[];
  filterOptions?: FilterOptions;
  error?: string;
};

export type FilterOptions = {
  types: string[];
  regions: string[];
  currencies: string[];
};

export type ActiveFilters = {
  types: string[];
  regions: string[];
  currencies: string[];
};
