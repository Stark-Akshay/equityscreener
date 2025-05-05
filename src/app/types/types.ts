// types/types.ts

/* Types required for:
                      app/components/DashboardModal.tsx
                      app/components/StockTable.tsx
                      app/components/SymbolSearch.tsx
                      
*/

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

/* Types required for:
                        api/stock-prices/route.ts 
                        api/fake-prices/route.ts
*/
export interface PricePoint {
  date: string;
  close: number;
}

export interface StockResult {
  symbol: string;
  prices: PricePoint[];
  error?: string;
}

export interface CachedData {
  data: PricePoint[];
  timestamp: number;
}

export interface RequestBody {
  symbols: string[];
}

/* Types required for:
                        api/stock-prices/route.ts 
*/
export interface TimeSeriesData {
  [date: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
}

export interface AlphaVantageResponse {
  "Time Series (Daily)": TimeSeriesData;
  Error?: string;
  Note?: string;
}
