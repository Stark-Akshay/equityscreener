//src/app/symbol-search/route.ts

import { NextRequest } from "next/server";
// import axios from "axios";
import { isThrottled } from "@/app/lib/throttle";
// import {
//   AlphaVantageMatch,
//   AlphaVantageResponse,
//   FilterOptions,
// } from "@/app/types/api";
import { testFilterOptions, testResult } from "@/app/constants/mockdata";

const MIN_TIME_BETWEEN_CALLS_MS = 15_000; // 15 seconds

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const ip = req.headers.get("x-forwarded-for") || "global";

  const throttle = isThrottled({ key: ip, limitMs: MIN_TIME_BETWEEN_CALLS_MS });

  if (throttle.throttled) {
    return new Response(
      JSON.stringify({
        searchResults: [],
        filterOptions: { types: [], regions: [], currencies: [] },
        error: `Too many requests. Try again in ${Math.ceil(
          throttle.retryAfter! / 1000
        )} seconds.`,
      }),
      { status: 429 }
    );
  }

  if (!keyword) {
    return new Response(
      JSON.stringify({
        searchResults: [],
        filterOptions: { types: [], regions: [], currencies: [] },
        error: "Keyword parameter is required",
      }),
      { status: 400 }
    );
  }
  // TODO: Uncomment this later for real-time data.
  try {
    // const response = await axios.get<AlphaVantageResponse>(
    //   "https://www.alphavantage.co/query",
    //   {
    //     params: {
    //       function: "SYMBOL_SEARCH",
    //       keywords: keyword,
    //       apikey: process.env.ALPHA_VANTAGE_API_KEY,
    //     },
    //   }
    // );

    // const testResult = response.data.bestMatches || [];

    // const testFilterOptions: FilterOptions = {
    //   types: [
    //     ...new Set(testResult.map((m: AlphaVantageMatch) => m["3. type"])),
    //   ],
    //   regions: [
    //     ...new Set(testResult.map((m: AlphaVantageMatch) => m["4. region"])),
    //   ],
    //   currencies: [
    //     ...new Set(testResult.map((m: AlphaVantageMatch) => m["8. currency"])),
    //   ],
    // };

    return new Response(
      JSON.stringify({
        // searchResults,
        // filterOptions,
        testResult,
        testFilterOptions,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching symbol data:", error);
    return new Response(
      JSON.stringify({
        searchResults: [],
        filterOptions: { types: [], regions: [], currencies: [] },
        error: "Failed to fetch data from Alpha Vantage API",
      }),
      { status: 500 }
    );
  }
}
