// app/api/mock/stock-overview/route.ts
import { NextResponse } from "next/server";

// Mock data types matching your real API
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

// Updated interface to support pagination
interface ApiResponse {
  overview: FilteredOverview;
  news: FilteredNewsItem[];
  hasMoreNews: boolean;
  totalNewsCount: number;
}

// Mock data for popular stocks - no changes to your existing data
const mockStocks: Record<string, FilteredOverview> = {
  // Apple Inc.
  AAPL: {
    Symbol: "AAPL",
    AssetType: "Common Stock",
    Name: "Apple Inc",
    Description:
      "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, HomePod, iPod touch, and other Apple-branded and third-party accessories.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Consumer Electronics",
    Address: "One Apple Park Way, Cupertino, CA, United States, 95014",
    OfficialSite: "https://www.apple.com",
    MarketCapitalization: "2872939880000",
    PERatio: "32.57",
    DividendYield: "0.0045",
    EPS: "6.43",
    Beta: "1.265",
    "52WeekHigh": "199.62",
    "52WeekLow": "142.95",
  },
  // Microsoft Corporation
  MSFT: {
    Symbol: "MSFT",
    AssetType: "Common Stock",
    Name: "Microsoft Corporation",
    Description:
      "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. Its Productivity and Business Processes segment offers Office, Exchange, SharePoint, Microsoft Teams, Office 365 Security and Compliance, and Skype for Business, as well as related Client Access Licenses (CAL); Skype, Outlook.com, OneDrive, and LinkedIn; and Dynamics 365, a set of cloud-based and on-premises business solutions for small and medium businesses, large organizations, and divisions of enterprises.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Software—Infrastructure",
    Address: "One Microsoft Way, Redmond, WA, United States, 98052-6399",
    OfficialSite: "https://www.microsoft.com",
    MarketCapitalization: "2875431250000",
    PERatio: "38.95",
    DividendYield: "0.0071",
    EPS: "10.31",
    Beta: "0.902",
    "52WeekHigh": "432.56",
    "52WeekLow": "309.11",
  },
  // Amazon.com Inc.
  AMZN: {
    Symbol: "AMZN",
    AssetType: "Common Stock",
    Name: "Amazon.com Inc",
    Description:
      "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through three segments: North America, International, and Amazon Web Services (AWS). The company's products offered through its stores include merchandise and content purchased for resale; and products offered by third-party sellers.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Consumer Cyclical",
    Industry: "Internet Retail",
    Address: "410 Terry Avenue North, Seattle, WA, United States, 98109-5210",
    OfficialSite: "https://www.amazon.com",
    MarketCapitalization: "1891936960000",
    PERatio: "58.77",
    DividendYield: "0",
    EPS: "3.17",
    Beta: "1.154",
    "52WeekHigh": "189.77",
    "52WeekLow": "118.51",
  },
  // Tesla Inc.
  TSLA: {
    Symbol: "TSLA",
    AssetType: "Common Stock",
    Name: "Tesla Inc",
    Description:
      "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally. The company operates in two segments, Automotive, and Energy Generation and Storage. The Automotive segment offers electric vehicles, as well as sells automotive regulatory credits.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Consumer Cyclical",
    Industry: "Auto Manufacturers",
    Address: "1 Tesla Road, Austin, TX, United States, 78725",
    OfficialSite: "https://www.tesla.com",
    MarketCapitalization: "703978200000",
    PERatio: "59.85",
    DividendYield: "0",
    EPS: "3.54",
    Beta: "2.273",
    "52WeekHigh": "245.79",
    "52WeekLow": "152.37",
  },
  // Default fallback for any other symbols
  DEFAULT: {
    Symbol: "DEMO",
    AssetType: "Common Stock",
    Name: "Demo Company",
    Description:
      "This is a mock company generated for demonstration purposes. The company operates in various sectors and provides a wide range of products and services to its customers worldwide. This is not a real company, and all the information displayed is fictional.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Software",
    Address: "123 Mock Street, Demo City, NY, United States, 10001",
    OfficialSite: "https://www.example.com",
    MarketCapitalization: "500000000000",
    PERatio: "25.40",
    DividendYield: "0.0185",
    EPS: "7.35",
    Beta: "1.125",
    "52WeekHigh": "185.00",
    "52WeekLow": "120.00",
  },
};

// Base mock news data (keeping your original 5 news items)
const baseNewsItems: FilteredNewsItem[] = [
  {
    title: "Q1 Earnings Exceed Analyst Expectations",
    url: "https://example.com/news/1",
    timePublished: "20250505T130000",
    summary:
      "The company reported strong first quarter results, with revenue increasing by 15% year-over-year and earnings per share coming in at $2.35, exceeding analyst estimates of $2.10.",
    source: "Financial Times",
    bannerImage: "https://placehold.co/600x400?text=Q1+Earnings",
    overallSentiment: "Bullish",
  },
  {
    title: "New Product Line Announcement Shows Promise",
    url: "https://example.com/news/2",
    timePublished: "20250504T094500",
    summary:
      "The company unveiled its new product line yesterday, showcasing innovative features that analysts believe could capture significant market share in the coming quarters.",
    source: "Tech Insider",
    bannerImage: "https://placehold.co/600x400?text=New+Products",
    overallSentiment: "Somewhat-Bullish",
  },
  {
    title: "Industry Competition Intensifies with New Market Entrant",
    url: "https://example.com/news/3",
    timePublished: "20250503T143020",
    summary:
      "A new competitor has entered the market with a potentially disruptive business model, causing some analysts to reassess their growth projections for established players in the sector.",
    source: "Market Watch",
    bannerImage: "https://placehold.co/600x400?text=Competition",
    overallSentiment: "Neutral",
  },
  {
    title: "Company Announces Expansion into New Markets",
    url: "https://example.com/news/4",
    timePublished: "20250502T091530",
    summary:
      "The company has announced plans to expand into several new markets in the coming year, with initial investments already underway in key strategic locations.",
    source: "Business Insider",
    bannerImage: "https://placehold.co/600x400?text=Market+Expansion",
    overallSentiment: "Somewhat-Bullish",
  },
  {
    title: "Quarterly Dividend Announcement Falls Short of Expectations",
    url: "https://example.com/news/5",
    timePublished: "20250501T163000",
    summary:
      "The company's latest dividend announcement came in slightly below analyst expectations, raising questions about cash flow management strategies going forward.",
    source: "Wall Street Journal",
    bannerImage: "https://placehold.co/600x400?text=Dividend+News",
    overallSentiment: "Somewhat-Bearish",
  },
];

// Additional news items for pagination (10 more items for a total of 15)
const additionalNewsItems: FilteredNewsItem[] = [
  {
    title: "Strategic Partnership Announced with Tech Giant",
    url: "https://example.com/news/6",
    timePublished: "20250430T103045",
    summary:
      "The company has formed a strategic partnership with a major technology provider, which is expected to enhance product capabilities and provide access to new distribution channels.",
    source: "Reuters",
    bannerImage: "https://placehold.co/600x400?text=Partnership",
    overallSentiment: "Bullish",
  },
  {
    title: "Supply Chain Disruptions Could Impact Q2 Results",
    url: "https://example.com/news/7",
    timePublished: "20250429T143215",
    summary:
      "Industry analysts have expressed concerns about ongoing supply chain challenges that could potentially impact the company's second quarter performance and inventory levels.",
    source: "Bloomberg",
    bannerImage: "https://placehold.co/600x400?text=Supply+Chain",
    overallSentiment: "Somewhat-Bearish",
  },
  {
    title: "New CEO Appointment Announced",
    url: "https://example.com/news/8",
    timePublished: "20250428T083000",
    summary:
      "The board of directors has announced the appointment of a new CEO effective next month, bringing expertise from a competitor and signaling a potential shift in strategic direction.",
    source: "CNBC",
    bannerImage: "https://placehold.co/600x400?text=CEO+Appointment",
    overallSentiment: "Neutral",
  },
  {
    title: "Regulatory Approval Received for Key Product",
    url: "https://example.com/news/9",
    timePublished: "20250427T121530",
    summary:
      "The company has received regulatory approval for its flagship product in a major market, paving the way for commercial launch in the third quarter of this year.",
    source: "Industry Today",
    bannerImage: "https://placehold.co/600x400?text=Regulatory+Approval",
    overallSentiment: "Bullish",
  },
  {
    title: "Insider Trading Investigation Launched",
    url: "https://example.com/news/10",
    timePublished: "20250426T153045",
    summary:
      "Regulators have initiated an investigation into potential insider trading related to recent stock movements prior to a major announcement. The company has stated it is fully cooperating.",
    source: "Financial Post",
    bannerImage: "https://placehold.co/600x400?text=Investigation",
    overallSentiment: "Bearish",
  },
  {
    title: "Sustainability Initiative Gains Recognition",
    url: "https://example.com/news/11",
    timePublished: "20250425T091520",
    summary:
      "The company's sustainability efforts have been recognized with a prestigious industry award, highlighting its commitment to environmental stewardship and responsible business practices.",
    source: "Green Business Journal",
    bannerImage: "https://placehold.co/600x400?text=Sustainability",
    overallSentiment: "Somewhat-Bullish",
  },
  {
    title: "Patent Litigation Settlement Reached",
    url: "https://example.com/news/12",
    timePublished: "20250424T142250",
    summary:
      "A settlement has been reached in the ongoing patent litigation case, with the company agreeing to license certain technologies and pay a one-time fee that analysts consider reasonable.",
    source: "Legal Times",
    bannerImage: "https://placehold.co/600x400?text=Patent+Settlement",
    overallSentiment: "Neutral",
  },
  {
    title: "Major Share Buyback Program Announced",
    url: "https://example.com/news/13",
    timePublished: "20250423T102540",
    summary:
      "The board has approved a substantial share buyback program over the next 18 months, signaling confidence in the company's financial position and future prospects.",
    source: "Investor Daily",
    bannerImage: "https://placehold.co/600x400?text=Buyback+Program",
    overallSentiment: "Bullish",
  },
  {
    title: "Data Breach Incident Reported",
    url: "https://example.com/news/14",
    timePublished: "20250422T163010",
    summary:
      "The company has disclosed a data security incident affecting a limited number of customers. An investigation is underway, and affected individuals have been notified.",
    source: "Cybersecurity Today",
    bannerImage: "https://placehold.co/600x400?text=Data+Breach",
    overallSentiment: "Bearish",
  },
  {
    title: "International Expansion Plans Accelerated",
    url: "https://example.com/news/15",
    timePublished: "20250421T093520",
    summary:
      "Following strong results in test markets, the company has announced an acceleration of its international expansion strategy, with five new country launches planned this year.",
    source: "Global Business Review",
    bannerImage: "https://placehold.co/600x400?text=Global+Expansion",
    overallSentiment: "Bullish",
  },
];

// Combine base and additional news to create a full pool of news items
const mockNewsPool = [...baseNewsItems, ...additionalNewsItems];

// Mock data for the specific companies from the provided list - no changes to your existing data
const specificMockStocks: Record<string, FilteredOverview> = {
  // MicroAlgo Inc
  MLGO: {
    Symbol: "MLGO",
    AssetType: "Common Stock",
    Name: "MicroAlgo Inc",
    Description:
      "MicroAlgo Inc. develops and provides central processing algorithm solutions to customers in internet advertisement, gaming, and intelligent chip industries in the People's Republic of China. The company operates through two segments, Central Processing Algorithm Services, and Intelligent Chips and Services. It offers services to process massive data sets, and provides customers with customized computing results.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "China",
    Sector: "Technology",
    Industry: "Software—Application",
    Address: "888 Dongping Street, Suite 808, Hefei, China, 230031",
    OfficialSite: "https://www.microalgo.com",
    MarketCapitalization: "56378900",
    PERatio: "42.75",
    DividendYield: "0",
    EPS: "0.053",
    Beta: "1.432",
    "52WeekHigh": "8.10",
    "52WeekLow": "1.94",
  },
  // Microbot Medical Inc
  MBOT: {
    Symbol: "MBOT",
    AssetType: "Common Stock",
    Name: "Microbot Medical Inc",
    Description:
      "Microbot Medical Inc., a pre-clinical medical device company, researches, designs, and develops micro-robotic medical technologies for the treatment of vascular and neurological diseases. Its product is the LIBERTY Robotic Surgical System, an endovascular micro-robotic surgical system, which is designed to navigate through blood vessels to treat various endovascular diseases, such as embolisms, aneurysms, and occlusions.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Healthcare",
    Industry: "Medical Devices",
    Address:
      "25 Recreation Park Drive, Unit 108, Hingham, MA, United States, 02043",
    OfficialSite: "https://www.microbotmedical.com",
    MarketCapitalization: "25740600",
    PERatio: "0",
    DividendYield: "0",
    EPS: "-3.21",
    Beta: "2.516",
    "52WeekHigh": "2.85",
    "52WeekLow": "1.42",
  },
  // Microchip Technology Inc
  MCHP: {
    Symbol: "MCHP",
    AssetType: "Common Stock",
    Name: "Microchip Technology Inc",
    Description:
      "Microchip Technology Incorporated develops, manufactures, and sells smart, connected, and secure embedded control solutions in the Americas, Europe, and Asia. The company offers general purpose 8-bit, 16-bit, and 32-bit microcontrollers; 32-bit embedded microprocessors markets; and specialized microcontrollers for automotive, industrial, computing, communications, lighting, power supplies, motor control, and other applications.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Semiconductors",
    Address: "2355 West Chandler Boulevard, Chandler, AZ, United States, 85224",
    OfficialSite: "https://www.microchip.com",
    MarketCapitalization: "45812340000",
    PERatio: "25.65",
    DividendYield: "0.0195",
    EPS: "3.15",
    Beta: "1.58",
    "52WeekHigh": "94.30",
    "52WeekLow": "68.75",
  },
  // Microbot Medical Inc (Frankfurt)
  "CY9D.FRK": {
    Symbol: "CY9D.FRK",
    AssetType: "Common Stock",
    Name: "Microbot Medical Inc",
    Description:
      "Microbot Medical Inc., a pre-clinical medical device company, researches, designs, and develops micro-robotic medical technologies for the treatment of vascular and neurological diseases. Its product is the LIBERTY Robotic Surgical System, an endovascular micro-robotic surgical system, which is designed to navigate through blood vessels to treat various endovascular diseases, such as embolisms, aneurysms, and occlusions.",
    Exchange: "Frankfurt",
    Currency: "EUR",
    Country: "USA",
    Sector: "Healthcare",
    Industry: "Medical Devices",
    Address:
      "25 Recreation Park Drive, Unit 108, Hingham, MA, United States, 02043",
    OfficialSite: "https://www.microbotmedical.com",
    MarketCapitalization: "23800000",
    PERatio: "0",
    DividendYield: "0",
    EPS: "-2.95",
    Beta: "2.45",
    "52WeekHigh": "2.65",
    "52WeekLow": "1.32",
  },
  // Microchip Technology Inc (Preferred)
  MCHPP: {
    Symbol: "MCHPP",
    AssetType: "Preferred Stock",
    Name: "Microchip Technology Inc",
    Description:
      "Microchip Technology Incorporated develops, manufactures, and sells smart, connected, and secure embedded control solutions in the Americas, Europe, and Asia. The company offers general purpose 8-bit, 16-bit, and 32-bit microcontrollers; 32-bit embedded microprocessors markets; and specialized microcontrollers for automotive, industrial, computing, communications, lighting, power supplies, motor control, and other applications.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Semiconductors",
    Address: "2355 West Chandler Boulevard, Chandler, AZ, United States, 85224",
    OfficialSite: "https://www.microchip.com",
    MarketCapitalization: "1756290000",
    PERatio: "23.80",
    DividendYield: "0.0525",
    EPS: "0",
    Beta: "1.52",
    "52WeekHigh": "98.75",
    "52WeekLow": "71.42",
  },
  // Microbix Biosystems Inc
  "MBX.TRT": {
    Symbol: "MBX.TRT",
    AssetType: "Common Stock",
    Name: "Microbix Biosystems Inc.",
    Description:
      "Microbix Biosystems Inc. develops and commercializes proprietary biological and technological solutions for human health and well-being in North America, Europe, and internationally. The company offers antigens, which is used in the production of diagnostic test kits or as components of vaccine production. It also provides viral transport medium that is used for the collection, transport, and storage of specimens for infectious disease tests.",
    Exchange: "Toronto",
    Currency: "CAD",
    Country: "Canada",
    Sector: "Healthcare",
    Industry: "Biotechnology",
    Address: "265 Watline Avenue, Mississauga, ON, Canada, L4Z 1P3",
    OfficialSite: "https://www.microbix.com",
    MarketCapitalization: "56850000",
    PERatio: "29.35",
    DividendYield: "0",
    EPS: "0.017",
    Beta: "0.89",
    "52WeekHigh": "0.53",
    "52WeekLow": "0.31",
  },
  // Microalliance Group Inc
  MALG: {
    Symbol: "MALG",
    AssetType: "Common Stock",
    Name: "Microalliance Group Inc",
    Description:
      "Microalliance Group Inc. is a technology company focused on developing innovative solutions for small and medium-sized businesses. The company provides cloud-based software platforms, IT consulting services, and digital transformation solutions to help businesses optimize their operations and enhance their digital presence.",
    Exchange: "NASDAQ",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Software—Infrastructure",
    Address: "1200 Tech Drive, Suite 300, San Jose, CA, United States, 95110",
    OfficialSite: "https://www.microalliance.com",
    MarketCapitalization: "78420000",
    PERatio: "32.40",
    DividendYield: "0.0085",
    EPS: "0.85",
    Beta: "1.21",
    "52WeekHigh": "24.75",
    "52WeekLow": "15.30",
  },
  // Microbix Biosystems Inc (US OTC)
  MBXBF: {
    Symbol: "MBXBF",
    AssetType: "Common Stock",
    Name: "Microbix Biosystems Inc",
    Description:
      "Microbix Biosystems Inc. develops and commercializes proprietary biological and technological solutions for human health and well-being in North America, Europe, and internationally. The company offers antigens, which is used in the production of diagnostic test kits or as components of vaccine production. It also provides viral transport medium that is used for the collection, transport, and storage of specimens for infectious disease tests.",
    Exchange: "OTC",
    Currency: "USD",
    Country: "Canada",
    Sector: "Healthcare",
    Industry: "Biotechnology",
    Address: "265 Watline Avenue, Mississauga, ON, Canada, L4Z 1P3",
    OfficialSite: "https://www.microbix.com",
    MarketCapitalization: "44250000",
    PERatio: "28.75",
    DividendYield: "0",
    EPS: "0.013",
    Beta: "0.92",
    "52WeekHigh": "0.41",
    "52WeekLow": "0.24",
  },
  // Microchip Technology Inc (London)
  "0K19.LON": {
    Symbol: "0K19.LON",
    AssetType: "Common Stock",
    Name: "Microchip Technology Inc.",
    Description:
      "Microchip Technology Incorporated develops, manufactures, and sells smart, connected, and secure embedded control solutions in the Americas, Europe, and Asia. The company offers general purpose 8-bit, 16-bit, and 32-bit microcontrollers; 32-bit embedded microprocessors markets; and specialized microcontrollers for automotive, industrial, computing, communications, lighting, power supplies, motor control, and other applications.",
    Exchange: "London",
    Currency: "USD",
    Country: "USA",
    Sector: "Technology",
    Industry: "Semiconductors",
    Address: "2355 West Chandler Boulevard, Chandler, AZ, United States, 85224",
    OfficialSite: "https://www.microchip.com",
    MarketCapitalization: "45750000000",
    PERatio: "25.80",
    DividendYield: "0.0193",
    EPS: "3.12",
    Beta: "1.56",
    "52WeekHigh": "95.10",
    "52WeekLow": "67.85",
  },
  // MicroAlgo Inc - Warrants
  VENAF: {
    Symbol: "VENAF",
    AssetType: "Warrant",
    Name: "MicroAlgo Inc - Warrants (30/04/2027)",
    Description:
      "MicroAlgo Inc. Warrants give holders the right to purchase common stock of MicroAlgo Inc. at a specified price until the expiration date in 2027. MicroAlgo Inc. develops and provides central processing algorithm solutions to customers in internet advertisement, gaming, and intelligent chip industries in the People's Republic of China.",
    Exchange: "OTC",
    Currency: "USD",
    Country: "China",
    Sector: "Technology",
    Industry: "Software—Application",
    Address: "888 Dongping Street, Suite 808, Hefei, China, 230031",
    OfficialSite: "https://www.microalgo.com",
    MarketCapitalization: "5230000",
    PERatio: "0",
    DividendYield: "0",
    EPS: "0",
    Beta: "1.65",
    "52WeekHigh": "1.25",
    "52WeekLow": "0.32",
  },
};

// Storage for customized news items for each stock
const stockNewsCache: Record<string, FilteredNewsItem[]> = {};

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
    // Find the stock in the specific mock stocks list
    let stockOverview = specificMockStocks[symbol];

    // If not found in the specific list, try the general mock stocks
    if (!stockOverview) {
      stockOverview = mockStocks[symbol] || mockStocks["DEFAULT"];
    }

    // Create a customized news pool for this stock if it doesn't exist
    if (!stockNewsCache[symbol]) {
      stockNewsCache[symbol] = mockNewsPool.map((news) => ({
        ...news,
        title: news.title.replace("The company", stockOverview.Name),
        summary: news.summary.replace("The company", stockOverview.Name),
      }));
    }

    // Apply pagination to the news items
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalNewsCount = stockNewsCache[symbol].length;
    const paginatedNews = stockNewsCache[symbol].slice(startIndex, endIndex);
    const hasMoreNews = endIndex < totalNewsCount;

    // Create default empty overview object for when newsOnly is true
    const emptyOverview: FilteredOverview = {
      Symbol: "",
      AssetType: "",
      Name: "",
      Description: "",
      Exchange: "",
      Currency: "",
      Country: "",
      Sector: "",
      Industry: "",
      Address: "",
      OfficialSite: "",
    };

    const response: ApiResponse = {
      overview: newsOnly ? emptyOverview : { ...stockOverview },
      news: paginatedNews,
      hasMoreNews,
      totalNewsCount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating mock stock data:", error);
    return NextResponse.json(
      { error: "Failed to generate mock stock data" },
      { status: 500 }
    );
  }
}
