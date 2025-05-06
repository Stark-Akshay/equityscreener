// app/api/stock-overview/route.ts
import { NextResponse } from "next/server";

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || "demo";

// Define types for the API responses
interface OverviewResponse {
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
  MarketCapitalization: string;
  PERatio: string;
  DividendYield: string;
  EPS: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
  [key: string]: string; // For other properties that might exist
}

interface NewsFeedItem {
  title: string;
  url: string;
  time_published: string;
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: Array<{ topic: string; relevance_score: string }>;
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: Array<{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }>;
}

interface NewsResponse {
  feed: NewsFeedItem[];
  items: string;
  sentiment_score_definition: string;
  relevance_score_definition: string;
}

interface FilteredNewsItem {
  title: string;
  url: string;
  timePublished: string;
  summary: string;
  source: string;
  bannerImage: string;
  overallSentiment: string;
}

interface FilteredOverview {
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

interface ApiResponse {
  overview: FilteredOverview;
  news: FilteredNewsItem[];
  hasMoreNews: boolean; // Whether there are more news items available
  totalNewsCount: number; // Total number of news items available
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const newsOnly = searchParams.get("newsOnly") === "true";

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  try {
    let overviewData: OverviewResponse | null = null;
    let filteredOverview: FilteredOverview | null = null;

    // Only fetch overview if it's the first page or if newsOnly is false
    if (!newsOnly) {
      // Fetch stock overview data
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      overviewData = (await overviewResponse.json()) as OverviewResponse;

      // Extract and filter overview data
      filteredOverview = {
        Symbol: overviewData.Symbol,
        AssetType: overviewData.AssetType,
        Name: overviewData.Name,
        Description: overviewData.Description,
        Exchange: overviewData.Exchange,
        Currency: overviewData.Currency,
        Country: overviewData.Country,
        Sector: overviewData.Sector,
        Industry: overviewData.Industry,
        Address: overviewData.Address,
        OfficialSite: overviewData.OfficialSite,
        MarketCapitalization: overviewData.MarketCapitalization,
        PERatio: overviewData.PERatio,
        DividendYield: overviewData.DividendYield,
        EPS: overviewData.EPS,
        Beta: overviewData.Beta,
        "52WeekHigh": overviewData["52WeekHigh"],
        "52WeekLow": overviewData["52WeekLow"],
      };
    }

    // Fetch news data
    const newsResponse = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const newsData = (await newsResponse.json()) as NewsResponse;

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalNewsCount = newsData.feed?.length || 0;
    const hasMoreNews = endIndex < totalNewsCount;

    // Filter news data based on pagination
    const filteredNews: FilteredNewsItem[] =
      newsData.feed?.slice(startIndex, endIndex).map((item: NewsFeedItem) => ({
        title: item.title,
        url: item.url,
        timePublished: item.time_published,
        summary: item.summary,
        source: item.source,
        bannerImage: item.banner_image,
        overallSentiment: item.overall_sentiment_label,
      })) || [];

    const response: ApiResponse = {
      overview: filteredOverview || ({} as FilteredOverview),
      news: filteredNews,
      hasMoreNews,
      totalNewsCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
