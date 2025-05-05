// app/api/stock-prices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isThrottled } from "@/app/lib/throttle";
import {
  PricePoint,
  StockResult,
  CachedData,
  RequestBody,
  AlphaVantageResponse,
} from "@/app/types/types";

console.log("Stock prices route loaded");

// Cache to store price data
const priceCache = new Map<string, CachedData>();

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

async function fetchStockPrice(symbol: string): Promise<PricePoint[]> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  console.log("API Key present:", !!apiKey);

  // Check for missing API key
  if (!apiKey) {
    throw new Error("Alpha Vantage API key is not configured");
  }

  // Check if data is in cache
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${symbol}`);
    return cached.data;
  }

  try {
    console.log(`Fetching data for ${symbol}`);
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;
    console.log(`API URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error(`Response body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlphaVantageResponse = await response.json();

    // Check for API limit error
    if (data.Note) {
      console.error(`API rate limit error: ${data.Note}`);
      throw new Error("API rate limit exceeded");
    }

    // Check for API error
    if (data.Error) {
      console.error(`API error: ${data.Error}`);
      throw new Error(data.Error);
    }

    // Extract and format price data (last 30 days)
    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      console.error(`No Time Series data found for ${symbol}`);
      console.error("Full response:", data);
      throw new Error(`No price data found for ${symbol}`);
    }

    const prices = Object.entries(timeSeries)
      .slice(0, 30) // Last 30 days
      .map(([date, dayData]) => ({
        date,
        close: parseFloat(dayData["4. close"]),
      }))
      .reverse(); // Most recent last

    console.log(
      `Successfully fetched ${prices.length} price points for ${symbol}`
    );

    // Store in cache
    priceCache.set(symbol, {
      data: prices,
      timestamp: Date.now(),
    });

    return prices;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    console.error("Error details:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log("Stock prices POST request received");
  console.log("Request method:", req.method);

  const ip = req.headers.get("x-forwarded-for") || "global";
  const throttle = isThrottled({ key: `price-${ip}`, limitMs: 60_000 }); // 1 minute between requests

  if (throttle.throttled) {
    return NextResponse.json(
      {
        error: `Too many requests. Try again in ${Math.ceil(
          throttle.retryAfter! / 1000
        )} seconds.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json()) as RequestBody;
    const { symbols } = body;

    console.log("Raw request body:", body);
    console.log("Received symbols:", symbols);
    console.log("Symbols array type:", Array.isArray(symbols));
    console.log("Symbols array length:", symbols?.length);

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        {
          error: "Symbols array is required",
        },
        { status: 400 }
      );
    }

    if (symbols.length > 5) {
      return NextResponse.json(
        {
          error: "Maximum 5 symbols allowed",
        },
        { status: 400 }
      );
    }

    if (symbols.length === 0) {
      return NextResponse.json(
        {
          error: "At least one symbol is required",
        },
        { status: 400 }
      );
    }

    const results: StockResult[] = [];

    // Fetch data sequentially with delay to avoid hitting API rate limits
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      try {
        console.log(`Processing symbol ${i + 1}/${symbols.length}: ${symbol}`);

        // Clean the symbol - remove any whitespace
        const cleanSymbol = symbol.trim();

        if (!cleanSymbol) {
          throw new Error(`Invalid symbol at position ${i}`);
        }

        const prices = await fetchStockPrice(cleanSymbol);
        results.push({
          symbol: cleanSymbol,
          prices,
        });

        // Add delay between API calls (except for last one)
        if (i < symbols.length - 1) {
          // Alpha Vantage allows 5 requests per minute, so we need at least 12 seconds between requests
          const delayTime = 12000; // 12 seconds delay
          console.log(
            `Waiting ${
              delayTime / 1000
            } seconds before next API call to avoid rate limiting...`
          );
          await new Promise((resolve) => setTimeout(resolve, delayTime));
        }
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        results.push({
          symbol: symbol.trim(),
          error: errorMessage,
          prices: [],
        });
      }
    }

    console.log("API route successful, returning results");
    console.log(
      "Results summary:",
      results.map((r) => ({
        symbol: r.symbol,
        pricesLength: r.prices?.length || 0,
        error: r.error,
      }))
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error processing request:", error);
    console.error("Error details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message:
      "Stock prices API is running. Use POST with body { symbols: string[] }",
    route: "/api/stock-prices",
    maxSymbols: 5,
    rateLimit: "5 requests per minute per symbol",
  });
}
