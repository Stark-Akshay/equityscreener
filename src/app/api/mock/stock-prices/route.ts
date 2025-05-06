// app/api/stock-prices/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { isThrottled } from "@/app/lib/throttle";

import {
  PricePoint,
  StockResult,
  CachedData,
  RequestBody,
} from "@/app/types/types";
console.log("Mock stock prices route loaded");

// Cache to store price data
const priceCache = new Map<string, CachedData>();

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Generate realistic mock price data
function generateMockPrice(
  symbol: string,
  basePrice: number,
  index: number
): number {
  // Create volatility based on symbol
  const volatility =
    {
      MLGO: 0.15, // High volatility (15%)
      MBOT: 0.08, // Medium-high volatility
      MCHP: 0.05, // Low volatility (stable large cap)
      "CY9D.FRK": 0.07, // European market
      MCHPP: 0.05, // Similar to MCHP
      "MBX.TRT": 0.1, // Canadian market
      MALG: 0.12, // Higher volatility
      MBXBF: 0.1, // Similar to MBX.TRT
      "0K19.LON": 0.05, // UK market (stable)
      VENAF: 0.2, // Warrants (very high volatility)
    }[symbol] || 0.1;

  // Create price movement
  const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
  const percentChange = randomFactor * volatility;

  // Add some trend (slight downward for recent date)
  const trendFactor = -0.002 * (30 - index); // Slight downward trend

  return basePrice * (1 + percentChange + trendFactor);
}

async function fetchMockStockPrice(symbol: string): Promise<PricePoint[]> {
  console.log(`Generating mock data for ${symbol}`);

  // Check if data is in cache
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached mock data for ${symbol}`);
    return cached.data;
  }

  // Base prices for each symbol (in their respective currencies)
  const basePrices: { [key: string]: number } = {
    MLGO: 4.38, // USD - from actual data
    MBOT: 12.5, // USD - increased from 2.50
    MCHP: 87.45, // USD
    "CY9D.FRK": 8.3, // EUR - converted to USD (assuming ~1.1 EUR/USD)
    MCHPP: 86.75, // USD
    "MBX.TRT": 2.15, // CAD - increased from 0.15
    MALG: 5.65, // USD - increased from 0.65
    MBXBF: 1.12, // USD - increased from 0.12
    "0K19.LON": 68.5, // USD
    VENAF: 0.85, // USD - increased from 0.05
  };

  const basePrice = basePrices[symbol] || 10.0; // Default if symbol not found

  try {
    // Generate 30 days of mock price data
    const today = new Date();
    const prices: PricePoint[] = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Format date as YYYY-MM-DD
      const dateString = date.toISOString().split("T")[0];

      // Generate price for this date
      const close = generateMockPrice(symbol, basePrice, i);

      prices.push({
        date: dateString,
        close: Number(close.toFixed(4)),
      });
    }

    // Reverse to get chronological order (oldest to newest)
    prices.reverse();

    console.log(`Generated ${prices.length} mock price points for ${symbol}`);

    // Store in cache
    priceCache.set(symbol, {
      data: prices,
      timestamp: Date.now(),
    });

    return prices;
  } catch (error) {
    console.error(`Error generating mock data for ${symbol}:`, error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log("Mock stock prices POST request received");
  //   console.log("Request method:", req.method);

  //   const ip = req.headers.get("x-forwarded-for") || "global";
  //   const throttle = isThrottled({ key: `price-${ip}`, limitMs: 60_000 }); // 1 minute between requests

  // Comment out throttling for mock API
  // if (throttle.throttled) {
  //   return NextResponse.json(
  //     {
  //       error: `Too many requests. Try again in ${Math.ceil(
  //         throttle.retryAfter! / 1000
  //       )} seconds.`,
  //     },
  //     { status: 429 }
  //   );
  // }

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

    // Process symbols sequentially (no delay needed for mock data)
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      try {
        console.log(
          `Processing mock symbol ${i + 1}/${symbols.length}: ${symbol}`
        );

        // Clean the symbol - remove any whitespace
        const cleanSymbol = symbol.trim();

        if (!cleanSymbol) {
          throw new Error(`Invalid symbol at position ${i}`);
        }

        const prices = await fetchMockStockPrice(cleanSymbol);
        results.push({
          symbol: cleanSymbol,
          prices,
        });

        // No delay needed for mock data, but we can simulate one if desired
        // if (i < symbols.length - 1) {
        //   console.log(`Simulating API delay...`);
        //   await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 second delay
        // }
      } catch (error) {
        console.error(`Error processing mock data for ${symbol}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        results.push({
          symbol: symbol.trim(),
          error: errorMessage,
          prices: [],
        });
      }
    }

    console.log("Mock API route successful, returning results");
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
    console.error("Error processing mock request:", error);
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
      "Mock Stock prices API is running. Use POST with body { symbols: string[] }",
    route: "/api/stock-prices",
    maxSymbols: 5,
    rateLimit: "5 requests per minute per IP",
    note: "This is a mock API that generates fake data",
  });
}
