// utils/apiUtils.ts

// Set this to true to use mock APIs instead of real ones
const USE_MOCK_API = true;

/**
 * Gets the appropriate base URL for API endpoints based on configuration
 * @returns The base URL for API endpoints
 */
export function getApiBaseUrl(): string {
  return USE_MOCK_API ? "/api/mock" : "/api";
}

/**
 * Get the URL for fetching stock overview data
 * @param symbol Stock symbol
 * @param page Page number for pagination (optional)
 * @param limit Number of news items per page (optional)
 * @param newsOnly Whether to fetch only news data (optional)
 * @returns URL for the API endpoint
 */
export const getStockOverviewUrl = (
  symbol: string,
  page?: number,
  limit?: number,
  newsOnly?: boolean
): string => {
  let url = `${getApiBaseUrl()}/stock-overview?symbol=${encodeURIComponent(
    symbol
  )}`;

  if (page) {
    url += `&page=${page}`;
  }

  if (limit) {
    url += `&limit=${limit}`;
  }

  if (newsOnly) {
    url += `&newsOnly=true`;
  }

  return url;
};

/**
 * Gets the historical stock data API endpoint URL
 * @param symbol The stock symbol to fetch data for
 * @param timeframe The timeframe for historical data (e.g., '1m', '3m', '1y')
 * @returns The API endpoint URL
 */
export function getStockHistoricalUrl(
  symbol: string,
  timeframe: string
): string {
  console.log(
    `${getApiBaseUrl()}/stock-historical?symbol=${symbol}&timeframe=${timeframe}`
  );
  return `${getApiBaseUrl()}/stock-historical?symbol=${symbol}&timeframe=${timeframe}`;
}

/**
 * Gets the symbol search API endpoint URL
 * @param keyword The search keyword to fetch matching symbols
 * @returns The API endpoint URL
 */
export function getSymbolSearchUrl(keyword: string): string {
  return `${getApiBaseUrl()}/symbol-search?keyword=${encodeURIComponent(
    keyword
  )}`;
}

/**
 * Gets the stock prices API endpoint URL
 * @returns The API endpoint URL
 */

export function getStockPricesUrl() {
  return `${getApiBaseUrl()}/stock-prices`;
}
