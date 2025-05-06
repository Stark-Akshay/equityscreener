// app/api/mock/stock-historical/route.ts
import { NextResponse } from "next/server";

// Common interface for all chart data points
interface ChartDataPoint {
  date: string;
  value: number;
}

// Function to generate realistic mock price data
function generateMockPriceData(
  symbol: string,
  timeframe: string,
  basePrice: number,
  volatility: number
): ChartDataPoint[] {
  const currentDate = new Date();
  const startDate = new Date();
  let dataPoints: number = 0;
  let interval: number = 1; // Days between data points

  // Set start date and number of data points based on timeframe
  switch (timeframe) {
    case "1m":
      startDate.setMonth(currentDate.getMonth() - 1);
      dataPoints = 22; // ~22 trading days in a month
      interval = 1;
      break;
    case "3m":
      startDate.setMonth(currentDate.getMonth() - 3);
      dataPoints = 60; // ~60 trading days in 3 months
      interval = 1;
      break;
    case "6m":
      startDate.setMonth(currentDate.getMonth() - 6);
      dataPoints = 120; // ~120 trading days in 6 months
      interval = 1;
      break;
    case "1y":
      startDate.setFullYear(currentDate.getFullYear() - 1);
      dataPoints = 52; // Using weekly data points for 1 year
      interval = 7;
      break;
    case "2y":
      startDate.setFullYear(currentDate.getFullYear() - 2);
      dataPoints = 104; // Using weekly data points for 2 years
      interval = 7;
      break;
    case "5y":
      startDate.setFullYear(currentDate.getFullYear() - 5);
      dataPoints = 60; // Using monthly data points for 5 years
      interval = 30;
      break;
    case "max":
      startDate.setFullYear(currentDate.getFullYear() - 10);
      dataPoints = 120; // Using monthly data points for 10 years
      interval = 30;
      break;
    default:
      startDate.setMonth(currentDate.getMonth() - 1);
      dataPoints = 22;
      interval = 1;
  }

  // Generate price series with random walk and trend
  const result: ChartDataPoint[] = [];
  let price = basePrice;

  // Add a trend based on the symbol's first character (just for variability)
  const symbolFirstChar = symbol.charCodeAt(0);
  const trendFactor = ((symbolFirstChar % 10) - 5) / 100; // Between -0.05 and 0.05

  for (let i = 0; i < dataPoints; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * interval);

    // Random walk with trend
    const randomChange = (Math.random() - 0.5) * 2 * volatility * price;
    const trend = price * trendFactor;
    price = price + randomChange + trend;

    // Ensure price doesn't go negative
    if (price <= 0) {
      price = basePrice * 0.1;
    }

    // Add some seasonality for more realism
    const seasonality =
      Math.sin(i / (dataPoints / 4)) * volatility * price * 0.2;
    price += seasonality;

    result.push({
      date: date.toISOString().split("T")[0],
      value: parseFloat(price.toFixed(2)),
    });
  }

  return result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// Base prices and volatility for each symbol
const stockProperties: Record<
  string,
  { basePrice: number; volatility: number }
> = {
  // MicroAlgo Inc
  MLGO: { basePrice: 2.25, volatility: 0.04 },

  // Microbot Medical Inc
  MBOT: { basePrice: 1.75, volatility: 0.05 },

  // Microchip Technology Inc
  MCHP: { basePrice: 80.5, volatility: 0.015 },

  // Microbot Medical Inc (Frankfurt)
  "CY9D.FRK": { basePrice: 1.65, volatility: 0.045 },

  // Microchip Technology Inc (Preferred)
  MCHPP: { basePrice: 85.25, volatility: 0.012 },

  // Microbix Biosystems Inc
  "MBX.TRT": { basePrice: 0.42, volatility: 0.035 },

  // Microalliance Group Inc
  MALG: { basePrice: 19.75, volatility: 0.02 },

  // Microbix Biosystems Inc (US OTC)
  MBXBF: { basePrice: 0.32, volatility: 0.04 },

  // Microchip Technology Inc (London)
  "0K19.LON": { basePrice: 81.2, volatility: 0.016 },

  // MicroAlgo Inc - Warrants
  VENAF: { basePrice: 0.75, volatility: 0.08 },

  // Default properties for any other symbols
  DEFAULT: { basePrice: 50.0, volatility: 0.02 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const timeframe = searchParams.get("timeframe") || "1y"; // Default to 1 year

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Get base price and volatility for the symbol or use default
    const props = stockProperties[symbol] || stockProperties["DEFAULT"];

    // Generate mock price data
    const chartData = generateMockPriceData(
      symbol,
      timeframe,
      props.basePrice,
      props.volatility
    );

    return NextResponse.json({
      symbol,
      timeframe,
      data: chartData,
    });
  } catch (error) {
    console.error("Error generating mock historical data:", error);
    return NextResponse.json(
      { error: "Failed to generate mock historical data" },
      { status: 500 }
    );
  }
}
