// app/api/stock-historical/route.ts
import { NextResponse } from "next/server";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo";

// Define types for the API responses
interface TimeSeriesData {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface DailyResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": {
    [date: string]: TimeSeriesData;
  };
}

interface WeeklyResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Time Zone": string;
  };
  "Weekly Time Series": {
    [date: string]: TimeSeriesData;
  };
}

interface MonthlyResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Time Zone": string;
  };
  "Monthly Time Series": {
    [date: string]: TimeSeriesData;
  };
}

// Common interface for all chart data points
interface ChartDataPoint {
  date: string;
  value: number;
}

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
    // Determine which API to call based on timeframe
    let apiFunction = "TIME_SERIES_DAILY";
    let outputSize = "compact"; // Default to 100 data points

    if (timeframe === "5y" || timeframe === "max") {
      apiFunction = "TIME_SERIES_MONTHLY";
    } else if (timeframe === "1y" || timeframe === "2y") {
      apiFunction = "TIME_SERIES_WEEKLY";
    } else {
      // For shorter timeframes (1m, 3m, 6m), use daily data
      apiFunction = "TIME_SERIES_DAILY";

      if (timeframe === "6m") {
        outputSize = "full"; // Need more data points for 6 months
      }
    }

    // Fetch historical data
    const apiUrl = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${symbol}&outputsize=${outputSize}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the correct time series property based on API function
    let timeSeries: { [date: string]: TimeSeriesData } = {};
    if (apiFunction === "TIME_SERIES_DAILY") {
      timeSeries = (data as DailyResponse)["Time Series (Daily)"] || {};
    } else if (apiFunction === "TIME_SERIES_WEEKLY") {
      timeSeries = (data as WeeklyResponse)["Weekly Time Series"] || {};
    } else if (apiFunction === "TIME_SERIES_MONTHLY") {
      timeSeries = (data as MonthlyResponse)["Monthly Time Series"] || {};
    }

    // Convert to array and sort by date
    let chartData: ChartDataPoint[] = Object.entries(timeSeries)
      .map(([date, values]) => ({
        date,
        value: parseFloat(values["4. close"]),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter data based on timeframe
    const currentDate = new Date();
    const filterDate = new Date();

    switch (timeframe) {
      case "1m":
        filterDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "3m":
        filterDate.setMonth(currentDate.getMonth() - 3);
        break;
      case "6m":
        filterDate.setMonth(currentDate.getMonth() - 6);
        break;
      case "1y":
        filterDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case "2y":
        filterDate.setFullYear(currentDate.getFullYear() - 2);
        break;
      case "5y":
        filterDate.setFullYear(currentDate.getFullYear() - 5);
        break;
      case "max":
        // No filtering needed, show all data
        break;
      default:
        filterDate.setMonth(currentDate.getMonth() - 1); // Default to 1 month
    }

    // If timeframe is not 'max', filter the data
    if (timeframe !== "max") {
      chartData = chartData.filter(
        (point) => new Date(point.date) >= filterDate
      );
    }

    return NextResponse.json({
      symbol,
      timeframe,
      data: chartData,
    });
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
