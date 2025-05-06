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

export type StockSymbolResponse = {
  bestMatches: StockSymbolMatch[];
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

//Types for news items

export interface FilteredNewsItem {
  title: string;
  url: string;
  timePublished: string;
  summary: string;
  source: string;
  bannerImage: string;
  overallSentiment: string;
}

export interface FilteredOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  Address: string;
  OfficialSite: string;
  MarketCapitalization?: string;
  PERatio?: string;
  DividendYield?: string;
  EPS?: string;
  Beta?: string;
  "52WeekHigh"?: string;
  "52WeekLow"?: string;
}

export interface ApiResponse {
  overview: FilteredOverview;
  news: FilteredNewsItem[];
  hasMoreNews: boolean;
  totalNewsCount: number;
}

export type StockPricePoint = {
  date: string;
  close: number;
};

export type StockPriceData = {
  symbol: string;
  prices: StockPricePoint[];
  error?: string;
};

export type DashboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: StockSymbolMatch[];
};

export type ChartDataPoint = {
  date: string;
  [key: string]: number | string | null;
};
