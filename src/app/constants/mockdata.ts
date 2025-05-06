import { FilteredNewsItem, FilteredOverview } from "../types/types";

//src/app/constants/mockdata.ts
export const testResult = [
  {
    "1. symbol": "MLGO",
    "2. name": "MicroAlgo Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.5556",
  },
  {
    "1. symbol": "MBOT",
    "2. name": "Microbot Medical Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.4444",
  },
  {
    "1. symbol": "MCHP",
    "2. name": "Microchip Technology Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.4444",
  },
  {
    "1. symbol": "CY9D.FRK",
    "2. name": "Microbot Medical Inc",
    "3. type": "Equity",
    "4. region": "Frankfurt",
    "5. marketOpen": "08:00",
    "6. marketClose": "20:00",
    "7. timezone": "UTC+02",
    "8. currency": "EUR",
    "9. matchScore": "0.4000",
  },
  {
    "1. symbol": "MCHPP",
    "2. name": "Microchip Technology Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.4000",
  },
  {
    "1. symbol": "MBX.TRT",
    "2. name": "Microbix Biosystems Inc.",
    "3. type": "Equity",
    "4. region": "Toronto",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-05",
    "8. currency": "CAD",
    "9. matchScore": "0.3636",
  },
  {
    "1. symbol": "MALG",
    "2. name": "Microalliance Group Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.3571",
  },
  {
    "1. symbol": "MBXBF",
    "2. name": "Microbix Biosystems Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.3571",
  },
  {
    "1. symbol": "0K19.LON",
    "2. name": "Microchip Technology Inc.",
    "3. type": "Equity",
    "4. region": "United Kingdom",
    "5. marketOpen": "08:00",
    "6. marketClose": "16:30",
    "7. timezone": "UTC+01",
    "8. currency": "USD",
    "9. matchScore": "0.3333",
  },
  {
    "1. symbol": "VENAF",
    "2. name": "MicroAlgo Inc - Warrants (30/04/2027)",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "0.2381",
  },
];

export const testFilterOptions = {
  types: ["Equity"],
  regions: ["United States", "Frankfurt", "Toronto", "United Kingdom"],
  currencies: ["USD", "EUR", "CAD"],
};

// Map regions to countries
export const REGION_TO_COUNTRY: { [key: string]: string } = {
  "United States": "United States",
  Frankfurt: "Germany",
  Toronto: "Canada",
  "United Kingdom": "United Kingdom",
  Japan: "Japan",
  "Hong Kong": "China",
  Shanghai: "China",
  Shenzhen: "China",
  Mumbai: "India",
  Singapore: "Singapore",
  Amsterdam: "Netherlands",
  Paris: "France",
  Milan: "Italy",
  Brussels: "Belgium",
  Lisbon: "Portugal",
  Madrid: "Spain",
  Switzerland: "Switzerland",
  Sweden: "Sweden",
  Oslo: "Norway",
  Copenhagen: "Denmark",
  Helsinki: "Finland",
  Vienna: "Austria",
  Seoul: "South Korea",
  Taiwan: "Taiwan",
  Thailand: "Thailand",
  Indonesia: "Indonesia",
  Malaysia: "Malaysia",
  Australia: "Australia",
  "New Zealand": "New Zealand",
  Brazil: "Brazil",
  Mexico: "Mexico",
  Argentina: "Argentina",
  Chile: "Chile",
  Colombia: "Colombia",
  Peru: "Peru",
  "South Africa": "South Africa",
  Israel: "Israel",
  Turkey: "Turkey",
  "Saudi Arabia": "Saudi Arabia",
  UAE: "United Arab Emirates",
  Qatar: "Qatar",
  Russia: "Russia",
};

// Map regions to Bloomberg exchange codes
export const REGION_TO_EXCHANGE_CODE: { [key: string]: string } = {
  "United States": "US",
  Frankfurt: "GR",
  Toronto: "CN",
  "United Kingdom": "LN",
  Japan: "JP",
  "Hong Kong": "HK",
  Shanghai: "CH",
  Shenzhen: "CH",
  Mumbai: "IN",
  Singapore: "SP",
  Amsterdam: "NA",
  Paris: "FP",
  Milan: "IM",
  Brussels: "BB",
  Lisbon: "PL",
  Madrid: "SM",
  Switzerland: "SW",
  Sweden: "SS",
  Oslo: "NO",
  Copenhagen: "DC",
  Helsinki: "FH",
  Vienna: "AV",
  Seoul: "KS",
  Taiwan: "TT",
  Thailand: "TB",
  Indonesia: "IJ",
  Malaysia: "MK",
  Australia: "AU",
  "New Zealand": "NZ",
  Brazil: "BZ",
  Mexico: "MM",
  Argentina: "AR",
  Chile: "CI",
  Colombia: "CB",
  Peru: "PE",
  "South Africa": "SJ",
  Israel: "IT",
  Turkey: "TI",
  "Saudi Arabia": "AB",
  UAE: "UH",
  Qatar: "QD",
  Russia: "RX",
};

// Generate Bloomberg-style ticker
export function generateBloombergTicker(
  symbol: string,
  region: string
): string {
  const exchangeCode = REGION_TO_EXCHANGE_CODE[region] || "UN"; // Default to Unknown

  // For US stocks with .X symbol format, strip the extension for Bloomberg style
  const cleanSymbol = symbol.includes(".") ? symbol.split(".")[0] : symbol;

  return `${cleanSymbol} ${exchangeCode} Equity`;
}

// Get country from region
export function getCountryFromRegion(region: string): string {
  return REGION_TO_COUNTRY[region] || region;
}

//mock data for stock overview
//Mock data for popular stocks
export const mockStocks: Record<string, FilteredOverview> = {
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

// Mock data for specific stocks
export const specificMockStocks: Record<string, FilteredOverview> = {
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
  // Other stocks remain unchanged... (truncated for brevity)
};

// Base mock news data
export const baseNewsItems: FilteredNewsItem[] = [
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

// Additional news items for pagination
export const additionalNewsItems: FilteredNewsItem[] = [
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

// Combined news pool for convenience
export const mockNewsPool = [...baseNewsItems, ...additionalNewsItems];
